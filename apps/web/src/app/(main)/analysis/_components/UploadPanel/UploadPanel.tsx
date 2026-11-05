'use client';

import { Button } from '@muneo/design-system';
import { useRef, useState } from 'react';
import { useUser } from '@/app/(main)/_components/UserProvider/UserProvider';
import { validateFiles } from '../../_lib/analysisPayload';
import { useAnalysisStore } from '../../_store/analysisStore';
import * as styles from './UploadPanel.css';

const ACCEPT = '.pdf,.jpg,.jpeg,.png,.csv,.xls,.xlsx';

export const UploadPanelContent = ({
  onSubmit,
  disabled = false,
  submitLabel = '분석 시작',
}: {
  onSubmit: () => void;
  disabled?: boolean;
  submitLabel?: string;
}) => {
  const files = useAnalysisStore((state) => state.files);
  const addFile = useAnalysisStore((state) => state.addFile);
  const removeFile = useAnalysisStore((state) => state.removeFile);
  const reset = useAnalysisStore((state) => state.reset);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }
    const existing = new Set(files.map(({ name }) => name));
    const added = Array.from(fileList).filter((file) => {
      if (existing.has(file.name)) {
        return false;
      }
      existing.add(file.name);
      return true;
    });
    const message = validateFiles([...files.map(({ file }) => file), ...added]);
    setFileError(message);
    if (!message) {
      added.forEach(addFile);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>견적서 업로드</span>
        <span className={styles.sectionSubtitle}>견적서를 업로드하여 분석할 수 있습니다.</span>
      </div>

      <div className={styles.body}>
        <div className={styles.uploadArea}>
          <div
            role="button"
            aria-label="견적서 파일 업로드"
            tabIndex={0}
            className={`${styles.dropzone}${dragging ? ` ${styles.dropzoneDragging}` : ''}`}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (e.key === ' ') {
                  e.preventDefault();
                }
                inputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            <div className={styles.dropzoneText}>
              <p className={styles.dropzoneMain}>파일을 드래그하거나 클릭하여 업로드</p>
              <p className={styles.dropzoneSub}>PDF, JPG, PNG, CSV, Excel · 최대 5개 / 파일당 10MB</p>
            </div>
            <Button as="span" variant="outlineSecondaryStrong" size="sm" aria-hidden="true">
              파일 업로드
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            hidden
            aria-label="견적서 파일"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {fileError && <p role="alert">{fileError}</p>}

          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map((f) => (
                <div key={f.name} className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{f.name}</span>
                    <span className={styles.fileSize}>{f.size}</span>
                  </div>
                  <button type="button" className={styles.fileDelete} onClick={() => removeFile(f.name)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <Button
            variant="outlineSecondaryStrong"
            size="md"
            className={styles.actionButton}
            onClick={() => {
              reset();
              setFileError(null);
            }}
            disabled={disabled}
          >
            초기화 ↺
          </Button>
          <Button variant="gradient" size="md" className={styles.actionButton} disabled={disabled} onClick={onSubmit}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UploadPanel = () => {
  const user = useUser();
  const loading = useAnalysisStore((state) => state.loading);
  const submitAnalysis = useAnalysisStore((state) => state.submitAnalysis);
  return (
    <UploadPanelContent
      disabled={loading}
      onSubmit={() => {
        if (!loading) {
          void submitAnalysis(user.id);
        }
      }}
    />
  );
};
