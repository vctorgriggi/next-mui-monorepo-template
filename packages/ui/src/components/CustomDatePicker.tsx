import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

interface CustomDatePickerProps extends Omit<
  DatePickerProps<Dayjs>,
  'slotProps'
> {
  placeholder?: string;
}

export default function CustomDatePicker({
  placeholder = 'Selecione uma data',
  ...props
}: CustomDatePickerProps) {
  return (
    <DatePicker
      {...props}
      slotProps={{
        textField: {
          size: 'small',
          placeholder,
          fullWidth: true,
        },
        openPickerIcon: {
          fontSize: 'small',
        },
      }}
    />
  );
}
