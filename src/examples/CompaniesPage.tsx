import React, {useId, useMemo, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  tokens,
} from '../index';
import {AppShell, Img, type AppShellProps} from './AppShell';
import {CloseIcon, ModalField, ModalHeader} from './ModalParts';
import logoAcme from './companies-assets/logo-acme.png';
import logoDurran from './companies-assets/logo-durran.png';
import logoRing from './companies-assets/logo-ring.svg';
import logoStrategio from './companies-assets/logo-strategio.png';
import plusIcon from './companies-assets/plus.svg';
import sortArrowDown from './companies-assets/sort-arrow-down.svg';
import searchIcon from './meetings-assets/search.svg';

// "Companies" from the Bliro Web app Figma file (frame 7808:131095), built
// from the design system's MUI components inside the shared AppShell.
//
// Follows the Figma layout and table, plus list-page features Figma doesn't
// show yet (each marked "Not in Figma" below, for design review): working
// search, sortable columns, separate Contacts and Last meeting columns, rows
// that open the company, a no-results state, a mobile layout, and an Add
// company modal.

const {color, radius} = tokens;
const rowDivider = `1px solid ${color.neutral['100']}`;

// --- Data ----------------------------------------------------------------------

export interface Company {
  id: string;
  name: string;
  website: string;
  /** Not in Figma: number of people at the company. */
  contacts: number;
  /** ISO date of the most recent meeting; absent for a company with no meetings yet. */
  lastMeeting?: string;
  meetings: number;
  logo?: string;
  /** Company detail page (Figma 8032:74223): Location, Employees, ICP fit. Empty when unknown. */
  location: string;
  employees: string;
  icpFit: string;
}

// "Today" for the example data, so relative dates read the same every time.
const TODAY = new Date('2026-10-02T12:00:00');

export const COMPANIES: Company[] = [
  {
    id: 'acme',
    name: 'ACME',
    website: 'acme.labs',
    contacts: 6,
    lastMeeting: '2026-10-02',
    meetings: 12,
    logo: logoAcme,
    location: 'United States',
    employees: '500+',
    icpFit: 'Core ICP',
  },
  {
    id: 'strategio',
    name: 'Strategio',
    website: 'strategio.com',
    contacts: 4,
    lastMeeting: '2026-10-01',
    meetings: 8,
    logo: logoStrategio,
    location: 'Germany',
    employees: '2.500+',
    icpFit: 'Core ICP',
  },
  {
    id: 'durran',
    name: 'Durran',
    website: 'durran.co',
    contacts: 3,
    lastMeeting: '2026-03-12',
    meetings: 5,
    logo: logoDurran,
    location: 'Romania',
    employees: '10+',
    icpFit: 'OK ICP',
  },
  // Not in Figma: more rows, so search, sorting and scrolling can be tried.
  // Companies without a logo show their initial. Detail fields (location,
  // employees, ICP fit) are sample data except Strategio's, which are Figma's.
  {
    id: 'northstar',
    name: 'Northstar Labs',
    website: 'northstarlabs.com',
    contacts: 9,
    lastMeeting: '2026-09-29',
    meetings: 17,
    location: 'United Kingdom',
    employees: '1.000+',
    icpFit: 'Core ICP',
  },
  {
    id: 'atlas',
    name: 'Atlas Health',
    website: 'atlashealth.com',
    contacts: 2,
    lastMeeting: '2026-09-18',
    meetings: 3,
    location: 'Netherlands',
    employees: '250+',
    icpFit: 'OK ICP',
  },
  {
    id: 'greenfield',
    name: 'Greenfield',
    website: 'greenfield.co',
    contacts: 5,
    lastMeeting: '2026-08-27',
    meetings: 9,
    location: 'Austria',
    employees: '50+',
    icpFit: 'No ICP',
  },
  {
    id: 'kite',
    name: 'Kite & Co',
    website: 'kiteandco.de',
    contacts: 1,
    lastMeeting: '2026-07-04',
    meetings: 1,
    location: 'Germany',
    employees: '10+',
    icpFit: 'No ICP',
  },
  {
    id: 'meridian',
    name: 'Meridian Bank',
    website: 'meridian-bank.com',
    contacts: 11,
    lastMeeting: '2026-09-30',
    meetings: 24,
    location: 'Switzerland',
    employees: '5.000+',
    icpFit: 'Core ICP',
  },
];

/** "Today", "Yesterday", or "Mar 12" (plus the year if it isn't the current one), as in Figma. */
export function formatLastMeeting(iso: string | undefined, today = TODAY) {
  if (!iso) return '—';
  const date = new Date(`${iso}T12:00:00`);
  const days = Math.round((today.getTime() - date.getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() === today.getFullYear() ? {} : {year: 'numeric'}),
  });
}

type SortKey = 'name' | 'contacts' | 'lastMeeting' | 'meetings';
type Sort = {key: SortKey; direction: 'asc' | 'desc'};

function sortCompanies(companies: Company[], {key, direction}: Sort) {
  const factor = direction === 'asc' ? 1 : -1;
  return [...companies].sort((a, b) => {
    if (key === 'name') return a.name.localeCompare(b.name) * factor;
    // Companies without a value (no meetings yet) always go last.
    const [x, y] = [a[key], b[key]];
    if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
    return (x < y ? -1 : x > y ? 1 : 0) * factor;
  });
}

// --- Table ---------------------------------------------------------------------

const COLUMNS: {
  key: SortKey | 'website';
  label: string;
  sortable: boolean;
  hideBelow?: 'sm' | 'md';
}[] = [
  {key: 'name', label: 'Company', sortable: true},
  {key: 'website', label: 'Website', sortable: false, hideBelow: 'md'},
  // Not in Figma: Figma's "Contacts" column shows dates, so it is split into
  // a Contacts count and a Last meeting date.
  {key: 'contacts', label: 'Contacts', sortable: true, hideBelow: 'md'},
  {key: 'lastMeeting', label: 'Last meeting', sortable: true, hideBelow: 'sm'},
  {key: 'meetings', label: 'Meetings', sortable: true},
];

const hideBelow = (breakpoint?: 'sm' | 'md') =>
  breakpoint ? {display: {xs: 'none', [breakpoint]: 'table-cell'}} : {};

function CompanyLogo({company}: {company: Company}) {
  // Figma: 24px logo with a 1px #e7e8e9 ring on top.
  return (
    <Box sx={{position: 'relative', width: 24, height: 24, flexShrink: 0}}>
      <Avatar
        src={company.logo}
        alt=""
        sx={{
          width: 24,
          height: 24,
          fontSize: '0.75rem',
          fontWeight: 600,
          bgcolor: color.neutral['50'],
          color: color.neutral['800'],
        }}
      >
        {company.name[0]}
      </Avatar>
      <Box component="img" src={logoRing} alt="" sx={{position: 'absolute', inset: 0}} />
    </Box>
  );
}

function SortArrow({direction}: {direction: 'asc' | 'desc'}) {
  // Figma's arrow-down icon marks the default A-to-Z sort; flipped for the
  // reverse order.
  return (
    <Box
      component="img"
      src={sortArrowDown}
      alt=""
      sx={{
        transform: direction === 'desc' ? 'rotate(180deg)' : 'none',
        transition: 'transform 150ms',
      }}
    />
  );
}

function CompaniesTable({
  companies,
  sort,
  onSort,
  onOpen,
}: {
  companies: Company[];
  sort: Sort;
  onSort: (key: SortKey) => void;
  onOpen: (company: Company) => void;
}) {
  const cellSx = {px: 2, py: 1.5, borderBottom: rowDivider, typography: 'bodySmallRegular'};
  return (
    // Frame (4px padding, 20px corners) around a white 16px-radius body. Uses
    // neutral/50; Figma's frame is neutral/25 (changed on request, 2026-10-02).
    <Box sx={{bgcolor: color.neutral['50'], p: 0.5, borderRadius: '20px'}}>
      <TableContainer sx={{overflow: 'visible'}}>
        <Table aria-label="Companies" sx={{borderCollapse: 'separate', tableLayout: 'fixed'}}>
          <TableHead>
            <TableRow>
              {COLUMNS.map(column => {
                const active = sort.key === column.key;
                return (
                  <TableCell
                    key={column.key}
                    sortDirection={active ? sort.direction : false}
                    sx={{
                      px: 2,
                      py: 1,
                      border: 0,
                      typography: 'bodyXsmallMedium',
                      color: active ? color.neutral['800'] : 'text.secondary',
                      ...hideBelow(column.hideBelow),
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={active}
                        direction={active ? sort.direction : 'asc'}
                        onClick={() => onSort(column.key as SortKey)}
                        IconComponent={() =>
                          active ? <SortArrow direction={sort.direction} /> : null
                        }
                        sx={{
                          gap: 0.5,
                          color: 'inherit',
                          '&.Mui-active': {color: 'inherit', textDecoration: 'underline'},
                          '&:hover': {color: color.neutral['800']},
                        }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              bgcolor: 'background.paper',
              // White 16px-radius body: round the corner cells of the first and last rows.
              '& tr:first-of-type td:first-of-type': {borderTopLeftRadius: radius['2xl']},
              '& tr:first-of-type td:last-of-type': {borderTopRightRadius: radius['2xl']},
              '& tr:last-of-type td': {borderBottom: 0},
              '& tr:last-of-type td:first-of-type': {borderBottomLeftRadius: radius['2xl']},
              '& tr:last-of-type td:last-of-type': {borderBottomRightRadius: radius['2xl']},
            }}
          >
            {companies.map(company => (
              <TableRow
                key={company.id}
                hover
                tabIndex={0}
                aria-label={`Open ${company.name}`}
                onClick={() => onOpen(company)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpen(company);
                  }
                }}
                sx={{
                  cursor: 'pointer',
                  '&:focus-visible': {
                    outline: `2px solid ${color.border.focus}`,
                    outlineOffset: -2,
                  },
                }}
              >
                <TableCell sx={cellSx}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1, minWidth: 0}}>
                    <CompanyLogo company={company} />
                    <Typography
                      variant="bodySmallSemibold"
                      noWrap
                      sx={{color: color.neutral['900']}}
                    >
                      {company.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{...cellSx, ...hideBelow('md')}}>
                  {/* Not in Figma: the website opens in a new tab without opening the row. */}
                  <Link
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    color="textPrimary"
                    onClick={event => event.stopPropagation()}
                    noWrap
                    sx={{display: 'block'}}
                  >
                    {company.website}
                  </Link>
                </TableCell>
                <TableCell sx={{...cellSx, ...hideBelow('md')}}>{company.contacts}</TableCell>
                <TableCell sx={{...cellSx, ...hideBelow('sm')}}>
                  {formatLastMeeting(company.lastMeeting)}
                </TableCell>
                <TableCell sx={cellSx}>{company.meetings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// --- No results (not in Figma) ------------------------------------------------

function NoResults({query, onClear}: {query: string; onClear: () => void}) {
  return (
    <Box
      role="status"
      sx={{
        // Same frame as the table.
        bgcolor: color.neutral['50'],
        borderRadius: '20px',
        p: 0.5,
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: `${radius['2xl']}px`,
          py: 6,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="bodySmallSemibold" component="p">
          No companies match “{query}”
        </Typography>
        <Typography
          variant="bodySmallRegular"
          color="textSecondary"
          component="p"
          sx={{mt: 0.5, mb: 2}}
        >
          Check the spelling, or search by website instead.
        </Typography>
        <Button variant="outlined" size="small" onClick={onClear}>
          Clear search
        </Button>
      </Box>
    </Box>
  );
}

// --- Add company (not in Figma) -----------------------------------------------

function AddCompanyModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (company: Pick<Company, 'name' | 'website'>) => void;
}) {
  const titleId = useId();
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const close = () => {
    setName('');
    setWebsite('');
    onClose();
  };
  return (
    <Dialog open={open} onClose={close} aria-labelledby={titleId}>
      <form
        onSubmit={event => {
          event.preventDefault();
          onAdd({name: name.trim(), website: website.trim().replace(/^https?:\/\//, '')});
          close();
        }}
      >
        <ModalHeader id={titleId} title="Add company" onClose={close} />
        <DialogContent>
          <ModalField
            label="Company name"
            placeholder="Acme Inc."
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
          <ModalField
            label="Website"
            placeholder="acme.com"
            value={website}
            onChange={e => setWebsite(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={close}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={!name.trim()}>
            Add company
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// --- Page ----------------------------------------------------------------------

export interface CompaniesPageProps {
  links?: AppShellProps['links'];
  /** Called when a row is opened (the details view isn't part of this example). */
  onOpenCompany?: (company: Company) => void;
}

/** The Companies page content, without the app shell (used by the flow prototype). */
export function CompaniesContent({onOpenCompany}: Pick<CompaniesPageProps, 'onOpenCompany'>) {
  const [companies, setCompanies] = useState(COMPANIES);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>({key: 'name', direction: 'asc'});
  const [adding, setAdding] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? companies.filter(
          c => c.name.toLowerCase().includes(q) || c.website.toLowerCase().includes(q),
        )
      : companies;
    return sortCompanies(filtered, sort);
  }, [companies, query, sort]);

  const toggleSort = (key: SortKey) =>
    setSort(current =>
      current.key === key
        ? {key, direction: current.direction === 'asc' ? 'desc' : 'asc'}
        : // Numbers and dates are most useful largest/newest first.
          {key, direction: key === 'name' ? 'asc' : 'desc'},
    );

  return (
    <>
      <Box sx={{width: '100%', maxWidth: 1024, display: 'flex', flexDirection: 'column', gap: 3}}>
        {/* Figma header: title left; search + Add company right. */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            px: 2,
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'baseline', gap: 1}}>
            <Typography variant="h6" component="h1">
              Companies
            </Typography>
            {/* Not in Figma: how many companies the list shows. */}
            <Typography variant="bodySmallRegular" color="textSecondary" aria-live="polite">
              {query ? `${visible.length} of ${companies.length}` : companies.length}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: {xs: '1 1 100%', sm: '0 1 auto'},
            }}
          >
            <OutlinedInput
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search for a company..."
              inputProps={{'aria-label': 'Search for a company'}}
              startAdornment={
                <InputAdornment position="start" sx={{mr: 1}}>
                  <Img src={searchIcon} />
                </InputAdornment>
              }
              // Not in Figma: a clear button once there's a query.
              endAdornment={
                query ? (
                  <InputAdornment position="end" sx={{ml: 0.5}}>
                    <IconButton
                      aria-label="Clear search"
                      size="small"
                      onClick={() => setQuery('')}
                      sx={{p: 0.25, color: 'text.secondary'}}
                    >
                      <CloseIcon sx={{fontSize: 16}} />
                    </IconButton>
                  </InputAdornment>
                ) : undefined
              }
              sx={theme => ({
                flex: 1,
                width: {sm: 196},
                height: 32,
                px: '12px',
                borderRadius: `${radius.lg}px`,
                '& .MuiOutlinedInput-input': {
                  ...theme.typography.bodyXsmallRegular,
                  p: 0,
                  '&::placeholder': {color: theme.palette.text.disabled, opacity: 1},
                  // The browser's own clear button reserves space and clips the
                  // placeholder; the clear button above replaces it.
                  '&::-webkit-search-cancel-button': {display: 'none'},
                },
              })}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<Img src={plusIcon} />}
              onClick={() => setAdding(true)}
              sx={{flexShrink: 0}}
            >
              Add company
            </Button>
          </Box>
        </Box>

        {visible.length ? (
          <CompaniesTable
            companies={visible}
            sort={sort}
            onSort={toggleSort}
            onOpen={company => onOpenCompany?.(company)}
          />
        ) : (
          <NoResults query={query} onClear={() => setQuery('')} />
        )}
      </Box>

      <AddCompanyModal
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={({name, website}) =>
          setCompanies(current => [
            ...current,
            {
              // URL-safe, since the prototype puts it in the address (#/companies/<id>).
              id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
              name,
              website,
              contacts: 0,
              meetings: 0,
              location: '',
              employees: '',
              icpFit: '',
            },
          ])
        }
      />
    </>
  );
}

export function CompaniesPage({links, onOpenCompany}: CompaniesPageProps) {
  return (
    <AppShell selected="Companies" links={links}>
      <CompaniesContent onOpenCompany={onOpenCompany} />
    </AppShell>
  );
}
