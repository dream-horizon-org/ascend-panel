import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { SxProps, Theme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Define variant types
type DropdownVariant = 'default' | 'rounded' | 'square';

interface AscendDropdownProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  variant?: DropdownVariant;
  borderRadius?: string | number;
  width?: string | number;
  showCheckbox?: boolean;
  showCount?: boolean;
  sx?: SxProps<Theme>;
}

const AscendDropdown: React.FC<AscendDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  variant = 'default',
  borderRadius,
  width = 300,
  showCheckbox = true,
  showCount = false,
  sx = {},
}) => {
  // Determine border radius based on variant
  const getBorderRadius = (): string | number => {
    if (borderRadius !== undefined) {
      return borderRadius;
    }
    
    switch (variant) {
      case 'rounded':
        return '16px';
      case 'square':
        return '4px';
      case 'default':
      default:
        return '8px';
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    const {
      target: { value: newValue },
    } = event;
    onChange(
      typeof newValue === 'string' ? newValue.split(',') : newValue
    );
  };

  const computedBorderRadius = getBorderRadius();
  const hasSelectedItems = value.length > 0;

  // Render value based on showCount prop
  const renderDisplayValue = (selected: string[]) => {
    if (showCount && selected.length > 0) {
      return `${label} (${selected.length})`;
    }
    return selected.join(', ');
  };

  return (
    <FormControl 
      sx={{ 
        m: 1, 
        width,
        ...sx 
      }}
    >
      <InputLabel 
        id={`${label}-label`}
        sx={{
          color: hasSelectedItems ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
          '&.Mui-focused': {
            color: hasSelectedItems ? '#1976d2' : '#1976d2',
          },
          // Hide label when items are selected
          display: hasSelectedItems ? 'none' : 'block',
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`${label}-label`}
        id={`${label}-select`}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="" notched={false} />}
        renderValue={renderDisplayValue}
        MenuProps={MenuProps}
        sx={{
          borderRadius: computedBorderRadius,
          color: hasSelectedItems ? '#1976d2' : 'rgba(0, 0, 0, 0.87)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: computedBorderRadius,
            borderColor: hasSelectedItems ? '#1976d2' : 'rgba(0, 0, 0, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: hasSelectedItems ? '#1976d2' : 'rgba(0, 0, 0, 0.87)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {showCheckbox && <Checkbox checked={value.includes(option)} />}
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AscendDropdown;

