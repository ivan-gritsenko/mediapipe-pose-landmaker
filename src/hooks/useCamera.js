import { useRef, useCallback } from 'react'

export const useCamera = (onStreamStart) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const isStreamingRef = useRef(false)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        isStreamingRef.current = true

        if (onStreamStart) {
          onStreamStart(videoRef.current, canvasRef.current)
        }
      }

      return true
    } catch (err) {
      console.error('Camera access error:', err)
      throw new Error(`Camera access error: ${err.message}`)
    }
  }, [onStreamStart])

  const stopCamera = useCallback(() => {
    isStreamingRef.current = false

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [])

  return {
    videoRef,
    canvasRef,
    streamRef,
    isStreamingRef,
    startCamera,
    stopCamera,
  }
}

