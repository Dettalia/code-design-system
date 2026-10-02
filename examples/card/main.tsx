import React from 'react';
import {createRoot} from 'react-dom/client';
import {Box, ThemeProvider} from '../../src';
import {CardExample} from '../../src/examples/CardExample';

// The Bliro ThemeProvider applies the theme and CssBaseline (page background
// color.background.page, Inter body text). The card sits on it as in an app.
function Page() {
  return (
    <ThemeProvider>
      <Box sx={{minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2}}>
        <CardExample />
      </Box>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Page />);
