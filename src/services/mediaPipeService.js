import {
  MEDIAPIPE_CDN_URL,
  WASM_CDN_URL,
  FACE_LANDMARKER_MODEL,
  POSE_LANDMARKER_MODEL,
  HAND_LANDMARKER_MODEL,
} from '../constants/mediapipe'

export const initializeMediaPipe = async () => {
  const mediaPipeModule = await import(MEDIAPIPE_CDN_URL)
  const {
    FaceLandmarker,
    PoseLandmarker,
    HandLandmarker,
    FilesetResolver,
    DrawingUtils,
  } = mediaPipeModule

  const vision = await FilesetResolver.forVisionTasks(WASM_CDN_URL)

  const [faceLandmarker, poseLandmarker, handLandmarker] = await Promise.all([
    FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: FACE_LANDMARKER_MODEL,
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      outputSegmentationMasks: true,
      runningMode: 'VIDEO',
      numFaces: 1,
    }),
    PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: POSE_LANDMARKER_MODEL,
        delegate: 'GPU',
      },
      outputSegmentationMasks: false,
      runningMode: 'VIDEO',
    }),
    HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: HAND_LANDMARKER_MODEL,
        delegate: 'GPU',
      },
      numHands: 2,
      runningMode: 'VIDEO',
    }),
  ])

  return {
    FaceLandmarker,
    PoseLandmarker,
    HandLandmarker,
    DrawingUtils,
    faceLandmarker,
    poseLandmarker,
    handLandmarker,
  }
}

