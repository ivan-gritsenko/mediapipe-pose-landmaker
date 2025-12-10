import { Paper, Stack, Typography } from '@mui/material'
import { EmojiEvents } from '@mui/icons-material'

const ScoreCounter = ({ count }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
        background: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'success.main',
        borderWidth: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <EmojiEvents color="success" />
        <Typography variant="h6" color="success.main" fontWeight={700}>
          Caught: {count}
        </Typography>
      </Stack>
    </Paper>
  )
}

export default ScoreCounter

