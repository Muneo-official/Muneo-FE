'use client';

import { useCallback, useState } from 'react';
import { useAskChatbot } from '@/api/chatbot';
import { ApiError, isApiError } from '@/api/errors';
import { trackEvent } from '@/lib/analytics';

export type ChatMessageKind = 'text' | 'login-required';
export type ChatMessageStatus = 'loading' | 'typing' | 'done';

export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  kind?: ChatMessageKind;
  status?: ChatMessageStatus;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'ai',
    content: '안녕하세요! 인테리어 AI 상담 문어입니다. 무엇을 도와드릴까요?',
    status: 'done',
  },
];

const FALLBACK_ERROR_MESSAGE = '죄송해요, 답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.';
const LOGIN_REQUIRED_MESSAGE = '로그인이 필요해요!';

const createMessageId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `u-${crypto.randomUUID()}`
    : `u-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const isUnauthorized = (error: unknown): boolean =>
  error instanceof ApiError && (error.status === 401 || error.code === 'UNAUTHORIZED');

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const { mutate, isPending } = useAskChatbot();

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isPending) {
        return false;
      }
      trackEvent('chat_message_send');
      const pendingId = createMessageId();
      setMessages((prev) => [
        ...prev,
        { id: createMessageId(), role: 'user', content: trimmed, status: 'done' },
        { id: pendingId, role: 'ai', content: '', status: 'loading' },
      ]);
      mutate(
        { question: trimmed },
        {
          onSuccess: (data) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === pendingId ? { ...m, content: data.answer, status: 'typing', kind: 'text' } : m))
            );
          },
          onError: (error) => {
            if (isUnauthorized(error)) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === pendingId
                    ? { ...m, content: LOGIN_REQUIRED_MESSAGE, status: 'done', kind: 'login-required' }
                    : m
                )
              );
              return;
            }
            const message = isApiError(error) ? error.message : FALLBACK_ERROR_MESSAGE;
            setMessages((prev) =>
              prev.map((m) => (m.id === pendingId ? { ...m, content: message, status: 'done', kind: 'text' } : m))
            );
          },
        }
      );
      return true;
    },
    [mutate, isPending]
  );

  const completeTyping = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'done' } : m)));
  }, []);

  return { messages, send, completeTyping, isPending };
};
