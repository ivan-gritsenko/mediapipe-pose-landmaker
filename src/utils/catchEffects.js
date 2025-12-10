export const getCatchAnimation = (elapsed) => {
  const duration = 200
  const progress = Math.min(elapsed / duration, 1)

  return {
    scale: 1 + progress * 0.3,
    alpha: 1 - progress,
  }
}
