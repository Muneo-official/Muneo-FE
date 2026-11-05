import { type RiskAnalyzeRequestBody } from '@/api/analyze';
import { type AnalysisFormData, type UploadedFile } from '../_types/analysis.types';

export const validateFiles = (files: File[]): string | null => {
  if (files.length === 0) {
    return '견적서를 한 개 이상 올려 주세요.';
  }
  if (files.length > 5) {
    return '파일은 최대 5개까지 올릴 수 있어요.';
  }
  if (files.some((file) => !/\.(pdf|jpe?g|png|csv|xlsx?)$/i.test(file.name))) {
    return 'PDF, JPG, PNG, CSV, Excel 파일을 올려 주세요.';
  }
  if (files.some((file) => file.size === 0 || file.size > 10 * 1024 * 1024)) {
    return '각 파일은 비어 있지 않은 10MB 이하 파일이어야 해요.';
  }
  if (files.reduce((sum, file) => sum + file.size, 0) > 20 * 1024 * 1024) {
    return '전체 파일 크기는 20MB 이하여야 해요.';
  }
  return null;
};

export const buildAnalysisPayload = (form: AnalysisFormData, files: UploadedFile[]) => {
  if (
    !form.spaceType ||
    !form.elevator ||
    !form.region ||
    !form.buildingAge ||
    !form.companyName?.trim() ||
    form.pyeong === null ||
    !Number.isInteger(form.pyeong) ||
    form.pyeong < 1 ||
    form.roomCount === null ||
    !Number.isInteger(form.roomCount) ||
    form.roomCount < 0 ||
    form.floor === null ||
    !Number.isInteger(form.floor)
  ) {
    throw new Error('공사 정보를 모두 입력해 주세요. 면적은 1평 이상, 방 개수는 0개 이상이어야 해요.');
  }
  const fileError = validateFiles(files.map(({ file }) => file));
  if (fileError) {
    throw new Error(fileError);
  }
  const input: RiskAnalyzeRequestBody = {
    space_type: form.spaceType,
    pyeong: form.pyeong,
    room_count: form.roomCount,
    floor: form.floor,
    elevator: form.elevator === '있음',
    region: form.region,
    building_age: form.buildingAge,
    company_name: form.companyName.trim(),
  };
  const body = new FormData();
  for (const [key, value] of Object.entries(input)) {
    body.append(key, String(value));
  }
  for (const item of files) {
    body.append('files', item.file, item.name);
  }
  return { input, body };
};
