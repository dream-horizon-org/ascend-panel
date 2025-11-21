import { FC } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type AscendTextFieldProps = TextFieldProps & {
  label: string;
  infoText?: string;
  required?: boolean;
  className?: string;
}

const AscendTextField: FC<AscendTextFieldProps> = ({
  label,
  infoText,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Label + Info icon */}
      <div className="flex items-center gap-1 mb-1">
        <label className="text-[0.75rem] leading-4 font-normal font-inter text-[#828592]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        {infoText && (
          <Tooltip title={infoText} arrow>
            <InfoOutlinedIcon
              sx={{ fontSize: '1rem', fontWeight: 300 }}
              className="w-4 h-4 leading-[100%] text-gray-500 cursor-pointer hover:text-gray-700"
            />
          </Tooltip>
        )}
      </div>

      {/* MUI TextField */}
      <TextField
        size="small"
        fullWidth
        {...props}
      />
    </div>
  );
};

export default AscendTextField;
