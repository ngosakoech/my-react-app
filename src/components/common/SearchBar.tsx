import { TextField, InputAdornment, type TextFieldProps } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps extends Omit<TextFieldProps, 'variant'> {
  onSearch?: (value: string) => void;
}

export const SearchBar = ({ onSearch, onChange, ...props }: SearchBarProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange?.(event);
    onSearch?.(value);
  };

  return (
    <TextField
      {...props}
      onChange={handleChange}
      variant="outlined"
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
        },
        ...props.sx,
      }}
    />
  );
};
