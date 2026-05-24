import Autocomplete, {
  type AutocompleteProps,
} from '@mui/material/Autocomplete';

import CustomTextField from './CustomTextField';

interface CustomAutocompleteProps<T> extends Omit<
  AutocompleteProps<T, false, false, false>,
  'renderInput' | 'size'
> {
  placeholder?: string;
}

export default function CustomAutocomplete<T>({
  placeholder,
  ...props
}: CustomAutocompleteProps<T>) {
  return (
    <Autocomplete
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            boxShadow: 4,
            mt: 0.5,
          },
        },
        listbox: {
          sx: {
            py: 0.5,
            '& .MuiAutocomplete-option': {
              py: 1,
            },
          },
        },
      }}
      {...props}
      size="small"
      renderInput={(params) => (
        <CustomTextField {...params} placeholder={placeholder} />
      )}
    />
  );
}
