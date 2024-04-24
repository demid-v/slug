const formatTime = (time: number | undefined) => {
  if (typeof time === "undefined") return "0:00";

  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(1, "0");
  const seconds = Math.round(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export const getVoiceTime = (
  duration: number | undefined,
  currentTime: number,
  isPlaying: boolean,
) => {
  return isPlaying ? formatTime(currentTime) : formatTime(duration);
};
