import React, {useState} from 'react';
import {
  Avatar,
  Box,
  ButtonBase,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  tokens,
  useMediaQuery,
  type Theme,
} from '../../index';
import {TopNav, VickyAvatar, hairline} from '../AppShell';
import avatarPeter from '../meetings-assets/avatar-peter.png';
import chevronRight from '../meetings-assets/chevron-right.svg';
import navCompanies from '../flow-assets/nav-companies.svg';
import navPeople from '../flow-assets/nav-people.svg';
import navGroups from '../flow-assets/nav-groups.svg';
import navMeetings from '../flow-assets/nav-meetings.svg';
import navSettings from '../flow-assets/nav-settings.svg';
import navTeam from '../flow-assets/nav-team.svg';
import setApiAccess from '../flow-assets/set-api-access.svg';
import setBack from '../flow-assets/set-back.svg';
import setBilling from '../flow-assets/set-billing.svg';
import setCompanyFields from '../fields-assets/list-settings-20.svg';
import setDictionary from '../flow-assets/set-dictionary.svg';
import setIntegrations from '../flow-assets/set-integrations.svg';
import setMcp from '../flow-assets/set-mcp.svg';
import setMyAccount from '../flow-assets/set-my-account.svg';
import setSkills from '../flow-assets/set-skills.svg';
import setTemplates from '../flow-assets/set-templates.svg';
import setUsage from '../flow-assets/set-usage.svg';
import setWebhooks from '../flow-assets/set-webhooks.svg';

// The Bliro Web app shell from Figma (Bliro Web app, "Company overview"
// 8117:120063): top nav (logo, search, Start bliro), a white sidebar with the
// navigation, the page, and an optional panel on the right (Vicky). In
// Settings the sidebar becomes the settings menu (section 8032:74222).

const {color, radius} = tokens;

// --- Routes --------------------------------------------------------------------

export type Route =
  | 'meetings'
  | 'vicky'
  | 'groups'
  | 'companies'
  | `companies/${string}`
  | 'people'
  | 'team'
  | `settings/${SettingsPage}`;

export type SettingsPage =
  | 'account'
  | 'templates'
  | 'dictionary'
  | 'skills'
  | 'general'
  | 'company-fields'
  | 'members'
  | 'billing'
  | 'usage'
  | 'integrations'
  | 'api-access'
  | 'webhooks'
  | 'mcp';

type NavItem = {route: Route; label: string; icon: string | 'vicky'};
type NavSection = {label?: string; collapsible?: boolean; items: NavItem[]};

const MAIN_TOP: NavSection[] = [
  {
    items: [
      {route: 'meetings', label: 'Meetings', icon: navMeetings},
      {route: 'vicky', label: 'Vicky', icon: 'vicky'},
      {route: 'groups', label: 'Groups', icon: navGroups},
    ],
  },
  {
    label: 'CRM',
    collapsible: true,
    items: [
      {route: 'companies', label: 'Companies', icon: navCompanies},
      {route: 'people', label: 'People', icon: navPeople},
    ],
  },
];

const MAIN_BOTTOM: NavSection = {
  label: 'Workspace',
  items: [
    {route: 'team', label: 'Team', icon: navTeam},
    {route: 'settings/account', label: 'Settings', icon: navSettings},
  ],
};

const SETTINGS: NavSection[] = [
  {items: [{route: 'settings/account', label: 'My account', icon: setMyAccount}]},
  {
    label: 'Meetings',
    collapsible: true,
    items: [
      {route: 'settings/templates', label: 'Templates', icon: setTemplates},
      {route: 'settings/dictionary', label: 'Dictionary', icon: setDictionary},
      {route: 'settings/skills', label: 'Skills', icon: setSkills},
    ],
  },
  {
    label: 'Organization',
    collapsible: true,
    items: [
      // Same Figma icons as Companies and Team.
      {route: 'settings/general', label: 'General', icon: navCompanies},
      // Not in Figma: the company fields proposal.
      {route: 'settings/company-fields', label: 'Company fields', icon: setCompanyFields},
      {route: 'settings/members', label: 'Members', icon: navTeam},
      {route: 'settings/billing', label: 'Billing', icon: setBilling},
      {route: 'settings/usage', label: 'Usage', icon: setUsage},
    ],
  },
  {
    label: 'Connections',
    collapsible: true,
    items: [{route: 'settings/integrations', label: 'Integrations', icon: setIntegrations}],
  },
  {
    label: 'Developers',
    collapsible: true,
    items: [
      {route: 'settings/api-access', label: 'API Access', icon: setApiAccess},
      {route: 'settings/webhooks', label: 'Webhook Management', icon: setWebhooks},
      {route: 'settings/mcp', label: 'MCP', icon: setMcp},
    ],
  },
];

/** Every route's label, for page titles. */
export const ROUTE_LABELS = Object.fromEntries(
  [...MAIN_TOP, MAIN_BOTTOM, ...SETTINGS].flatMap(section =>
    section.items.map(item => [item.route, item.label]),
  ),
) as Record<Route, string>;
ROUTE_LABELS['settings/account'] = 'My account';

// --- Pieces --------------------------------------------------------------------

/**
 * A Figma nav icon, colored by state: Figma exports the selected icon in orange
 * (primary) and the others in grey (text.secondary), so the SVG's shape is used
 * as a mask and the color comes from the theme.
 */
export function NavIcon({src, active}: {src: string; active: boolean}) {
  return <MaskIcon src={src} color={active ? 'primary.main' : 'text.secondary'} />;
}

/** An exported Figma icon's shape, filled with a theme color (e.g. white on a contained button). */
export function MaskIcon({src, color, size = 20}: {src: string; color: string; size?: number}) {
  // Inlined SVG data URLs keep their double quotes, which would end the CSS
  // url("…") early; %22 is the same character, URL-encoded.
  const mask = `url("${src.replace(/"/g, '%22')}") center / contain no-repeat`;
  return (
    <Box
      aria-hidden
      sx={{width: size, height: size, flexShrink: 0, bgcolor: color, mask, WebkitMask: mask}}
    />
  );
}

const itemSx = {
  gap: 1,
  px: 1,
  py: '9px',
  borderRadius: `${radius.lg}px`,
  '&.Mui-selected, &.Mui-selected:hover': {bgcolor: 'action.selected'},
} as const;

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: (r: Route) => void;
}) {
  return (
    <ListItemButton
      component="a"
      href={`#/${item.route}`}
      selected={active}
      aria-current={active ? 'page' : undefined}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        onNavigate(item.route);
      }}
      sx={itemSx}
    >
      <ListItemIcon sx={{minWidth: 0}}>
        {item.icon === 'vicky' ? <VickyAvatar /> : <NavIcon src={item.icon} active={active} />}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        slotProps={{primary: {variant: 'bodySmallMedium'}}}
        sx={{m: 0}}
      />
    </ListItemButton>
  );
}

const sectionLabelSx = {
  display: 'flex',
  width: '100%',
  height: 32,
  px: 1,
  py: 0.5,
  borderRadius: `${radius.lg}px`,
  justifyContent: 'flex-start',
  typography: 'bodySmallRegular',
  color: 'text.secondary',
} as const;

/** A Figma "Menu-list": optional section label (collapsible where Figma's is a button) + items. */
function Section({
  section,
  current,
  onNavigate,
}: {
  section: NavSection;
  current: Route;
  onNavigate: (r: Route) => void;
}) {
  const [open, setOpen] = useState(true);
  const items = (
    <List disablePadding sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
      {section.items.map(item => (
        <NavLink
          key={item.route}
          item={item}
          // Sub-pages (e.g. companies/strategio) keep their section selected.
          active={current === item.route || current.startsWith(`${item.route}/`)}
          onNavigate={onNavigate}
        />
      ))}
    </List>
  );
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%'}}>
      {section.label ? (
        section.collapsible ? (
          <ButtonBase
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            sx={{...sectionLabelSx, '&:hover': {bgcolor: 'action.hover'}}}
          >
            {section.label}
          </ButtonBase>
        ) : (
          <Typography component="div" sx={{...sectionLabelSx, alignItems: 'center'}}>
            {section.label}
          </Typography>
        )
      ) : null}
      {section.collapsible ? <Collapse in={open}>{items}</Collapse> : items}
    </Box>
  );
}

function ProfileRow({onNavigate}: {onNavigate: (r: Route) => void}) {
  return (
    <ListItemButton
      component="a"
      href="#/settings/account"
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        onNavigate('settings/account');
      }}
      aria-label="Peter, peter@example.com: account settings"
      sx={{...itemSx, p: 1}}
    >
      <Avatar src={avatarPeter} alt="" sx={{width: 40, height: 40, border: hairline}} />
      <Box sx={{flex: 1, minWidth: 0}}>
        <Typography variant="bodySmallMedium" component="div">
          Peter
        </Typography>
        <Typography variant="bodyXxsmallRegular" color="textSecondary" component="div">
          peter@example.com
        </Typography>
      </Box>
      <Box component="img" src={chevronRight} alt="" sx={{display: 'block'}} />
    </ListItemButton>
  );
}

function MainSidebar({current, onNavigate}: {current: Route; onNavigate: (r: Route) => void}) {
  return (
    <>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        {MAIN_TOP.map((section, i) => (
          <Section key={i} section={section} current={current} onNavigate={onNavigate} />
        ))}
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
        <Section section={MAIN_BOTTOM} current={current} onNavigate={onNavigate} />
        <Box sx={{px: 1, py: 0.5}}>
          <Divider sx={{borderColor: color.neutral['100']}} />
        </Box>
        <ProfileRow onNavigate={onNavigate} />
      </Box>
    </>
  );
}

function SettingsSidebar({current, onNavigate}: {current: Route; onNavigate: (r: Route) => void}) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
      <List disablePadding>
        <NavLink
          item={{route: 'meetings', label: 'Back to home', icon: setBack}}
          active={false}
          onNavigate={onNavigate}
        />
      </List>
      <Typography
        variant="h6"
        component="p"
        sx={{px: 1, height: 36, display: 'flex', alignItems: 'center'}}
      >
        Settings
      </Typography>
      <Box component="nav" aria-label="Settings" sx={{display: 'flex', flexDirection: 'column'}}>
        {SETTINGS.map((section, i) => (
          <Section key={i} section={section} current={current} onNavigate={onNavigate} />
        ))}
      </Box>
    </Box>
  );
}

// --- Shell ---------------------------------------------------------------------

export interface FlowShellProps {
  route: Route;
  onNavigate: (route: Route) => void;
  /** Page top padding: Figma uses 16px on My meetings and 32px on the company page. */
  panelTop?: number;
  /**
   * Panel docked to the right of the page (e.g. the Vicky chat on a company
   * page). Shown from 1200px; below that it's hidden.
   */
  aside?: React.ReactNode;
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = 240;

export function FlowShell({route, onNavigate, panelTop = 32, aside, children}: FlowShellProps) {
  const inSettings = route.startsWith('settings/');
  const desktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'), {noSsr: true});
  const wide = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'), {noSsr: true});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = (next: Route) => {
    setDrawerOpen(false);
    onNavigate(next);
  };

  // Figma "Bliro-menus": white, hairline on the right, padding 8 8 16 8.
  const sidebar = (
    <Box
      component={inSettings ? 'div' : 'nav'}
      aria-label={inSettings ? undefined : 'Main'}
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: inSettings ? 'flex-start' : 'space-between',
        pt: 1,
        px: 1,
        pb: 2,
        overflowY: 'auto',
        bgcolor: 'background.paper',
        borderRight: desktop ? hairline : 0,
      }}
    >
      {inSettings ? (
        <SettingsSidebar current={route} onNavigate={navigate} />
      ) : (
        <MainSidebar current={route} onNavigate={navigate} />
      )}
    </Box>
  );

  return (
    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper'}}>
      <TopNav onOpenMenu={desktop ? undefined : () => setDrawerOpen(true)} />
      <Box sx={{flex: 1, minHeight: 0, display: 'flex'}}>
        {desktop ? (
          <Box sx={{flexShrink: 0}}>{sidebar}</Box>
        ) : (
          // Not in Figma: below 900px the sidebar opens as a drawer.
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            {sidebar}
          </Drawer>
        )}
        {/* Figma "Page content": padding 32 40 40, 24px between sections. */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            bgcolor: 'background.paper',
            pt: `${panelTop}px`,
            px: {xs: 2, md: 5},
            pb: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Page contents are at most 1024px wide, centered. */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 1024,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {children}
          </Box>
        </Box>
        {aside && wide ? aside : null}
      </Box>
    </Box>
  );
}
