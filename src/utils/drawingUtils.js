import { FADE_IN_THRESHOLD, FADE_OUT_THRESHOLD } from '../constants/game'
import { getCatchAnimation } from './catchEffects'

export const drawFaceMask = (mask, ctx, canvas) => {
  const maskImage = ctx.createImageData(mask.width, mask.height)
  const maskData = maskImage.data

  for (let i = 0; i < mask.data.length; i++) {
    const maskValue = mask.data[i]
    maskData[i * 4] = 0      // R
    maskData[i * 4 + 1] = 255 // G
    maskData[i * 4 + 2] = 0   // B
    maskData[i * 4 + 3] = maskValue * 150 // A
  }

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = mask.width
  tempCanvas.height = mask.height
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.putImageData(maskImage, 0, 0)

  ctx.drawImage(
    tempCanvas,
    0, 0, mask.width, mask.height,
    0, 0, canvas.width, canvas.height
  )
}

export const drawObjects = (ctx, canvas, objects, caughtObjects = {}) => {
  if (!objects || objects.length === 0) return

  ctx.save()
  ctx.scale(-1, 1)
  ctx.translate(-canvas.width, 0)

  const currentTime = Date.now()
  objects.forEach(obj => {
    const elapsed = currentTime - obj.spawnTime
    const progress = Math.min(elapsed / obj.duration, 1)

    let alpha = progress < FADE_IN_THRESHOLD
      ? progress / FADE_IN_THRESHOLD
      : progress > FADE_OUT_THRESHOLD
        ? (1 - progress) / (1 - FADE_OUT_THRESHOLD)
        : 1

    let scale = 1

    const catchData = caughtObjects[obj.id]
    if (catchData) {
      const catchElapsed = currentTime - catchData.catchTime
      const catchAnim = getCatchAnimation(catchElapsed)
      scale = catchAnim.scale
      alpha = catchAnim.alpha
    }

    const centerX = obj.x + obj.size / 2
    const centerY = obj.y + obj.size / 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.scale(scale, scale)
    ctx.translate(-centerX, -centerY)

    ctx.globalAlpha = alpha
    ctx.font = `${obj.size}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    ctx.fillText(obj.emoji, centerX, centerY)

    ctx.restore()
  })

  ctx.restore()
}

