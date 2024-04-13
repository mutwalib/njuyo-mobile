import React from 'react';
import {Provider as PropertyProvider} from './src/context/property/PropertyContext';
import {Provider as AuthProvider} from './src/context/auth/AuthContext';
import Routes from './src/Navigation/Routes';
const App = () => {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Routes />
      </PropertyProvider>
    </AuthProvider>
  );
};
export default App;
