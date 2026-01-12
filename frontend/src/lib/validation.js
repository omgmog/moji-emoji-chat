export function isEmojiOnly(text) {
  if (!text.trim()) return true;
  const hasLettersOrNumbers = /[a-zA-Z0-9]/.test(text);
  return !hasLettersOrNumbers;
}
