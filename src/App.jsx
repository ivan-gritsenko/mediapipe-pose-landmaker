import { Box, Container, Typography, Paper } from '@mui/material'
import MediaPipeStudio from './components/MediaPipeStudio'
import './App.css'

function App() {
  return (
    <Box className="app">
      <Paper
        elevation={4}
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 0,
          py: 3,
          mb: 3,
        }}
      >
        <Container>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            fontWeight={700}
            color="white"
            gutterBottom
          >
            MediaPipe Pose Landmarker
          </Typography>
        </Container>
      </Paper>

      <Container className="app-main">
        <MediaPipeStudio />
      </Container>
    </Box>
  )
}

export default App

