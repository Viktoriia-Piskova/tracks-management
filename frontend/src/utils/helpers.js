export function formatIsoTime(isoTime) {
  const date = new Date(isoTime);
  return date.toLocaleString("en-UA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function validateImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(url);
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}