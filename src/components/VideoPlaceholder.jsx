import { Box, Stack, Typography, CircularProgress } from '@mui/material'
import { CameraAlt } from '@mui/icons-material'

const VideoPlaceholder = ({ isModelLoaded }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s linear infinite',
          '@keyframes float': {
            '0%': { transform: 'translate(0, 0) rotate(0deg)' },
            '100%': { transform: 'translate(50px, 50px) rotate(360deg)' },
          },
        }}
      />

      <Stack
        spacing={3}
        alignItems="center"
        sx={{ position: 'relative', zIndex: 2 }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
            },
          }}
        >
          <CameraAlt
            sx={{
              fontSize: 80,
              color: 'white',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
            }}
          />
        </Box>

        <Stack spacing={1} alignItems="center">
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 700,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            Ready to Start
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            Click the button below to start tracking
          </Typography>
        </Stack>

        {!isModelLoaded && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={20} sx={{ color: 'white' }} />
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Loading models...
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default VideoPlaceholder

