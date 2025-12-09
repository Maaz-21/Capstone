import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c3aed',
    },
    background: {
      default: '#071029',
      paper: '#0b1220',
    },
    text: {
      primary: '#e6eef8',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h1: { fontSize: '2.4rem', fontWeight: 800 },
    h2: { fontSize: '1.8rem', fontWeight: 700 },
    h3: { fontSize: '1.4rem', fontWeight: 700 },
    body1: { fontSize: '1rem' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 14px',
        },
      },
    },
  },
});

export default theme;
