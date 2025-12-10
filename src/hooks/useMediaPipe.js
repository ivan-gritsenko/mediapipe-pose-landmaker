import { useState, useRef, useCallback } from 'react'
import { initializeMediaPipe } from '../services/mediaPipeService'

export const useMediaPipe = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [error, setError] = useState(null)
  
  const faceLandmarkerRef = useRef(null)
  const poseLandmarkerRef = useRef(null)
  const handLandmarkerRef = useRef(null)
  const drawingUtilsRef = useRef(null)
  const mediaPipeRef = useRef(null)

  const initialize = useCallback(async () => {
    try {
      setError(null)

      const {
        FaceLandmarker,
        PoseLandmarker,
        HandLandmarker,
        DrawingUtils,
        faceLandmarker,
        poseLandmarker,
        handLandmarker,
      } = await initializeMediaPipe()

      mediaPipeRef.current = {
        FaceLandmarker,
        PoseLandmarker,
        HandLandmarker,
        DrawingUtils,
      }

      faceLandmarkerRef.current = faceLandmarker
      poseLandmarkerRef.current = poseLandmarker
      handLandmarkerRef.current = handLandmarker
      setIsModelLoaded(true)
    } catch (err) {
      setError(`Failed to load MediaPipe models: ${err.message}`)
      console.error('MediaPipe initialization error:', err)
    }
  }, [])

  return {
    isModelLoaded,
    error,
    faceLandmarkerRef,
    poseLandmarkerRef,
    handLandmarkerRef,
    drawingUtilsRef,
    mediaPipeRef,
    initialize,
  }
}

