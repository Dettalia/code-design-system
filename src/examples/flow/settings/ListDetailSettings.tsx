import React, {useId, useState} from 'react';
import {Avatar, Box, Button, Chip, IconButton, LinearProgress, Switch, Tooltip, Typography, tokens} from '../../../index';
import avatarMaya from '../../company-assets/avatar-maya.png';
import avatarPeter from '../../meetings-assets/avatar-peter.png';
import avatarDaniel from '../../company-assets/avatar-daniel.png';
import chevronRight from '../../settings-assets/chevron-right-16.svg';
import copyIcon from '../../settings-assets/copy-20.svg';
import fileText from '../../settings-assets/file-text-16.svg';
import layoutList from '../../settings-assets/layout-list-16.svg';
import pencilIcon from '../../settings-assets/pencil-16.svg';
import plusIcon from '../../settings-assets/plus-20.svg';
import searchIcon from '../../settings-assets/search-20.svg';
import trashIcon from '../../settings-assets/trash-16.svg';
import dynamicsLogo from '../../settings-assets/dynamics.png';
import hubspotLogo from '../../settings-assets/hubspot.svg';
import salesforceLogo from '../../settings-assets/salesforce.svg';
import sapLogo from '../../settings-assets/sap.svg';
import slackLogo from '../../settings-assets/slack.svg';
import {SettingSelect} from './controls';
import {
  DataTable,
  DetailHeader,
  Icon,
  ListDetail,
  ListGroup,
  ListItem,
  ListPane,
  SettingRow,
  SettingsPage,
  SettingsSection,
  hairline,
  type Column,
} from './SettingsLayout';

// List–detail template pages (Skills, Integrations, Templates) and Usage.

const {color, radius} = tokens;
const iconBtnSx = {width: 32, height: 32, borderRadius: `${radius.lg}px`} as const;

const PaneAction = ({label, icon, onClick}: {label: string; icon: string; onClick: () => void}) => (
  <Tooltip title={label}>
    <IconButton aria-label={label} onClick={onClick} sx={iconBtnSx}>
      <Icon src={icon} />
    </IconButton>
  </Tooltip>
);

function Meta({items}: {items: [string, string][]}) {
  return (
    <Box component="dl" sx={{display: 'flex', gap: 5, m: 0, flexWrap: 'wrap'}}>
      {items.map(([k, v]) => (
        <Box key={k}>
          <Typography component="dt" variant="bodyXsmallRegular" color="textSecondary">
            {k}
          </Typography>
          <Typography component="dd" variant="bodySmallMedium" sx={{m: 0, mt: 0.5}}>
            {v}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

const ContentCard = ({children}: {children: React.ReactNode}) => (
  <Box sx={{border: hairline, borderRadius: `${radius['2xl']}px`, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5}}>{children}</Box>
);

// --- Skills --------------------------------------------------------------------

type Skill = {id: string; title: string; summary: string; body: string[]; enabled: boolean; tools: string[]};
const SKILLS: Skill[] = [
  {
    id: 'quick-summary',
    title: 'Quick summary',
    summary: 'Writes a three-line summary right after each meeting, so you can share the outcome before the next call.',
    body: ['After every meeting, Bliro writes a short summary: the goal, what was decided and the next step.', 'Use it to post a quick update in Slack or email.'],
    enabled: true,
    tools: ['Read Calendar'],
  },
  {
    id: 'weekly-status-report',
    title: 'Weekly status report',
    summary: 'Generates a weekly summary of completed work across your meetings. Use it to share progress updates or prep for status calls.',
    body: ['Every week, Bliro reviews your recent meetings and pulls out completed work, key decisions and progress updates. It then drafts a ready-to-share status report.', 'Reports are generated every Monday morning, based on meetings from the previous week.'],
    enabled: true,
    tools: ['Read Calendar', 'Write Calendar'],
  },
  {
    id: 'app-connector-schedule',
    title: 'App connector schedule',
    summary: 'Books follow-up meetings in connected apps when a next step is agreed.',
    body: ['When a follow-up is agreed in a meeting, Bliro proposes a time and creates the event in your calendar.'],
    enabled: true,
    tools: ['Write Calendar'],
  },
  {
    id: 'term-glossary',
    title: 'Term glossary',
    summary: 'Explains company-specific terms using your dictionary.',
    body: ['When a term from your dictionary comes up, Bliro adds its explanation to the notes.'],
    enabled: true,
    tools: [],
  },
  {
    id: 'data-gateway-request',
    title: 'Data gateway request',
    summary: 'Requests data from internal systems through the data gateway.',
    body: ['Disabled: needs the data gateway integration.'],
    enabled: false,
    tools: ['Data gateway'],
  },
];

export function SkillsSettings({onMessage}: {onMessage: (m: string) => void}) {
  const [skills, setSkills] = useState(SKILLS);
  const [selectedId, setSelectedId] = useState(SKILLS[1].id);
  const skill = skills.find(s => s.id === selectedId)!;
  const toggleId = useId();
  return (
    <ListDetail
      list={
        <ListPane
          title="Skills"
          description="Enable skills to teach Vicky how to perform tasks."
          actions={
            <>
              <PaneAction label="Search skills" icon={searchIcon} onClick={() => onMessage('Search isn’t in this prototype yet.')} />
              <PaneAction label="New skill" icon={plusIcon} onClick={() => onMessage('Creating skills isn’t in this prototype yet.')} />
            </>
          }
        >
          <ListGroup label="Example skills">
            {skills.map(s => (
              <ListItem key={s.id} icon={<Icon src={fileText} />} title={s.id} selected={s.id === selectedId} muted={!s.enabled} onClick={() => setSelectedId(s.id)} />
            ))}
          </ListGroup>
        </ListPane>
      }
      detail={
        <>
          <DetailHeader
            title={skill.id}
            actions={
              <>
                <Typography id={toggleId} variant="bodyXsmallRegular" color="textSecondary">
                  {skill.enabled ? 'Enabled' : 'Disabled'}
                </Typography>
                <Switch
                  checked={skill.enabled}
                  onChange={(_, enabled) => setSkills(all => all.map(s => (s.id === skill.id ? {...s, enabled} : s)))}
                  slotProps={{input: {'aria-label': `${skill.title} enabled`}}}
                />
                <PaneAction label="Duplicate skill" icon={copyIcon} onClick={() => onMessage('Duplicating skills isn’t in this prototype yet.')} />
              </>
            }
          >
            <Meta items={[['Added by', 'Admin'], ['Last updated', '1 month ago'], ['Invoked by', 'User for Bliro']]} />
            <Typography variant="bodySmallRegular">{skill.summary}</Typography>
          </DetailHeader>
          <ContentCard>
            <Typography variant="subheadingSubheading3" component="h3">
              {skill.title}
            </Typography>
            {skill.body.map((p, i) => (
              <Typography key={i} variant="bodySmallRegular">
                {p}
              </Typography>
            ))}
            {skill.tools.length ? (
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                <Typography variant="bodyXsmallRegular" color="textSecondary">
                  Uses
                </Typography>
                {skill.tools.map(t => (
                  <Chip key={t} label={t} size="small" sx={{height: 22, bgcolor: 'action.selected', color: 'primary.main', '& .MuiChip-label': {px: 1, typography: 'bodyXxsmallRegular', fontWeight: 500}}} />
                ))}
              </Box>
            ) : null}
          </ContentCard>
        </>
      }
    />
  );
}

// --- Integrations --------------------------------------------------------------

type Integration = {id: string; name: string; account: string; logo: string; connected: boolean; description: string};
const INTEGRATIONS: Integration[] = [
  {id: 'dynamics', name: 'Microsoft Dynamics', account: 'Production', logo: dynamicsLogo, connected: true, description: 'Let Bliro manage Microsoft Dynamics for you. Before a meeting, Bliro reads contacts, accounts and open opportunities to brief you. Afterwards, it can write visit reports, update deals and log activities.'},
  {id: 'hubspot', name: 'HubSpot', account: 'Not connected', logo: hubspotLogo, connected: false, description: 'Sync contacts, companies and deals with HubSpot, and log meeting notes to the right records.'},
  {id: 'sap', name: 'SAP C4C', account: 'Not connected', logo: sapLogo, connected: false, description: 'Bring SAP Sales Cloud accounts and opportunities into your meeting prep, and write visit reports back.'},
  {id: 'salesforce', name: 'Salesforce', account: 'Not connected', logo: salesforceLogo, connected: false, description: 'Keep Salesforce up to date: Bliro logs meetings, updates opportunities and creates tasks from next steps.'},
  {id: 'slack', name: 'Slack', account: 'Primary account', logo: slackLogo, connected: true, description: 'Post meeting summaries and action items to Slack channels.'},
];
const TOOLS = ['Contact sync', 'Lead connect', 'Budget'];

const Logo = ({src, size = 32}: {src: string; size?: number}) => (
  <Box component="img" src={src} alt="" sx={{width: size, height: size, borderRadius: `${radius.lg}px`, flexShrink: 0, display: 'block'}} />
);

export function IntegrationsSettings({onMessage}: {onMessage: (m: string) => void}) {
  const [items, setItems] = useState(INTEGRATIONS);
  const [selectedId, setSelectedId] = useState(INTEGRATIONS[0].id);
  const [instance, setInstance] = useState<'trial' | 'production'>('trial');
  const [tools, setTools] = useState(TOOLS);
  const it = items.find(i => i.id === selectedId)!;
  const setConnected = (connected: boolean) => setItems(all => all.map(i => (i.id === it.id ? {...i, connected, account: connected ? 'Primary account' : 'Not connected'} : i)));
  return (
    <ListDetail
      list={
        <ListPane title="Integrations" description="Connect the tools your team already uses." actions={<PaneAction label="Request an integration" icon={plusIcon} onClick={() => onMessage('Requests aren’t in this prototype yet.')} />}>
          <ListGroup>
            {items.map(i => (
              <ListItem key={i.id} icon={<Logo src={i.logo} />} title={i.name} subtitle={i.account} muted={!i.connected} selected={i.id === selectedId} onClick={() => setSelectedId(i.id)} />
            ))}
          </ListGroup>
        </ListPane>
      }
      detail={
        <>
          <DetailHeader
            leading={<Logo src={it.logo} size={40} />}
            title={it.name}
            actions={
              it.connected ? (
                <Button variant="outlined" onClick={() => setConnected(false)}>
                  Disconnect
                </Button>
              ) : (
                <Button variant="contained" onClick={() => (setConnected(true), onMessage(`${it.name} connected`))}>
                  Connect
                </Button>
              )
            }
          >
            <Typography variant="bodySmallRegular">{it.description}</Typography>
          </DetailHeader>
          {it.connected ? (
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
              {it.id === 'dynamics' ? (
                <SettingsSection title="Connection">
                  <SettingRow
                    label="Dynamics instance"
                    description="Bliro reads and writes data in this instance."
                    control={
                      <SettingSelect
                        ariaLabel="Dynamics instance"
                        value={instance}
                        onChange={setInstance}
                        options={[
                          {value: 'trial', label: 'Sales Trial'},
                          {value: 'production', label: 'Production'},
                        ]}
                      />
                    }
                  />
                </SettingsSection>
              ) : null}
              <SettingsSection
                title="Tools & permissions"
                description="Choose when Bliro is allowed to use these tools."
                action={
                  <Button variant="outlined" size="small" startIcon={<Icon src={plusIcon} size={16} />} onClick={() => onMessage('Adding tools isn’t in this prototype yet.')}>
                    Add tool
                  </Button>
                }
              >
                {tools.length ? (
                  tools.map(t => (
                    <SettingRow
                      key={t}
                      label={
                        <Box component="span" sx={{display: 'inline-flex', alignItems: 'center', gap: 1}}>
                          <Icon src={chevronRight} />
                          {t}
                        </Box>
                      }
                      control={
                        <Tooltip title="Remove tool">
                          <IconButton aria-label={`Remove ${t}`} onClick={() => setTools(all => all.filter(x => x !== t))} sx={iconBtnSx}>
                            <Icon src={trashIcon} />
                          </IconButton>
                        </Tooltip>
                      }
                    />
                  ))
                ) : (
                  <SettingRow label="No tools yet" description="Add a tool to let Bliro act in this app." />
                )}
              </SettingsSection>
            </Box>
          ) : (
            <ContentCard>
              <Typography variant="bodySmallSemibold">Not connected</Typography>
              <Typography variant="bodySmallRegular" color="textSecondary">
                Connect {it.name} to choose an account and the tools Bliro may use.
              </Typography>
            </ContentCard>
          )}
        </>
      }
    />
  );
}

// --- Templates -----------------------------------------------------------------

type Template = {id: string; name: string; scope: 'personal' | 'org'; active: boolean; sections: string[]};
const TEMPLATES: Template[] = [
  {id: 'demo', name: 'Product demo', scope: 'personal', active: true, sections: ['Executive summary', 'Questions asked', 'Features shown', 'Next steps']},
  {id: 'qa', name: 'Q&A', scope: 'personal', active: false, sections: ['Questions and answers', 'Open questions']},
  {id: 'standup', name: 'Daily stand-up', scope: 'personal', active: true, sections: ['Done yesterday', 'Planned today', 'Blockers']},
  {id: 'discovery', name: 'Sales discovery call', scope: 'personal', active: false, sections: ['Pain points', 'Budget', 'Decision makers', 'Timeline', 'Next steps']},
  {id: 'general', name: 'General', scope: 'org', active: true, sections: ['Executive summary', 'Topics', 'Action items']},
  {id: 'org-qa', name: 'Q&A', scope: 'org', active: true, sections: ['Questions and answers']},
];

export function TemplatesSettings({onMessage}: {onMessage: (m: string) => void}) {
  const [templates, setTemplates] = useState(TEMPLATES);
  const [selectedId, setSelectedId] = useState(TEMPLATES[0].id);
  const t = templates.find(x => x.id === selectedId)!;
  const group = (scope: Template['scope']) =>
    templates
      .filter(x => x.scope === scope)
      .map(x => <ListItem key={x.id} icon={<Icon src={layoutList} />} title={x.name} muted={!x.active} selected={x.id === selectedId} onClick={() => setSelectedId(x.id)} />);
  return (
    <ListDetail
      list={
        <ListPane
          title="Templates"
          description="Tell Bliro how you like your meetings summarized."
          actions={<PaneAction label="New template" icon={plusIcon} onClick={() => onMessage('Creating templates isn’t in this prototype yet.')} />}
        >
          <ListGroup label="Personal">{group('personal')}</ListGroup>
          <ListGroup label="Organization">{group('org')}</ListGroup>
        </ListPane>
      }
      detail={
        <>
          <DetailHeader
            title={t.name}
            actions={
              <>
                <Typography variant="bodyXsmallRegular" color="textSecondary">
                  {t.scope === 'org' ? 'Shared with everyone' : t.active ? 'In use' : 'Not in use'}
                </Typography>
                <Switch
                  checked={t.active}
                  disabled={t.scope === 'org'}
                  onChange={(_, active) => setTemplates(all => all.map(x => (x.id === t.id ? {...x, active} : x)))}
                  slotProps={{input: {'aria-label': `Use ${t.name}`}}}
                />
                <Tooltip title="Edit template">
                  <IconButton aria-label="Edit template" onClick={() => onMessage('Editing templates isn’t in this prototype yet.')} sx={iconBtnSx}>
                    <Icon src={pencilIcon} />
                  </IconButton>
                </Tooltip>
              </>
            }
          >
            <Typography variant="bodySmallRegular" color="textSecondary">
              {t.scope === 'org' ? 'Organization template, managed by admins.' : 'Personal template, only used for your meetings.'}
            </Typography>
          </DetailHeader>
          <SettingsSection title="Summary sections" description="Bliro writes these sections, in this order.">
            {t.sections.map((s, i) => (
              <SettingRow key={s} label={`${i + 1}. ${s}`} />
            ))}
          </SettingsSection>
        </>
      }
    />
  );
}

// --- Usage ---------------------------------------------------------------------

type UserLimit = {id: string; name: string; email: string; avatar: string; limit: string; used: string};
const LIMITS: UserLimit[] = [
  {id: 'peter', name: 'Peter', email: 'peter@example.com', avatar: avatarPeter, limit: '—', used: '0 min'},
  {id: 'sarah', name: 'Sarah', email: 'sarah.kors@example.com', avatar: avatarMaya, limit: '100 min', used: '25 min'},
  {id: 'michael', name: 'Michael', email: 'michael.smith@example.com', avatar: avatarDaniel, limit: '—', used: '0 min'},
];

export function UsageSettings({onMessage}: {onMessage: (m: string) => void}) {
  const soon = () => onMessage('Editing limits isn’t in this prototype yet.');
  const columns: Column<UserLimit>[] = [
    {
      key: 'user',
      label: 'User',
      width: 'minmax(0, 2fr)',
      render: u => (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0}}>
          <Avatar src={u.avatar} alt="" sx={{width: 32, height: 32}} />
          <Box sx={{minWidth: 0}}>
            <Typography variant="bodySmallMedium" noWrap component="div">
              {u.name}
            </Typography>
            <Typography variant="bodyXxsmallRegular" color="textSecondary" noWrap component="div">
              {u.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {key: 'limit', label: 'Custom limit', render: u => u.limit},
    {key: 'used', label: 'Extra this month', render: u => u.used},
    {
      key: 'edit',
      label: '',
      width: '48px',
      align: 'right',
      render: u => (
        <IconButton aria-label={`Edit limit for ${u.name}`} onClick={soon} sx={iconBtnSx}>
          <Icon src={pencilIcon} />
        </IconButton>
      ),
    },
  ];
  return (
    <SettingsPage title="Usage and spend limits" description="Track extra minutes beyond your plan, and manage limits.">
      <SettingsSection title="Phone agent">
        <SettingRow
          label="Extra usage"
          help="Minutes beyond the minutes included in your plan."
          description="Minutes your organization used beyond your plan this cycle. Resets June 1."
          control={
            <Button variant="outlined" size="small" onClick={soon}>
              Edit limit
            </Button>
          }
        >
          <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1, typography: 'bodyXsmallRegular', color: 'text.secondary'}}>
              <span>
                <Box component="strong" sx={{color: 'text.primary', fontWeight: 600}}>
                  25
                </Box>{' '}
                / 200 min
              </span>
              <span>12.5% used</span>
            </Box>
            <LinearProgress variant="determinate" value={12.5} aria-label="Extra usage" sx={{height: 6, borderRadius: 3, bgcolor: color.orange['50'], '& .MuiLinearProgress-bar': {borderRadius: 3}}} />
          </Box>
        </SettingRow>
        <SettingRow
          label="Seat spend limits"
          help="Applies until you set a custom limit for a person."
          description="How many extra minutes each user type gets."
          control={
            <Button variant="outlined" size="small" onClick={soon}>
              Edit limits
            </Button>
          }
        >
          <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2}}>
            {[
              ['Standard user (2 seats)', '0'],
              ['Revenue user (1 seat)', '50'],
            ].map(([k, v]) => (
              <Box key={k}>
                <Typography variant="bodyXsmallRegular" color="textSecondary" component="div">
                  {k}
                </Typography>
                <Typography variant="bodySmallRegular" component="div">
                  <strong>{v}</strong> min / month
                </Typography>
              </Box>
            ))}
          </Box>
        </SettingRow>
      </SettingsSection>
      <SettingsSection card={false} title="Limits by user">
        <DataTable label="Limits by user" columns={columns} rows={LIMITS} rowKey={u => u.id} />
      </SettingsSection>
      <SettingsSection title="Transcription">
        <SettingRow
          label="Transcribed this month"
          description="Across everyone in your organization."
          control={
            <Typography variant="subheadingSubheading3" component="div">
              1,234 min
            </Typography>
          }
        />
      </SettingsSection>
    </SettingsPage>
  );
}
