import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface CopyrightProps extends Omit<BoxProps, 'children'> {
  /** Org/product name shown after the © symbol. */
  name?: string;
}

export default function Copyright({
  name = 'Your Organization',
  ...props
}: CopyrightProps) {
  return (
    <Box
      component="footer"
      {...props}
      sx={[
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 0.5,
          columnGap: 1,
          pt: 4,
          pb: 2,
          '@media print': { display: 'none' },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Typography variant="caption" color="text.secondary">
        © {name} {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
