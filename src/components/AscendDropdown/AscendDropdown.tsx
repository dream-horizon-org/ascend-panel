import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
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
  label: string | React.ReactNode;
  options: string[];
  value: string[] | string;
  onChange: (value: string[] | string) => void;
  variant?: DropdownVariant;
  borderRadius?: string | number;
  width?: string | number;
  showCheckbox?: boolean;
  multiple?: boolean;
  placeholder?: string | React.ReactNode;
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
  multiple = true,
  placeholder,
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
    
    if (multiple) {
      onChange(
        typeof newValue === 'string' ? newValue.split(',') : newValue
      );
    } else {
      onChange(newValue as string);
    }
  };

  const computedBorderRadius = getBorderRadius();
  const hasSelectedItems = multiple 
    ? (value as string[]).length > 0 
    : value !== '';

  // Render value based on selection mode
  const renderDisplayValue = (selected: string[] | string) => {
    if (multiple) {
      const selectedArray = selected as string[];
      
      // Show placeholder when empty
      if (selectedArray.length === 0) {
        return (
          <Box component="span" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            {placeholder || label}
          </Box>
        );
      }
      
      // When items are selected, show the label (supports JSX)
      return <Box component="span">{label}</Box>;
    }
    
    // Single select - show placeholder if empty, otherwise show label
    if (!selected) {
      return (
        <Box component="span" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
          {placeholder || label}
        </Box>
      );
    }
    
    // Show label when item is selected (supports JSX)
    return <Box component="span">{label}</Box>;
  };

  return (
    <FormControl 
      sx={{ 
        m: 1, 
        width,
        ...sx 
      }}
    >
      <Select
        labelId={`${label}-label`}
        id={`${label}-select`}
        multiple={multiple}
        value={value}
        onChange={handleChange}
        displayEmpty
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
            {multiple && showCheckbox && <Checkbox checked={(value as string[]).includes(option)} />}
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AscendDropdown;


