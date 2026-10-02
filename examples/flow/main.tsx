import React from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeProvider} from '../../src';
import {FlowPrototype} from '../../src/examples/flow/FlowPrototype';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <FlowPrototype />
  </ThemeProvider>,
);
