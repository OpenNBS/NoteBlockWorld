export const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.ceil(totalSeconds % 60);

  const formattedTime = `${minutes.toString().padStart(1, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
  return formattedTime;
};
