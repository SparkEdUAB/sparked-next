import i18next from 'i18next';

export default function getProcessCodeMeaning(code: number): string {
  return i18next.t(`process_code_${code}`);
}
