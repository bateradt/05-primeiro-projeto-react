import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

import GlogalStyle from './styles/global';

const App: React.FC = () => (
    <>
        <BrowserRouter>
            <Routes />
      </BrowserRouter>
        <GlogalStyle />
  </>
);

export default App;
