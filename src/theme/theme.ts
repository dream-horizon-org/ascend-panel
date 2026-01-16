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
  dropdown: {
    sm: string;
    md: string;
    lg: string;
    chipSmallHeight: string;
    chipMediumHeight: string;
    chipLimit1: number;
    chipLimit2: number;
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  table: {
    rowHeight: string;
    cellPadding: string;
    fontSize: string;
    borderColor: string;
    borderRadius: string;
  };
  status: {
    live: {
      background: string;
      color: string;
    };
    draft: {
      background: string;
      color: string;
    };
    completed: {
      background: string;
      color: string;
    };
    paused: {
      background: string;
      color: string;
    };
    archived: {
      background: string;
      color: string;
    };
    concluded: {
      background: string;
      color: string;
    };
    terminated: {
      background: string;
      color: string;
    };
  };
  chip: {
    height: string;
    borderRadius: string;
    background: string;
    text: string;
    fontSize: string;
  };
  actions: {
    delete: string;
    shadow: string;
  };
};

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      main: string;
      light: string;
      dark: string;
    };
    border: {
      main: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
    };
    border?: {
      main: string;
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
    border: {
      main: "#DADADD",
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(0, 96, 229, 0.04)",
          },
          "&.Mui-focused": {
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 0 3px #E3F2FD",
          },
        },
        select: {
          fontSize: "14px",
          lineHeight: "1.5",
          fontWeight: 500,
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
        icon: {
          transition: "transform 0.2s ease-in-out, color 0.2s ease-in-out",
          color: "#666",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: "8px",
          borderRadius: "12px",
          boxShadow:
            "0px 8px 24px rgba(0, 0, 0, 0.12), 0px 0px 2px rgba(0, 0, 0, 0.08)",
          border: "1px solid #DADADD",
        },
        list: {
          padding: "8px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "2px 0",
          padding: "10px 12px",
          fontSize: "14px",
          transition: "all 0.15s ease-in-out",
          "&:hover": {
            backgroundColor: "#E3F2FD",
            transform: "translateX(4px)",
          },
          "&.Mui-selected": {
            backgroundColor: "#E3F2FD",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#E3F2FD",
            },
          },
          "&.Mui-focusVisible": {
            backgroundColor: "#E3F2FD",
          },
        },
      },
    },
  },
  customSpacing: {
    appBarHeight: "56px",
    sidebarWidth: "64px",
    contentPadding: "20px",
  },
  customComponents: {
    appBar: {
      height: "56px",
      padding: "12px",
      logoSize: "18px",
      logoBorderRadius: "4px",
      titleFontSize: "18px",
      titleFontWeight: 600,
      linkFontSize: "16px",
      linkFontWeight: 600,
      linkPadding: "4px 12px",
      innerHeight: "24px",
    },
    sidebar: {
      width: "240px",
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
    dropdown: {
      sm: "32px",
      md: "36px",
      lg: "40px",
      chipSmallHeight: "22px",
      chipMediumHeight: "26px",
      chipLimit1: 5,
      chipLimit2: 3,
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
    },
    table: {
      rowHeight: "48px",
      cellPadding: "0 16px",
      fontSize: "14px",
      borderColor: "#DADADD",
      borderRadius: "1px",
    },
    status: {
      live: {
        background: "#A5D6A7",
        color: "#212121",
      },
      draft: {
        background: "#FFCC80",
        color: "#212121",
      },
      completed: {
        background: "#CE93D8",
        color: "#212121",
      },
      paused: {
        background: "#BDBDBD",
        color: "#212121",
      },
      archived: {
        background: "#EF9A9A",
        color: "#212121",
      },
      concluded: {
        background: "#D1C4E9",
        color: "#212121",
      },
      terminated: {
        background: "#EF9A9A",
        color: "#212121",
      },
    },
    chip: {
      height: "32px",
      borderRadius: "4px",
      background: "#E1E3EA",
      text: "#33343E",
      fontSize: "11px",
    },
    actions: {
      delete: "#C62828",
      shadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    },
  },
});
