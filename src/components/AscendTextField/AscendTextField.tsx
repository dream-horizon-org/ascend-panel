import { FC } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const styles = theme.customComponents.ascendTextField;

  return (
    <div className={`flex flex-col ${width ? '' : 'w-full'} ${className}`} style={{ width }}>
      <div className="flex items-center gap-1 mb-1">
        <label 
          className="leading-4 font-inter"
          style={{ 
            fontSize: styles.label.fontSize,
            fontWeight: styles.label.fontWeight,
            color: styles.label.color,
          }}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        {infoText && (
          <Tooltip title={infoText} arrow>
            <InfoOutlinedIcon
              sx={{ 
                fontSize: styles.icon.fontSize, 
                color: styles.icon.color,
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
            borderRadius: styles.border.radius,
            '& fieldset': {
              borderColor: styles.border.color,
            },
            '&:hover fieldset': {
              borderColor: styles.border.color,
            },
            '&.Mui-focused fieldset': {
              borderColor: styles.border.focusColor,
              borderWidth: '1px',
            },
            '&.Mui-disabled': {
              backgroundColor: styles.disabled.backgroundColor,
            },
            ...(height && {
              height: height,
              alignItems: 'flex-start',
              padding: 0,
            }),
          },
          '& .MuiOutlinedInput-input': {
            color: styles.input.textColor,
            '&.Mui-disabled': {
              color: styles.input.textColor,
              WebkitTextFillColor: styles.input.textColor,
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
