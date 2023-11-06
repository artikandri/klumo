export const randomDelay = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isElementVisible = (el, holder) => {
  holder = holder || document.body;
  const { top, bottom, height } = el.getBoundingClientRect();
  const holderRect = holder.getBoundingClientRect();

  return top <= holderRect.top
    ? holderRect.top - top <= height
    : bottom - holderRect.bottom <= height;
};

export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
