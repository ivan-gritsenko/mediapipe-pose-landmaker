import { PALM_POINTS, COLLISION_RADIUS_MULTIPLIER, WRIST_COLLISION_RADIUS_MULTIPLIER } from '../constants/game'

export const checkObjectHandCollision = (obj, handLandmarks, canvasWidth, canvasHeight) => {
  if (!handLandmarks || handLandmarks.length === 0) return false

  const objCenterX = obj.x + obj.size / 2
  const objCenterY = obj.y + obj.size / 2
  const objRadius = obj.size / 2

  for (const hand of handLandmarks) {
    for (const pointIndex of PALM_POINTS) {
      if (hand[pointIndex]) {
        const handX = hand[pointIndex].x * canvasWidth
        const handY = hand[pointIndex].y * canvasHeight
        const distance = Math.sqrt(
          Math.pow(objCenterX - handX, 2) + Math.pow(objCenterY - handY, 2)
        )

        if (distance < objRadius * COLLISION_RADIUS_MULTIPLIER) {
          return true
        }
      }
    }

    if (hand[0]) {
      const wristX = hand[0].x * canvasWidth
      const wristY = hand[0].y * canvasHeight
      const distance = Math.sqrt(
        Math.pow(objCenterX - wristX, 2) + Math.pow(objCenterY - wristY, 2)
      )

      if (distance < objRadius * WRIST_COLLISION_RADIUS_MULTIPLIER) {
        return true
      }
    }
  }

  return false
}

