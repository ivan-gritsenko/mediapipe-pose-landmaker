import { FOOD_EMOJIS, OBJECT_DURATION } from '../constants/game'

export const createRandomObject = (canvas) => {
  if (!canvas) return null

  const randomObject = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
  const x = Math.random() * (canvas.width - randomObject.size)
  const y = Math.random() * (canvas.height - randomObject.size)
  const id = Date.now() + Math.random()

  return {
    id,
    emoji: randomObject.emoji,
    x,
    y,
    size: randomObject.size,
    spawnTime: Date.now(),
    duration: OBJECT_DURATION,
  }
}

