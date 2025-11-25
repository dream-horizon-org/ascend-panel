import { createTheme } from "@mui/material/styles";

// Extend the Theme interface to include custom properties
declare module "@mui/material/styles" {
  interface Theme {
    customComponents: {
      ascendTextField: {
        label: {
          color: string;
          fontSize: string;
          fontWeight: number;
        };
        icon: {
          color: string;
          fontSize: string;
        };
        border: {
          color: string;
          focusColor: string;
          radius: string;
        };
        input: {
          textColor: string;
        };
        disabled: {
          backgroundColor: string;
        };
      };
    };
  }
  interface ThemeOptions {
    customComponents?: {
      ascendTextField?: {
        label?: {
          color?: string;
          fontSize?: string;
          fontWeight?: number;
        };
        icon?: {
          color?: string;
          fontSize?: string;
        };
        border?: {
          color?: string;
          focusColor?: string;
          radius?: string;
        };
        input?: {
          textColor?: string;
        };
        disabled?: {
          backgroundColor?: string;
        };
      };
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  customComponents: {
    ascendTextField: {
      label: {
        color: "#828592",
        fontSize: "0.75rem",
        fontWeight: 400,
      },
      icon: {
        color: "#33343E",
        fontSize: "1rem",
      },
      border: {
        color: "#DADADD",
        focusColor: "#4A4B54",
        radius: "2px",
      },
      input: {
        textColor: "#454854",
      },
      disabled: {
        backgroundColor: "#e6e8f2",
      },
    },
  },
});
