import { useState, useRef, useEffect, useCallback } from 'react'
import { Box, Paper, Alert, Stack } from '@mui/material'
import { useMediaPipe } from '../hooks/useMediaPipe'
import { useCamera } from '../hooks/useCamera'
import { useObjectSpawning } from '../hooks/useObjectSpawning'
import { checkObjectHandCollision } from '../utils/collisionDetection'
import { drawFaceMask, drawObjects } from '../utils/drawingUtils'
import VideoPlaceholder from './VideoPlaceholder'
import VideoControls from './VideoControls'
import ScoreCounter from './ScoreCounter'
import './MediaPipeStudio.css'

const MediaPipeStudio = () => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [caughtCount, setCaughtCount] = useState(0)
  const [showFaceMask, setShowFaceMask] = useState(false)

  const animationFrameRef = useRef(null)
  const caughtObjectsRef = useRef({})

  const {
    isModelLoaded,
    error: mediaPipeError,
    faceLandmarkerRef,
    poseLandmarkerRef,
    handLandmarkerRef,
    drawingUtilsRef,
    mediaPipeRef,
    initialize,
  } = useMediaPipe()

  const handleStreamStart = useCallback((video, canvas) => {
    if (canvas && mediaPipeRef.current?.DrawingUtils) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      drawingUtilsRef.current = new mediaPipeRef.current.DrawingUtils(canvas.getContext('2d'))
    }
  }, [mediaPipeRef, drawingUtilsRef])

  const {
    videoRef,
    canvasRef,
    streamRef,
    isStreamingRef,
    startCamera: startCameraHook,
    stopCamera: stopCameraHook,
  } = useCamera(handleStreamStart)

  const { objectsRef } = useObjectSpawning(isStreaming, canvasRef, isStreamingRef)

  const predictWebcam = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const { FaceLandmarker, PoseLandmarker, HandLandmarker } = mediaPipeRef.current || {}

    if (!video || !canvas || !FaceLandmarker || !PoseLandmarker || !HandLandmarker || !isStreamingRef.current) {
      return
    }

    if (video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(predictWebcam)
      return
    }

    const startTimeMs = performance.now()
    const ctx = canvas.getContext('2d')

    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(-1, 1)
    ctx.translate(-canvas.width, 0)

    let handResults = null
    if (handLandmarkerRef.current) {
      try {
        handResults = handLandmarkerRef.current.detectForVideo(video, startTimeMs)

        if (handResults.landmarks?.length > 0 && objectsRef.current.length > 0) {
          objectsRef.current.forEach(obj => {
            // Skip if already being caught
            if (caughtObjectsRef.current[obj.id]) return

            if (checkObjectHandCollision(obj, handResults.landmarks, canvas.width, canvas.height)) {
              // Mark object as caught for animation
              caughtObjectsRef.current[obj.id] = {
                catchTime: Date.now(),
              }

              // Remove object after animation completes
              setTimeout(() => {
                delete caughtObjectsRef.current[obj.id]
                objectsRef.current = objectsRef.current.filter(o => o.id !== obj.id)
                setCaughtCount(prev => prev + 1)
              }, 200)
            }
          })
        }
      } catch (err) {
        console.error('Hand detection error:', err)
      }
    }

    if (handResults?.landmarks?.length > 0 && drawingUtilsRef.current) {
      for (const landmarks of handResults.landmarks) {
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          HandLandmarker.HAND_CONNECTIONS,
          { color: '#00FFFF', lineWidth: 2 }
        )
        drawingUtilsRef.current.drawLandmarks(landmarks, {
          color: '#FF00FF',
          radius: 3,
          lineWidth: 1,
        })
      }
    }

    if (poseLandmarkerRef.current) {
      try {
        const poseResults = poseLandmarkerRef.current.detectForVideo(video, startTimeMs)

        if (poseResults.landmarks?.length > 0 && drawingUtilsRef.current) {
          for (const landmarks of poseResults.landmarks) {
            drawingUtilsRef.current.drawConnectors(
              landmarks,
              PoseLandmarker.POSE_CONNECTIONS,
              { color: '#ffffff', lineWidth: 2 }
            )
            drawingUtilsRef.current.drawLandmarks(landmarks, {
              color: '#323232',
              radius: 3,
              lineWidth: 4,
              borderRadius: 2,
              borderColor: '#000000',
            })
          }
        }
      } catch (err) {
        console.error('Pose detection error:', err)
      }
    }

    if (faceLandmarkerRef.current) {
      try {
        const faceResults = faceLandmarkerRef.current.detectForVideo(video, startTimeMs)

        if (faceResults.faceLandmarks?.length > 0) {
          if (showFaceMask && faceResults.segmentationMasks?.length > 0) {
            drawFaceMask(faceResults.segmentationMasks[0], ctx, canvas)
          }
        }
      } catch (err) {
        console.error('Face detection error:', err)
      }
    }

    ctx.restore()

    drawObjects(ctx, canvas, objectsRef.current, caughtObjectsRef.current)

    if (isStreamingRef.current) {
      animationFrameRef.current = requestAnimationFrame(predictWebcam)
    }
  }, [showFaceMask, videoRef, canvasRef, mediaPipeRef, isStreamingRef, handLandmarkerRef, poseLandmarkerRef, faceLandmarkerRef, drawingUtilsRef, objectsRef])

  const startCamera = useCallback(async () => {
    try {
      await startCameraHook()
      setIsStreaming(true)
      predictWebcam()
    } catch (err) {
      // Error is handled in hook
    }
  }, [startCameraHook, predictWebcam])

  const stopCamera = useCallback(() => {
    stopCameraHook()
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    caughtObjectsRef.current = {}
    setCaughtCount(0)
    setIsStreaming(false)
  }, [stopCameraHook])

  useEffect(() => {
    initialize()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [initialize, streamRef])

  const error = mediaPipeError

  return (
    <Box className="mediapipe-studio">
      <Paper
        elevation={8}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Stack spacing={3}>
          <Box className="video-wrapper">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-element"
              style={{ display: isStreaming ? 'block' : 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="canvas-overlay"
              style={{ display: isStreaming ? 'block' : 'none' }}
            />

            {!isStreaming && <VideoPlaceholder isModelLoaded={isModelLoaded} />}
          </Box>

          <Stack spacing={2}>
            <VideoControls
              isStreaming={isStreaming}
              isModelLoaded={isModelLoaded}
              onStart={startCamera}
              onStop={stopCamera}
            />

            {isStreaming && (
              <Stack direction="row" justifyContent="center" spacing={2} flexWrap="wrap">
                <ScoreCounter count={caughtCount} />
              </Stack>
            )}
          </Stack>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}

export default MediaPipeStudio
