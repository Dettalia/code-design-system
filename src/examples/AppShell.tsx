import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Toolbar,
  Typography,
  tokens,
} from '../index';
import avatarPeter from './meetings-assets/avatar-peter.png';
import chevronRightIcon from './meetings-assets/chevron-right.svg';
import commandIcon from './meetings-assets/command.svg';
import downloadIcon from './meetings-assets/download.svg';
import logoMark from './meetings-assets/logo-mark.svg';
import logoWordmark from './meetings-assets/logo-wordmark.svg';
import navCompanies from './meetings-assets/nav-companies.svg';
import navGroups from './meetings-assets/nav-groups.svg';
import navMyMeetings from './meetings-assets/nav-my-meetings.svg';
import navPeople from './meetings-assets/nav-people.svg';
import navTemplates from './meetings-assets/nav-templates.svg';
import searchIcon from './meetings-assets/search.svg';
import startBliroIcon from './meetings-assets/start-bliro.svg';
import vickyPhoto from './meetings-assets/vicky.png';

// The Bliro Web app shell from Figma (file G6zrj3z4RO5UHzDdSwYut4): top nav
// (logo, global search, Start bliro) and the "Bliro-menus" sidebar, built from
// the design system's MUI components. Shared by the example pages.

const {color, radius, border} = tokens;

/** Figma Dark - 7 (#e7e8e9) hairline used for app chrome borders and dividers. */
export const hairline = `${border.width.thin}px solid ${color.neutral['100']}`;

/** An exported Figma icon at its own size. */
export const Img = ({src, alt = ''}: {src: string; alt?: string}) => (
  <Box component="img" src={src} alt={alt} sx={{display: 'block', flexShrink: 0}} />
);

// --- Top bar -----------------------------------------------------------------

export function BliroLogo() {
  // Figma lays the two logo parts out inside an 85.94 x 24 frame by percentage.
  return (
    <Box
      role="img"
      aria-label="bliro"
      sx={{position: 'relative', width: 85.937, height: 24, flexShrink: 0}}
    >
      <Box sx={{position: 'absolute', top: 0, right: '74.23%', bottom: '1.55%', left: 0}}>
        <Box
          component="img"
          src={logoMark}
          alt=""
          sx={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
        />
      </Box>
      <Box sx={{position: 'absolute', top: '0.52%', right: 0, bottom: 0, left: '39.04%'}}>
        <Box
          component="img"
          src={logoWordmark}
          alt=""
          sx={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
        />
      </Box>
    </Box>
  );
}

const Kbd = ({children}: {children: React.ReactNode}) => (
  <Box
    component="kbd"
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 20,
      height: 20,
      p: '2px',
      bgcolor: color.neutral['25'],
      border: hairline,
      borderRadius: `${radius.sm}px`,
      color: 'text.secondary',
      typography: 'bodyXsmallMedium',
      fontFamily: 'inherit',
    }}
  >
    {children}
  </Box>
);

function TopNav() {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{bgcolor: 'background.paper', borderBottom: hairline}}
    >
      <Toolbar disableGutters sx={{minHeight: 64, px: 3, gap: 2}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: {xs: 2, lg: '170px'},
            flex: 1,
            minWidth: 0,
          }}
        >
          <BliroLogo />
          <OutlinedInput
            placeholder="Search..."
            inputProps={{'aria-label': 'Search'}}
            startAdornment={
              <InputAdornment position="start" sx={{mr: 1}}>
                <Img src={searchIcon} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment
                position="end"
                sx={{gap: 0.5, ml: 1, display: {xs: 'none', sm: 'flex'}}}
              >
                <Kbd>
                  <Img src={commandIcon} alt="Command" />
                </Kbd>
                <Kbd>K</Kbd>
              </InputAdornment>
            }
            sx={theme => ({
              flex: 1,
              maxWidth: 780,
              minWidth: 0,
              height: 40,
              px: 2,
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-input': {
                ...theme.typography.bodySmallRegular,
                p: 0,
                '&::placeholder': {color: theme.palette.text.disabled, opacity: 1},
              },
            })}
          />
        </Box>
        <Button variant="contained" startIcon={<Img src={startBliroIcon} />} sx={{flexShrink: 0}}>
          Start bliro
        </Button>
      </Toolbar>
    </AppBar>
  );
}

// --- Sidebar -----------------------------------------------------------------

/** Figma "Vicky" avatar: the photo cropped into a gradient circle, as in Figma. */
export function VickyAvatar() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 20,
        height: 20,
        borderRadius: `${radius.full}px`,
        overflow: 'hidden',
        // Figma's gradient: orange/500 to two colors that have no token.
        backgroundImage: `linear-gradient(130.15deg, ${color.orange['500']} 0%, #ffcaca 50%, #f6649a 100%)`,
      }}
    >
      <Box
        component="img"
        src={vickyPhoto}
        alt=""
        sx={{
          position: 'absolute',
          maxWidth: 'none',
          left: '-19.94%',
          top: '5.05%',
          width: '137.7%',
          height: '127.31%',
        }}
      />
    </Box>
  );
}

const NAV: ({label: string; icon: React.ReactNode} | 'divider')[] = [
  {label: 'My meetings', icon: <Img src={navMyMeetings} />},
  {label: 'Templates', icon: <Img src={navTemplates} />},
  {label: 'Vicky', icon: <VickyAvatar />},
  'divider',
  {label: 'People', icon: <Img src={navPeople} />},
  {label: 'Companies', icon: <Img src={navCompanies} />},
  'divider',
  {label: 'Groups', icon: <Img src={navGroups} />},
];

const menuItemSx = {
  gap: 1,
  px: 1,
  py: '9px',
  borderRadius: `${radius.lg}px`,
  // Figma's active item uses color.action.active-bg; MUI's own selected color
  // is a primary tint, so set it explicitly.
  '&.Mui-selected, &.Mui-selected:hover': {bgcolor: 'action.selected'},
} as const;

const MenuDivider = () => (
  <Box sx={{px: 1, py: 0.5}}>
    <Divider sx={{borderColor: color.neutral['100']}} />
  </Box>
);

function Sidebar({selected, links}: {selected: string; links?: AppShellProps['links']}) {
  return (
    <Box
      component="nav"
      aria-label="Main"
      sx={{
        display: {xs: 'none', md: 'flex'},
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 240,
        flexShrink: 0,
        p: 1,
        bgcolor: 'background.paper',
        borderRight: hairline,
        overflowY: 'auto',
      }}
    >
      <List disablePadding sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
        {NAV.map((item, i) =>
          item === 'divider' ? (
            <MenuDivider key={i} />
          ) : (
            <ListItemButton
              key={item.label}
              selected={item.label === selected}
              aria-current={item.label === selected ? 'page' : undefined}
              {...(links?.[item.label] ? {component: 'a', href: links[item.label]} : {})}
              sx={menuItemSx}
            >
              <ListItemIcon sx={{minWidth: 0}}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{primary: {variant: 'bodySmallMedium'}}}
                sx={{m: 0}}
              />
            </ListItemButton>
          ),
        )}
      </List>

      <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
        <Button variant="contained" fullWidth startIcon={<Img src={downloadIcon} />}>
          Download Bliro
        </Button>
        <MenuDivider />
        <ListItemButton sx={{...menuItemSx, p: 1}}>
          <Avatar src={avatarPeter} alt="" sx={{width: 40, height: 40, border: hairline}} />
          <Box sx={{flex: 1, minWidth: 0}}>
            <Typography variant="bodySmallMedium" component="div">
              Peter
            </Typography>
            <Typography variant="bodyXxsmallRegular" color="textSecondary" component="div">
              peter@example.com
            </Typography>
          </Box>
          <Img src={chevronRightIcon} />
        </ListItemButton>
      </Box>
    </Box>
  );
}

// --- Shell -------------------------------------------------------------------

export type NavLabel = 'My meetings' | 'Templates' | 'Vicky' | 'People' | 'Companies' | 'Groups';

export interface AppShellProps {
  /** The sidebar item for the current page. */
  selected: NavLabel;
  /** Optional hrefs per sidebar item (used by the standalone example pages). */
  links?: Partial<Record<string, string>>;
  children: React.ReactNode;
}

/** Top nav + sidebar, with `children` in the scrolling main area. */
export function AppShell({selected, links, children}: AppShellProps) {
  return (
    <Box
      sx={{height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper'}}
    >
      <TopNav />
      <Box sx={{display: 'flex', flex: 1, minHeight: 0}}>
        <Sidebar selected={selected} links={links} />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            px: {xs: 2, md: 5},
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
