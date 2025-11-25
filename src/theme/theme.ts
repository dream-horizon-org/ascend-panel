import { createTheme } from "@mui/material/styles";

type CustomSpacing = {
  appBarHeight: string;
  sidebarWidth: string;
  contentPadding: string;
};

type CustomComponents = {
  appBar: {
    height: string;
    padding: string;
    logoSize: string;
    logoBorderRadius: string;
    titleFontSize: string;
    titleFontWeight: number;
    linkFontSize: string;
    linkFontWeight: number;
    linkPadding: string;
    innerHeight: string;
  };
  sidebar: {
    width: string;
    tabSize: string;
    tabPadding: string;
    indicatorWidth: string;
    indicatorBorderRadius: string;
    iconSize: string;
  };
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

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface Theme {
    customSpacing: CustomSpacing;
    customComponents: CustomComponents;
  }
  interface ThemeOptions {
    customSpacing?: Partial<CustomSpacing>;
    customComponents?: Partial<CustomComponents>;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0060E5",
      light: "#E3F2FD",
      dark: "#003F9E",
    },
    secondary: {
      main: "#dc004e",
    },
    text: {
      primary: "#212121",
      secondary: "#666",
    },
    background: {
      default: "#F8F9FC",
      paper: "#FFFFFF",
    },
    divider: "#E0E0E0",
    neutral: {
      main: "#33343E",
      light: "#9AA5B1",
      dark: "#454854",
    },
  },
  customSpacing: {
    appBarHeight: "56px",
    sidebarWidth: "48px",
    contentPadding: "20px",
  },
  customComponents: {
    appBar: {
      height: "56px",
      padding: "12px",
      logoSize: "24px",
      logoBorderRadius: "4px",
      titleFontSize: "18px",
      titleFontWeight: 600,
      linkFontSize: "16px",
      linkFontWeight: 600,
      linkPadding: "4px 12px",
      innerHeight: "24px",
    },
    sidebar: {
      width: "48px",
      tabSize: "48px",
      tabPadding: "12px",
      indicatorWidth: "4px",
      indicatorBorderRadius: "0 4px 4px 0",
      iconSize: "24px",
    },
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
