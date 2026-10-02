import React from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeProvider} from '../../src';
import {CompaniesPage} from '../../src/examples/CompaniesPage';

// The two example pages link to each other through the sidebar.
createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <CompaniesPage links={{'My meetings': '../meetings/', Companies: '../companies/'}} />
  </ThemeProvider>,
);
