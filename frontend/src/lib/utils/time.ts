export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimeFromString = (timeString: string | null | undefined) => {
  if (!timeString) return '--:--';
  const date = new Date(timeString);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
