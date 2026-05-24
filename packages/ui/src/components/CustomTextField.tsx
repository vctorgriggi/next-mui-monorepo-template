import TextField, { TextFieldProps } from '@mui/material/TextField';

export default function CustomTextField({ ...props }: TextFieldProps) {
  return <TextField fullWidth variant="outlined" {...props} />;
}
