import React from 'react';
import ReactDOM from 'react-dom/client'; // Importez 'react-dom/client' pour 'createRoot'
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "300857414061-8ff3ed18qghlb7r1bcqom4a52ki58ch0.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root')); // Créez la racine du React 18

root.render( // Utilisez 'root.render()' au lieu de 'ReactDOM.render()'
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Si vous souhaitez que votre app fonctionne hors ligne et se charge plus rapidement, vous pouvez changer
// unregister() en register() ci-dessous. Notez que cela comporte certains risques.
// En savoir plus sur les service workers : https://bit.ly/CRA-PWA
serviceWorker.unregister();
