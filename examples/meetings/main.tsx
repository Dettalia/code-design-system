import React from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeProvider} from '../../src';
import {MeetingsPage} from '../../src/examples/MeetingsPage';

// The two example pages link to each other through the sidebar.
createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <MeetingsPage links={{'My meetings': '../meetings/', Companies: '../companies/'}} />
  </ThemeProvider>,
);
