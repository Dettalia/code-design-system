import React from 'react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  Tab,
  Tabs,
  Typography,
  tokens,
} from '../../index';
import {formatLastMeeting, type Company} from '../CompaniesPage';
import {MeetingCard, MeetingSection, PREVIOUS, UPCOMING} from '../MeetingsPage';
import avatarDaniel from '../company-assets/avatar-daniel.png';
import avatarMaya from '../company-assets/avatar-maya.png';
import avatarSofia from '../company-assets/avatar-sofia.png';
import backIcon from '../company-assets/back.svg';
import logoRing32 from '../company-assets/logo-ring-32.svg';
import logoStrategio32 from '../company-assets/logo-strategio-32.png';
import notebookPen from '../company-assets/notebook-pen.svg';
import tabMeetings from '../company-assets/tab-meetings.svg';
import tabOverview from '../company-assets/tab-overview.svg';
import tabPeople from '../company-assets/tab-people.svg';
import logoRing24 from '../companies-assets/logo-ring.svg';
import sortArrowDown from '../companies-assets/sort-arrow-down.svg';
import plusIcon from '../companies-assets/plus.svg';
import {CompanyDetailsCard, type CompanyDetailsCardProps} from './CompanyDetailsCard';
import {NavIcon} from './FlowShell';

// Company detail page from Figma (Bliro Web app, frame 8032:74223) with the
// Overview tab, plus the Meetings (7783:109717) and People (7783:110296) tabs
// it links to.

const {color, radius} = tokens;
const hairline = `1px solid ${color.neutral['100']}`; // Figma Dark - 7 / border.disabled

export type CompanyTab = 'overview' | 'meetings' | 'people';

const TABS: {id: CompanyTab; label: string; icon: string}[] = [
  {id: 'overview', label: 'Overview', icon: tabOverview},
  {id: 'meetings', label: 'Meetings', icon: tabMeetings},
  {id: 'people', label: 'People', icon: tabPeople},
];

const Img = ({src, alt = ''}: {src: string; alt?: string}) => (
  <Box component="img" src={src} alt={alt} sx={{display: 'block', flexShrink: 0}} />
);

/** Company logo with Figma's 1px ring. Strategio has its own 32px export. */
function CompanyLogo32({company}: {company: Company}) {
  const src = company.id === 'strategio' ? logoStrategio32 : company.logo;
  return (
    <Box sx={{position: 'relative', width: 32, height: 32, flexShrink: 0}}>
      <Avatar
        src={src}
        alt=""
        sx={{width: 32, height: 32, fontSize: '0.875rem', fontWeight: 600, bgcolor: color.neutral['50'], color: color.neutral['800']}}
      >
        {company.name[0]}
      </Avatar>
      <Box component="img" src={logoRing32} alt="" sx={{position: 'absolute', inset: 0}} />
    </Box>
  );
}

function SectionHeader({title, action}: {title: string; action?: React.ReactNode}) {
  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Typography variant="bodySmallMedium" color="textSecondary" component="h3">
        {title}
      </Typography>
      {action}
    </Box>
  );
}

const ViewAll = ({onClick, label}: {onClick: () => void; label: string}) => (
  <Link
    component="button"
    type="button"
    onClick={onClick}
    underline="hover"
    color="textSecondary"
    aria-label={label}
    sx={{typography: 'bodySmallMedium'}}
  >
    View all
  </Link>
);

// --- Overview ------------------------------------------------------------------

const NOTES = Array.from({length: 4}, () => ({
  title: 'Need time',
  text: 'Michael needs more time to take a decision, needs approval from management',
}));

type DetailsProps = Omit<CompanyDetailsCardProps, 'company'>;

function Overview({
  company,
  onTab,
  onNote,
  details,
}: {
  company: Company;
  onTab: (t: CompanyTab) => void;
  onNote: () => void;
  details: DetailsProps;
}) {
  // Figma lists three meetings; use the company's most recent ones.
  const meetings = [PREVIOUS[2], PREVIOUS[1], PREVIOUS[3]];
  return (
    <>
      <CompanyDetailsCard company={company} {...details} />

      <Box component="section" aria-label="Meetings" sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
        <SectionHeader title="Meetings" action={<ViewAll label="View all meetings" onClick={() => onTab('meetings')} />} />
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
          {meetings.map((meeting, i) => (
            <MeetingCard key={i} meeting={meeting} />
          ))}
        </Box>
      </Box>

      <Box component="section" aria-label="Notes" sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
        <SectionHeader title="Notes" action={<ViewAll label="View all notes" onClick={onNote} />} />
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
          {NOTES.map((note, i) => (
            <Box
              key={i}
              sx={{flex: '1 0 0', minWidth: {xs: '100%', sm: 346}, display: 'flex', alignItems: 'center', gap: 2, p: 1, border: hairline, borderRadius: `${radius['2xl']}px`}}
            >
              <Box sx={{width: 48, height: 48, flexShrink: 0, display: 'grid', placeItems: 'center', bgcolor: color.neutral['25'], borderRadius: `${radius.lg}px`}}>
                <Img src={notebookPen} />
              </Box>
              <Box sx={{minWidth: 0}}>
                <Typography variant="bodySmallSemibold" component="h4">
                  {note.title}
                </Typography>
                <Typography variant="bodySmallRegular" color="textSecondary" noWrap component="p">
                  {note.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

// --- Meetings tab ----------------------------------------------------------------

function MeetingsTab() {
  return (
    <>
      <Typography variant="bodyNormalSemibold" component="h2">
        Meetings
      </Typography>
      <MeetingSection title="Upcoming meetings" meetings={[UPCOMING[1]]} upcoming />
      <MeetingSection title="Previous meetings" meetings={PREVIOUS.slice(0, 6)} />
    </>
  );
}

// --- People tab ------------------------------------------------------------------

const PEOPLE = [
  {name: 'Maya Chen', avatar: avatarMaya, company: 'Northstar Labs', email: 'maya.chen@northstarlabs.com', lastMeeting: '2026-10-02', meetings: 12},
  {name: 'Daniel Ruiz', avatar: avatarDaniel, company: 'Atlas Health', email: 'daniel.ruiz@atlashealth.com', lastMeeting: '2026-10-01', meetings: 8},
  {name: 'Sofia Patel', avatar: avatarSofia, company: 'Greenfield Co.', email: 'sofia.patel@greenfield.co', lastMeeting: '2026-03-12', meetings: 5},
];

const COLUMNS = ['Person', 'Company', 'Email', 'Last meeting', 'Meetings'];

function PeopleTab({onAddContact}: {onAddContact: () => void}) {
  const cell = {flex: '1 0 0', minWidth: 0} as const;
  return (
    <>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant="bodyNormalSemibold" component="h2">
          People
        </Typography>
        <Button variant="outlined" size="small" startIcon={<Img src={plusIcon} />} onClick={onAddContact}>
          Add contact
        </Button>
      </Box>
      {/* Same frame as the Companies table (neutral/50, see CompaniesPage). */}
      <Box role="table" aria-label="People" sx={{bgcolor: color.neutral['50'], p: 0.5, borderRadius: '20px', overflowX: 'auto'}}>
        <Box role="row" sx={{display: 'flex', gap: 2, px: 2, py: 1, minWidth: 560}}>
          {COLUMNS.map((label, i) => (
            <Box
              role="columnheader"
              key={label}
              aria-sort={i === 0 ? 'ascending' : undefined}
              sx={{...cell, display: 'flex', alignItems: 'center', gap: 0.5, typography: 'bodyXsmallMedium', color: i === 0 ? color.neutral['800'] : 'text.secondary', textDecoration: i === 0 ? 'underline' : 'none'}}
            >
              {label}
              {i === 0 ? <Img src={sortArrowDown} /> : null}
            </Box>
          ))}
        </Box>
        <Box sx={{bgcolor: 'background.paper', borderRadius: `${radius['2xl']}px`, minWidth: 560}}>
          {PEOPLE.map((person, i) => (
            <Box
              role="row"
              key={person.email}
              sx={{display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.5, borderTop: i ? hairline : 0, typography: 'bodySmallRegular'}}
            >
              <Box role="cell" sx={{...cell, display: 'flex', alignItems: 'center', gap: 1}}>
                <Box sx={{position: 'relative', width: 24, height: 24, flexShrink: 0}}>
                  <Avatar src={person.avatar} alt="" sx={{width: 24, height: 24}} />
                  <Box component="img" src={logoRing24} alt="" sx={{position: 'absolute', inset: 0}} />
                </Box>
                <Typography variant="bodySmallSemibold" noWrap sx={{color: color.neutral['900']}}>
                  {person.name}
                </Typography>
              </Box>
              <Box role="cell" sx={{...cell, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                {person.company}
              </Box>
              <Box role="cell" sx={{...cell, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                {person.email}
              </Box>
              <Box role="cell" sx={cell}>
                {formatLastMeeting(person.lastMeeting)}
              </Box>
              <Box role="cell" sx={cell}>
                {person.meetings}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

// --- Page ------------------------------------------------------------------------

export interface CompanyDetailPageProps {
  company: Company;
  tab: CompanyTab;
  onTab: (tab: CompanyTab) => void;
  onBack: () => void;
  /** Company details: the organization's fields, this company's values, and editing them. */
  details: DetailsProps;
  /** For parts that aren't in the prototype (notes, adding contacts). */
  onNotDesigned?: (what: string) => void;
}

export function CompanyDetailPage({company, tab, onTab, onBack, details, onNotDesigned}: CompanyDetailPageProps) {
  return (
    <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 3}}>
      {/* Header: back, logo, name */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
        <IconButton aria-label="Back to companies" onClick={onBack} sx={{width: 28, height: 28, p: 0.5, ml: -0.5, borderRadius: `${radius.lg}px`}}>
          <Img src={backIcon} />
        </IconButton>
        <CompanyLogo32 company={company} />
        <Typography variant="h6" component="h1" sx={{color: color.neutral['900']}}>
          {company.name}
        </Typography>
      </Box>

      {/* Tabs: icon + label, 3px orange indicator, divider below */}
      <Tabs
        value={tab}
        onChange={(_, value: CompanyTab) => onTab(value)}
        aria-label={`${company.name} sections`}
        slotProps={{indicator: {sx: {height: 3, borderRadius: '8px 8px 0 0', bgcolor: color.button.primary.main}}}}
        sx={{minHeight: 0, borderBottom: hairline, '& .MuiTabs-list': {gap: 1}}}
      >
        {TABS.map(t => (
          <Tab
            key={t.id}
            value={t.id}
            label={t.label}
            icon={<NavIcon src={t.icon} active={tab === t.id} />}
            iconPosition="start"
            disableRipple
            sx={{
              minHeight: 0,
              minWidth: 0,
              px: 1,
              pt: '5px',
              pb: '9px',
              gap: 1,
              textTransform: 'none',
              typography: 'bodySmallMedium',
              color: 'text.primary',
              borderRadius: `${radius.lg}px ${radius.lg}px 0 0`,
              '&.Mui-selected': {color: 'text.primary'},
              '& .MuiTab-icon': {m: 0},
              '&:hover': {bgcolor: 'action.hover'},
            }}
          />
        ))}
      </Tabs>

      {tab === 'overview' ? (
        <Overview company={company} onTab={onTab} onNote={() => onNotDesigned?.('Notes')} details={details} />
      ) : tab === 'meetings' ? (
        <MeetingsTab />
      ) : (
        <PeopleTab onAddContact={() => onNotDesigned?.('Adding contacts')} />
      )}
    </Box>
  );
}
