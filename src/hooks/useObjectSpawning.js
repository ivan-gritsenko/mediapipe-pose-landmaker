import { useRef, useEffect, useCallback } from 'react'
import { SPAWN_INTERVAL } from '../constants/game'
import { createRandomObject } from '../utils/objectSpawner'

export const useObjectSpawning = (isStreaming, canvasRef, isStreamingRef) => {
  const objectsRef = useRef([])
  const spawnIntervalRef = useRef(null)

  const spawnRandomObject = useCallback(() => {
    if (!canvasRef.current || !isStreamingRef.current) return

    const canvas = canvasRef.current
    const newObject = createRandomObject(canvas)

    if (newObject) {
      objectsRef.current = [...objectsRef.current, newObject]

      setTimeout(() => {
        objectsRef.current = objectsRef.current.filter(obj => obj.id !== newObject.id)
      }, newObject.duration)
    }
  }, [canvasRef, isStreamingRef])

  useEffect(() => {
    if (!isStreaming) {
      objectsRef.current = []
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current)
        spawnIntervalRef.current = null
      }
      return
    }

    spawnRandomObject()
    spawnIntervalRef.current = setInterval(spawnRandomObject, SPAWN_INTERVAL)

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current)
      }
    }
  }, [isStreaming, spawnRandomObject])

  return { objectsRef, spawnIntervalRef }
}

