import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Copyright() {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        rowGap: 0.5,
        columnGap: 1,
        pt: 4,
        pb: 2,
        '@media print': { display: 'none' },
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © Template {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
