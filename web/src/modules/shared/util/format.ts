export const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(Math.ceil(totalSeconds) / 60);
  const seconds = Math.ceil(totalSeconds) % 60;

  const formattedTime = `${minutes.toFixed().padStart(1, '0')}:${seconds
    .toFixed()
    .padStart(2, '0')}`;

  return formattedTime;
};

export const formatTimeAgo = (date: Date) => {
  if (!date) return '';

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes == 1) {
    return 'a minute ago';
  }

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours <= 1) {
    return 'an hour ago';
  }

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  if (days <= 1) {
    return 'yesterday';
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks <= 1) {
    return 'a week ago';
  }

  if (weeks < 4) {
    return `${weeks} weeks ago`;
  }

  const months = Math.floor(days / 30);

  if (months <= 1) {
    return 'a month ago';
  }

  if (months < 12) {
    return `${months} months ago`;
  }

  const years = Math.floor(days / 365);

  if (years <= 1) {
    return 'a year ago';
  }

  return `${years} years ago`;
};

export const formatTimeSpent = (totalMinutes: number) => {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.ceil(totalMinutes % 60);

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
};
