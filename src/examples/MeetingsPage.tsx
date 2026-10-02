import React from 'react';
import {Box, Button, Card, Chip, Typography, alpha, tokens} from '../index';
import {AppShell, Img, type AppShellProps} from './AppShell';
import calendarIcon from './meetings-assets/calendar.svg';
import filterIcon from './meetings-assets/filter.svg';
import tagFolder from './meetings-assets/tag-folder.svg';
import tagGavel from './meetings-assets/tag-gavel.svg';
import tagWallet from './meetings-assets/tag-wallet.svg';
import timerIcon from './meetings-assets/timer.svg';
import usersIcon from './meetings-assets/users-small.svg';

// "My meetings" from the Bliro Web app Figma file (node 7808:131769), built
// from the design system's MUI components and theme, inside the shared
// AppShell. Icons and images are the Figma assets in ./meetings-assets.

const {color, radius, border} = tokens;

// Figma's meeting metadata and tags use 12px Medium, which has no text style
// in the design system (closest: Body/XSmall, 13px).
const caption12 = {
  fontSize: '0.75rem',
  lineHeight: '16px',
  fontWeight: 500,
  letterSpacing: '-0.01em',
};

// --- Meetings ----------------------------------------------------------------

// Group tags are user data in the app: each group has its own icon and color.
const GROUPS = {
  introductory: {label: 'Introductory calls', icon: tagFolder, color: color.neutral['900']},
  // No design-system token: Figma uses rgb(227, 46, 124) for this group.
  negotiation: {label: 'Negotiation calls', icon: tagWallet, color: '#e32e7c'},
  closing: {label: 'Closing calls', icon: tagGavel, color: color.green['400']},
} as const;

export type Meeting = {
  title: string;
  date: string;
  duration: string;
  attendees: number;
  group?: keyof typeof GROUPS;
};

export const UPCOMING: Meeting[] = [
  {
    title: 'Q4 Product Roadmap Review',
    date: '24 Sep. 2026 - 09.30',
    duration: '15 min',
    attendees: 6,
    group: 'negotiation',
  },
  {
    title: 'Mobile App Design Review',
    date: '25 Sep. 2026 - 14.00',
    duration: '15 min',
    attendees: 5,
  },
  {
    title: 'Q4 Product Roadmap Review',
    date: '24 Sep. 2026 - 09.30',
    duration: '15 min',
    attendees: 6,
    group: 'negotiation',
  },
];

export const PREVIOUS: Meeting[] = [
  {
    title: 'Q4 Product Roadmap Review',
    date: '24 Sep. 2026 - 09.30',
    duration: '15 min',
    attendees: 6,
    group: 'negotiation',
  },
  {
    title: 'Mobile App Design Review',
    date: '25 Sep. 2026 - 14.00',
    duration: '15 min',
    attendees: 5,
  },
  {
    title: 'Q4 Product Roadmap Review',
    date: '24 Sep. 2026 - 09.30',
    duration: '15 min',
    attendees: 6,
    group: 'negotiation',
  },
  {
    title: 'Launch Go/No-Go',
    date: '28 Sep. 2026 - 10.15',
    duration: '15 min',
    attendees: 8,
    group: 'closing',
  },
  {
    title: 'Mobile App Design Review',
    date: '25 Sep. 2026 - 14.00',
    duration: '15 min',
    attendees: 5,
  },
  {
    title: 'Launch Go/No-Go',
    date: '28 Sep. 2026 - 10.15',
    duration: '15 min',
    attendees: 8,
    group: 'closing',
  },
  {
    title: 'Q4 Product Roadmap Review',
    date: '24 Sep. 2026 - 09.30',
    duration: '15 min',
    attendees: 6,
    group: 'negotiation',
  },
  {
    title: 'Mobile App Design Review',
    date: '25 Sep. 2026 - 14.00',
    duration: '15 min',
    attendees: 5,
  },
  {
    title: 'Launch Go/No-Go',
    date: '28 Sep. 2026 - 10.15',
    duration: '15 min',
    attendees: 8,
    group: 'closing',
  },
];

function GroupTag({group}: {group: keyof typeof GROUPS}) {
  const {label, icon, color: tagColor} = GROUPS[group];
  return (
    <Chip
      size="small"
      icon={<Img src={icon} />}
      label={label}
      sx={{
        height: 24,
        px: '6px',
        gap: 0.5,
        borderRadius: `${radius.sm}px`,
        bgcolor: alpha(tagColor, 0.08),
        border: `${border.width.thin}px solid ${alpha(tagColor, 0.1)}`,
        color: color.neutral['800'],
        '& .MuiChip-icon': {m: 0},
        '& .MuiChip-label': {...caption12, p: 0},
      }}
    />
  );
}

const Separator = () => (
  <Typography
    component="span"
    aria-hidden
    sx={{fontSize: '0.6875rem', lineHeight: '16px', color: color.neutral['200'], opacity: 0.5}}
  >
    |
  </Typography>
);

const Detail = ({icon, children}: {icon: string; children: React.ReactNode}) => (
  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
    <Img src={icon} />
    {children}
  </Box>
);

export function MeetingCard({meeting, upcoming}: {meeting: Meeting; upcoming?: boolean}) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        // Upcoming meetings: dashed border.default; previous: solid border.disabled.
        borderStyle: upcoming ? 'dashed' : 'solid',
        borderColor: upcoming ? color.border.default : color.border.disabled,
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
        <Typography variant="bodySmallSemibold" component="h3">
          {meeting.title}
        </Typography>
        {meeting.group ? <GroupTag group={meeting.group} /> : null}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          color: 'text.secondary',
        }}
      >
        <Detail icon={calendarIcon}>
          <Typography sx={caption12}>{meeting.date}</Typography>
        </Detail>
        <Separator />
        <Detail icon={timerIcon}>
          <Typography sx={caption12}>{meeting.duration}</Typography>
        </Detail>
        <Separator />
        <Detail icon={usersIcon}>
          <Box
            aria-label={`${meeting.attendees} attendees`}
            sx={{
              ...caption12,
              width: 24,
              height: 20,
              display: 'grid',
              placeItems: 'center',
              bgcolor: color.neutral['50'],
              borderRadius: `${radius.sm}px`,
            }}
          >
            {meeting.attendees}
          </Box>
        </Detail>
      </Box>
    </Card>
  );
}

export function MeetingSection({
  title,
  meetings,
  upcoming,
}: {
  title: string;
  meetings: Meeting[];
  upcoming?: boolean;
}) {
  return (
    <Box
      component="section"
      aria-label={title}
      sx={{width: '100%', maxWidth: 1024, display: 'flex', flexDirection: 'column', gap: 1}}
    >
      <Typography variant="bodySmallMedium" color="textSecondary" component="h2">
        {title}
      </Typography>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
        {meetings.map((meeting, i) => (
          <MeetingCard key={i} meeting={meeting} upcoming={upcoming} />
        ))}
      </Box>
    </Box>
  );
}

const FILTERS = ['Date', 'Send Status', 'Contact', 'Record'];

// --- Page ----------------------------------------------------------------------

/** The "My meetings" page content, without the app shell (used by the flow prototype). */
export function MeetingsContent() {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          maxWidth: 1024,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h5" component="h1">
          My meetings
        </Typography>
        <Box sx={{display: 'flex', gap: 0.5, flexWrap: 'wrap'}}>
          {FILTERS.map(filter => (
            <Button
              key={filter}
              variant="outlined"
              size="small"
              startIcon={<Img src={filterIcon} />}
            >
              {filter}
            </Button>
          ))}
        </Box>
      </Box>
      <MeetingSection title="Upcoming meetings" meetings={UPCOMING} upcoming />
      <MeetingSection title="Previous meetings" meetings={PREVIOUS} />
    </>
  );
}

export function MeetingsPage({links}: {links?: AppShellProps['links']} = {}) {
  return (
    <AppShell selected="My meetings" links={links}>
      <MeetingsContent />
    </AppShell>
  );
}
