export const formatTime = (date?: string) => {
  if (!date) return "";

  const d = new Date(date);
  const now = new Date();

  const diff = now.getTime() - d.getTime();
  const hours = diff / (1000 * 60 * 60);

  if (hours < 1) return `${Math.floor(diff / 60000)}m`;
  if (hours < 24) return `${Math.floor(hours)}h`;

  return d.toLocaleDateString();
};