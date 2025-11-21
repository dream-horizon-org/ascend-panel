import { FC } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type AscendTextFieldProps = TextFieldProps & {
  label: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  width?: string;
  height?: string;
}

const AscendTextField: FC<AscendTextFieldProps> = ({
  label,
  infoText,
  required = false,
  className = "",
  width,
  height,
  ...props
}) => {
  return (
    <div className={`flex flex-col ${width ? '' : 'w-full'} ${className}`} style={{ width }}>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-[0.75rem] leading-4 font-normal font-inter text-[#828592]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        {infoText && (
          <Tooltip title={infoText} arrow>
            <InfoOutlinedIcon
              sx={{ 
                fontSize: '1rem', 
                color: '#33343E',
              }}
              className="w-4 h-4 leading-[100%] cursor-pointer hover:opacity-80"
            />
          </Tooltip>
        )}
      </div>

      <TextField
        size="small"
        fullWidth
        multiline={height ? true : props.multiline}
        {...props}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '2px',
            '& fieldset': {
              borderColor: '#DADADD',
            },
            '&:hover fieldset': {
              borderColor: '#DADADD',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4A4B54',
              borderWidth: '1px',
            },
            '&.Mui-disabled': {
              backgroundColor: '#e6e8f2',
            },
            ...(height && {
              height: height,
              alignItems: 'flex-start',
              padding: 0,
            }),
          },
          '& .MuiOutlinedInput-input': {
            color: '#454854',
            '&.Mui-disabled': {
              color: '#454854',
              WebkitTextFillColor: '#454854',
            },
            ...(height && {
              height: '100%',
              padding: '8px 14px',
              boxSizing: 'border-box',
            }),
          },
          ...props.sx,
        }}
      />
    </div>
  );
};

export default AscendTextField;
