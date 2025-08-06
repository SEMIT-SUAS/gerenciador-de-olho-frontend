export function textAliases(text: string) {
  const maxLength = 80;
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
