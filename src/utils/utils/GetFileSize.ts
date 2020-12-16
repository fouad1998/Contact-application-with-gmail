export const getFileSize = (size: number) => {
  let i = 0;
  const units = ['B', 'KB', 'MB', 'KB', 'GB', 'TB'];
  while (size / 1024 > 1) {
    ++i;
    size /= 1024;
  }
  return `${size.toFixed(2)}${units[i]}`;
};
