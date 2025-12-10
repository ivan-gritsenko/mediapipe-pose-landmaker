import { Button, Stack } from '@mui/material'
import { Videocam, VideocamOff } from '@mui/icons-material'

const VideoControls = ({ isStreaming, isModelLoaded, onStart, onStop }) => {
  return (
    <Stack direction="row" justifyContent="center" spacing={2}>
      {!isStreaming ? (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Videocam />}
          onClick={onStart}
          disabled={!isModelLoaded}
          sx={{ px: 4, py: 1.5 }}
        >
          Start tracking
        </Button>
      ) : (
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={<VideocamOff />}
          onClick={onStop}
          sx={{ px: 4, py: 1.5 }}
        >
          Stop tracking
        </Button>
      )}
    </Stack>
  )
}

export default VideoControls

