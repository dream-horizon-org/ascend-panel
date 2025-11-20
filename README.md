# Ascend Panel

React application built with TypeScript, Redux Toolkit, React Hook Form, Tailwind CSS, and Material-UI.

## Setup

### Prerequisites

- Node.js (v20.19+ or v22.12+ recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build for Production

Create a production build:
```bash
npm run build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Packages and Their Purpose

### Core Dependencies

#### **React & React DOM** (`react`, `react-dom`)
- Core React library for building user interfaces
- React DOM provides DOM-specific methods for React

#### **TypeScript** (`typescript`)
- Adds static type checking to JavaScript
- Improves code quality, IDE support, and catches errors at compile time

### State Management

#### **Redux Toolkit** (`@reduxjs/toolkit`)
- Official Redux library for efficient state management
- Provides simplified Redux setup with less boilerplate
- Used for global application state (e.g., counter state)

#### **React Redux** (`react-redux`)
- Official React bindings for Redux
- Provides hooks (`useSelector`, `useDispatch`) to connect React components to Redux store

### Form Management

#### **React Hook Form** (`react-hook-form`)
- Performant form library with minimal re-renders
- Handles form state, validation, and submission
- Used for form inputs and validation

#### **Zod** (`zod`)
- TypeScript-first schema validation library
- Used with React Hook Form for form validation
- Provides type-safe validation rules

#### **@hookform/resolvers** (`@hookform/resolvers`)
- Resolver library that connects Zod (and other validators) with React Hook Form
- Enables schema-based validation in forms

### UI Framework & Styling

#### **Material-UI (MUI)** (`@mui/material`)
- Comprehensive React component library following Material Design
- Provides pre-built, accessible components (Buttons, Cards, TextFields, Autocomplete, etc.)
- Used for the main UI components

#### **MUI Icons** (`@mui/icons-material`)
- Icon library for Material-UI
- Provides a wide range of Material Design icons
- Used for visual elements (AddIcon, RemoveIcon, LocationOnIcon)

#### **Emotion** (`@emotion/react`, `@emotion/styled`)
- CSS-in-JS library used by Material-UI for styling
- Enables component-level styling and theming
- Required dependency for MUI components

### CSS Framework

#### **Tailwind CSS** (`tailwindcss`)
- Utility-first CSS framework
- Provides utility classes for rapid UI development
- Used for custom styling and layout alongside MUI components

#### **PostCSS** (`postcss`)
- Tool for transforming CSS with JavaScript plugins
- Processes Tailwind CSS directives

#### **Autoprefixer** (`autoprefixer`)
- PostCSS plugin that automatically adds vendor prefixes to CSS
- Ensures cross-browser compatibility

#### **@tailwindcss/postcss** (`@tailwindcss/postcss`)
- PostCSS plugin for Tailwind CSS v4
- Required for processing Tailwind CSS in the build pipeline

### Development Tools

#### **Vite** (`vite`)
- Next-generation frontend build tool
- Provides fast development server and optimized production builds
- Used as the build tool and dev server

#### **@vitejs/plugin-react** (`@vitejs/plugin-react`)
- Vite plugin for React support
- Enables Fast Refresh and JSX transformation

#### **ESLint** (`eslint`)
- JavaScript/TypeScript linter for code quality
- Catches bugs and enforces coding standards

#### **ESLint Plugins** (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)
- React-specific ESLint rules
- Enforces React best practices and hooks rules

#### **Type Definitions** (`@types/react`, `@types/react-dom`, `@types/node`)
- TypeScript type definitions for React, React DOM, and Node.js
- Provides type information for better IDE support and type checking

## Project Structure

```
src/
├── store/              # Redux store configuration
│   ├── store.ts        # Store setup and type exports
│   ├── hooks.ts        # Typed Redux hooks
│   └── slices/         # Redux slices
│       └── counterSlice.ts
├── theme/              # MUI theme configuration
│   └── theme.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Technologies Demonstrated

- **Redux Toolkit**: Global state management with counter example
- **React Hook Form**: Form handling with Zod validation
- **Material-UI**: Autocomplete components (single and multiple selection)
- **Tailwind CSS**: Utility-first styling and responsive layouts
- **TypeScript**: Type-safe development throughout
