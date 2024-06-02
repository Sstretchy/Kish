import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material';
import { common, green } from '@mui/material/colors';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = 'dev-bfzcwbeseef3a3lc.us.auth0.com';
const clientId = 'nxnmml3bJS4CUma5jBNJ5AWFVdWkn02Q';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: common.black,
    },
    secondary: {
      main: green[700],
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: window.location.origin }}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Auth0Provider>,
);
