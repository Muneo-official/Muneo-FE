import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { adminQaPlugin } from './qa/plugin';

const DEFAULT_API_BASE_URL = 'https://api-dev.muneo.kr';

export default defineConfig(({ mode, command }) => {
  const isQa = mode === 'qa';
  if (isQa && command === 'build') {
    throw new Error('QA 모드는 배포할 수 없습니다. 일반 build 명령을 사용하세요.');
  }
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

  return {
    plugins: [react(), vanillaExtractPlugin(), tsconfigPaths(), ...(isQa ? [adminQaPlugin()] : [])],
    server: {
      port: 5173,
      proxy: isQa
        ? undefined
        : {
            '/api': {
              target: apiBaseUrl,
              changeOrigin: true,
              secure: true,
              cookieDomainRewrite: '',
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq) => {
                  proxyReq.removeHeader('origin');
                  proxyReq.removeHeader('referer');
                });
              },
            },
          },
    },
  };
});
