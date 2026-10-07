import React, {useEffect, useState} from 'react';
import {Box, Button, Snackbar, Typography} from '../../index';
import {COMPANIES, CompaniesContent, type Company} from '../CompaniesPage';
import {MeetingsContent} from '../MeetingsPage';
import {FlowShell, ROUTE_LABELS, type Route} from './FlowShell';
import {CompanyDetailPage, type CompanyTab} from './CompanyDetailPage';
import {MyAccountPage} from './MyAccountPage';
import {VickyChatPanel} from './VickyChatPanel';

// Clickable prototype of the Figma flow "Section 3" (Bliro Web app,
// 8032:74222): Meetings, Companies, a company's detail page and Settings / My
// account in the new navigation. The URL hash holds the current page (#/companies), so pages can
// be linked directly and the browser's back button works.

// Company pages: companies/<id> (Overview), companies/<id>/meetings, companies/<id>/people.
const COMPANY_ROUTE = /^companies\/([^/]+)(?:\/(meetings|people))?$/;

function parseCompanyRoute(route: Route): {id: string; tab: CompanyTab} | null {
  const match = COMPANY_ROUTE.exec(route);
  return match ? {id: match[1], tab: (match[2] as CompanyTab | undefined) ?? 'overview'} : null;
}

function readRoute(known: Company[] = COMPANIES): Route {
  const hash = window.location.hash.replace(/^#\/?/, '') as Route;
  if (hash in ROUTE_LABELS) return hash;
  const company = parseCompanyRoute(hash);
  return company && known.some(c => c.id === company.id) ? hash : 'meetings';
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
  // Companies added in the prototype aren't in COMPANIES; remember the ones opened.
  const [opened, setOpened] = useState<Company[]>([]);
  // Details edited on the company page, kept while the prototype is open.
  const [edits, setEdits] = useState<Record<string, Partial<Company>>>({});
  const companyRoute = parseCompanyRoute(route);
  const base = companyRoute
    ? [...COMPANIES, ...opened].find(c => c.id === companyRoute.id)
    : undefined;
  const company = base && {...base, ...edits[base.id]};
  const companyName = company?.name;

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute([...COMPANIES, ...opened]));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [opened]);

  useEffect(() => {
    document.title = `${companyName ?? ROUTE_LABELS[route]} · Bliro`;
  }, [route, companyName]);

  const navigate = (next: Route) => {
    setRoute(next);
    if (window.location.hash !== `#/${next}`) window.location.hash = `/${next}`;
  };

  let page: React.ReactNode;
  if (route === 'meetings') page = <MeetingsContent />;
  else if (route === 'companies')
    page = (
      <CompaniesContent
        onOpenCompany={c => {
          if (!COMPANIES.includes(c)) setOpened(list => [...list.filter(o => o.id !== c.id), c]);
          navigate(`companies/${c.id}`);
        }}
      />
    );
  else if (companyRoute && company)
    page = (
      <CompanyDetailPage
        company={company}
        tab={companyRoute.tab}
        onTab={tab => navigate(tab === 'overview' ? `companies/${company.id}` : `companies/${company.id}/${tab}`)}
        onBack={() => navigate('companies')}
        onEdit={changes => setEdits(all => ({...all, [company.id]: {...all[company.id], ...changes}}))}
        onNotDesigned={what => setMessage(`${what} aren't in this prototype yet.`)}
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
      <FlowShell
        route={route}
        onNavigate={navigate}
        panelTop={route === 'meetings' ? 16 : 24}
        aside={company ? <VickyChatPanel companyName={company.name} /> : undefined}
      >
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
