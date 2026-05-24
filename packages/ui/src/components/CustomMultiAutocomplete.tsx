import Autocomplete, {
  type AutocompleteProps,
} from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';

import CustomTextField from './CustomTextField';

interface CustomMultiAutocompleteProps<T> extends Omit<
  AutocompleteProps<T, true, false, false>,
  'renderInput' | 'size' | 'multiple'
> {
  placeholder?: string;
}

export default function CustomMultiAutocomplete<T>({
  placeholder,
  disableCloseOnSelect = true,
  ...props
}: CustomMultiAutocompleteProps<T>) {
  const labelFor = (option: T) =>
    props.getOptionLabel ? props.getOptionLabel(option) : String(option);
  const hasSelection = (props.value?.length ?? 0) > 0;

  return (
    <Autocomplete
      renderOption={(optionProps, option, { selected }) => {
        const { key, ...rest } = optionProps;
        return (
          <li key={key} {...rest}>
            <Checkbox size="small" checked={selected} sx={{ mr: 1, p: 0.5 }} />
            {labelFor(option)}
          </li>
        );
      }}
      renderTags={(selected) => selected.map(labelFor).join(', ')}
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
      multiple
      size="small"
      disableCloseOnSelect={disableCloseOnSelect}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          placeholder={hasSelection ? '' : placeholder}
        />
      )}
    />
  );
}
