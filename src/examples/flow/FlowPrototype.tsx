import React, {useEffect, useState} from 'react';
import {Box, Button, Snackbar, Typography} from '../../index';
import {CompaniesContent} from '../CompaniesPage';
import {MeetingsContent} from '../MeetingsPage';
import {FlowShell, ROUTE_LABELS, type Route} from './FlowShell';
import {MyAccountPage} from './MyAccountPage';

// Clickable prototype of the Figma flow "Section 3" (Bliro Web app,
// 8032:74222): Meetings, Companies and Settings / My account in the new
// navigation. The URL hash holds the current page (#/companies), so pages can
// be linked directly and the browser's back button works.

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '') as Route;
  return hash in ROUTE_LABELS ? hash : 'meetings';
}

/** Not in Figma: pages in the navigation that have no design yet. */
function NotDesigned({route, onNavigate}: {route: Route; onNavigate: (r: Route) => void}) {
  return (
    <Box sx={{width: '100%', maxWidth: 1024}}>
      <Typography variant="h5" component="h1">
        {ROUTE_LABELS[route]}
      </Typography>
      <Box
        sx={{
          mt: 3,
          py: 8,
          px: 2,
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 4,
        }}
      >
        <Typography variant="bodySmallSemibold" component="p">
          This page isn't designed yet
        </Typography>
        <Typography
          variant="bodySmallRegular"
          color="textSecondary"
          component="p"
          sx={{mt: 0.5, mb: 2}}
        >
          The prototype covers Meetings, Companies and Settings › My account.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            onNavigate(route.startsWith('settings/') ? 'settings/account' : 'meetings')
          }
        >
          {route.startsWith('settings/') ? 'Go to My account' : 'Go to Meetings'}
        </Button>
      </Box>
    </Box>
  );
}

export function FlowPrototype({initialRoute}: {initialRoute?: Route}) {
  const [route, setRoute] = useState<Route>(() => initialRoute ?? readRoute());
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = `${ROUTE_LABELS[route]} · Bliro`;
  }, [route]);

  const navigate = (next: Route) => {
    setRoute(next);
    if (window.location.hash !== `#/${next}`) window.location.hash = `/${next}`;
  };

  let page: React.ReactNode;
  if (route === 'meetings') page = <MeetingsContent />;
  else if (route === 'companies')
    page = (
      <CompaniesContent
        onOpenCompany={company =>
          setMessage(`${company.name}: company details aren't in this prototype yet.`)
        }
      />
    );
  else if (route === 'settings/account')
    page = (
      <MyAccountPage
        onSaved={() => setMessage('Changes saved')}
        onDeleteAccount={() =>
          setMessage('Account deletion requested (prototype: nothing was deleted)')
        }
      />
    );
  else page = <NotDesigned route={route} onNavigate={navigate} />;

  return (
    <>
      <FlowShell route={route} onNavigate={navigate} panelTop={route === 'meetings' ? 16 : 24}>
        {page}
      </FlowShell>
      <Snackbar
        open={message !== null}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        message={message}
      />
    </>
  );
}
