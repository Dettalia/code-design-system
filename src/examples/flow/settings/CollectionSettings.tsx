import React, {useId, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Switch,
  Tooltip,
  Typography,
  tokens,
} from '../../../index';
import {ModalField, ModalHeader} from '../../ModalParts';
import avatarDaniel from '../../company-assets/avatar-daniel.png';
import avatarMaya from '../../company-assets/avatar-maya.png';
import avatarPeter from '../../meetings-assets/avatar-peter.png';
import bookIcon from '../../settings-assets/book-a-20.svg';
import copyIcon from '../../settings-assets/copy-16.svg';
import ellipsisIcon from '../../settings-assets/ellipsis-20.svg';
import keyIcon from '../../settings-assets/key-20.svg';
import plusIcon from '../../settings-assets/plus-20.svg';
import searchIcon from '../../settings-assets/search-16.svg';
import sendIcon from '../../settings-assets/send-16.svg';
import trashIcon from '../../settings-assets/trash-16.svg';
import webhookIcon from '../../settings-assets/webhook-20.svg';
import {MaskIcon} from '../FlowShell';
import {SettingSelect} from './controls';
import {DataTable, EmptyState, Icon, SettingsPage, SettingsSection, type Column} from './SettingsLayout';

// Collection template pages: header with the primary action, an optional
// search, then a table card with an empty state.

const {radius} = tokens;
const iconBtnSx = {width: 32, height: 32, borderRadius: `${radius.lg}px`} as const;

const AddButton = ({label, onClick}: {label: string; onClick: () => void}) => (
  <Button variant="contained" startIcon={<MaskIcon src={plusIcon} color="primary.contrastText" />} onClick={onClick}>
    {label}
  </Button>
);

function Search({value, onChange, label}: {value: string; onChange: (v: string) => void; label: string}) {
  return (
    <OutlinedInput
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={`${label}...`}
      inputProps={{'aria-label': label}}
      startAdornment={
        <InputAdornment position="start">
          <Icon src={searchIcon} />
        </InputAdornment>
      }
      sx={theme => ({width: 240, height: 36, px: 1.5, '& .MuiOutlinedInput-input': {...theme.typography.bodySmallRegular, p: 0}})}
    />
  );
}

/** A small form dialog (Figma Modal) for adding an item. */
function AddDialog({open, title, fields, submitLabel, onClose, onSubmit}: {
  open: boolean;
  title: string;
  fields: {key: string; label: string; placeholder?: string}[];
  submitLabel: string;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}) {
  const titleId = useId();
  const [values, setValues] = useState<Record<string, string>>({});
  const valid = fields.every(f => (values[f.key] ?? '').trim());
  const close = () => (setValues({}), onClose());
  return (
    <Dialog open={open} onClose={close} aria-labelledby={titleId}>
      <Box
        component="form"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (!valid) return;
          onSubmit(Object.fromEntries(fields.map(f => [f.key, values[f.key].trim()])));
          setValues({});
        }}
      >
        <ModalHeader id={titleId} title={title} onClose={close} />
        <DialogContent>
          {fields.map((f, i) => (
            <ModalField
              key={f.key}
              label={f.label}
              placeholder={f.placeholder}
              autoFocus={i === 0}
              value={values[f.key] ?? ''}
              onChange={e => setValues(v => ({...v, [f.key]: e.target.value}))}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={close}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={!valid}>
            {submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function RowMenu({label, items}: {label: string; items: {label: string; danger?: boolean; onClick: () => void}[]}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <IconButton aria-label={label} aria-haspopup="menu" onClick={e => setAnchor(e.currentTarget)} sx={iconBtnSx}>
        <Icon src={ellipsisIcon} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        slotProps={{paper: {sx: {borderRadius: `${radius['2xl']}px`, p: 1, minWidth: 180}}, list: {sx: {p: 0}}}}
      >
        {items.map(item => (
          <MenuItem
            key={item.label}
            onClick={() => (setAnchor(null), item.onClick())}
            sx={{borderRadius: `${radius.lg}px`, typography: 'bodySmallMedium', minHeight: 40, color: item.danger ? 'error.main' : undefined}}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const Person = ({name, email, avatar}: {name: string; email: string; avatar?: string}) => (
  <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0}}>
    <Avatar src={avatar} alt="" sx={{width: 32, height: 32, fontSize: 13, fontWeight: 600, bgcolor: 'action.selected', color: 'primary.main'}}>
      {name
        .split(' ')
        .map(p => p[0])
        .join('')}
    </Avatar>
    <Box sx={{minWidth: 0}}>
      <Typography variant="bodySmallMedium" noWrap component="div">
        {name}
      </Typography>
      <Typography variant="bodyXxsmallRegular" color="textSecondary" noWrap component="div">
        {email}
      </Typography>
    </Box>
  </Box>
);

// --- Members -------------------------------------------------------------------

type Member = {id: string; name: string; email: string; avatar?: string; role: 'admin' | 'member'};
const MEMBERS: Member[] = [
  {id: 'peter', name: 'Peter Hoffmann', email: 'peter@example.com', avatar: avatarPeter, role: 'admin'},
  {id: 'maria', name: 'Maria Gliga', email: 'maria@durran.co', role: 'member'},
  {id: 'chloe', name: 'Chloe Davis', email: 'chloe@example.com', avatar: avatarMaya, role: 'member'},
  {id: 'daniel', name: 'Daniel Ruiz', email: 'daniel@example.com', avatar: avatarDaniel, role: 'member'},
];
const ROLES = [
  {value: 'admin', label: 'Admin'},
  {value: 'member', label: 'Member'},
] as const;

export function MembersSettings({onMessage}: {onMessage: (m: string) => void}) {
  const [members, setMembers] = useState(MEMBERS);
  const [query, setQuery] = useState('');
  const [inviting, setInviting] = useState(false);
  const shown = members.filter(m => `${m.name} ${m.email}`.toLowerCase().includes(query.toLowerCase()));
  const columns: Column<Member>[] = [
    {key: 'name', label: 'Name', width: 'minmax(0, 2fr)', render: m => <Person {...m} />},
    {
      key: 'role',
      label: 'Role',
      width: '180px',
      render: m => (
        <SettingSelect
          ariaLabel={`Role for ${m.name}`}
          width={140}
          value={m.role}
          options={ROLES}
          onChange={role => setMembers(all => all.map(x => (x.id === m.id ? {...x, role} : x)))}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '48px',
      align: 'right',
      render: m => (
        <RowMenu
          label={`More actions for ${m.name}`}
          items={[{label: 'Remove from organization', danger: true, onClick: () => setMembers(all => all.filter(x => x.id !== m.id))}]}
        />
      ),
    },
  ];
  return (
    <SettingsPage title="Members" description="Manage who is in your organization and what they can do." actions={<AddButton label="Invite people" onClick={() => setInviting(true)} />}>
      <SettingsSection card={false} title={`${members.length} members`} action={<Search value={query} onChange={setQuery} label="Search members" />}>
        <DataTable label="Members" columns={columns} rows={shown} rowKey={m => m.id} empty={<EmptyState icon={searchIcon} title="No members match your search" />} />
      </SettingsSection>
      <AddDialog
        open={inviting}
        title="Invite people"
        submitLabel="Send invite"
        fields={[
          {key: 'name', label: 'Name', placeholder: 'e.g. Sarah Kors'},
          {key: 'email', label: 'Email', placeholder: 'name@company.com'},
        ]}
        onClose={() => setInviting(false)}
        onSubmit={({name, email}) => {
          setMembers(all => [...all, {id: email, name, email, role: 'member'}]);
          setInviting(false);
          onMessage(`Invite sent to ${email}`);
        }}
      />
    </SettingsPage>
  );
}

// --- Dictionary ----------------------------------------------------------------

type Word = {word: string; soundsLike: string};
const WORDS: Word[] = [
  {word: 'Bliro', soundsLike: 'blee-roh'},
  {word: 'Dynamics 365', soundsLike: 'dynamics three sixty five'},
  {word: 'ICP', soundsLike: 'I C P'},
  {word: 'Strategio', soundsLike: 'stra-teh-jo'},
];

export function DictionarySettings() {
  const [words, setWords] = useState(WORDS);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const shown = words.filter(w => w.word.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.word.localeCompare(b.word));
  const columns: Column<Word>[] = [
    {key: 'word', label: 'Word', render: w => <Typography variant="bodySmallMedium">{w.word}</Typography>},
    {key: 'sounds', label: 'Sounds like', render: w => <Typography variant="bodySmallRegular" color="textSecondary">{w.soundsLike || '—'}</Typography>},
    {
      key: 'actions',
      label: '',
      width: '48px',
      align: 'right',
      render: w => (
        <Tooltip title="Delete">
          <IconButton aria-label={`Delete ${w.word}`} onClick={() => setWords(all => all.filter(x => x.word !== w.word))} sx={iconBtnSx}>
            <Icon src={trashIcon} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  return (
    <SettingsPage
      title="Dictionary"
      description="Teach Bliro words and abbreviations that are specific to your industry or company."
      actions={<AddButton label="Add word" onClick={() => setAdding(true)} />}
    >
      <SettingsSection card={false} title={`${words.length} words`} action={<Search value={query} onChange={setQuery} label="Search words" />}>
        <DataTable
          label="Dictionary"
          columns={columns}
          rows={shown}
          rowKey={w => w.word}
          empty={
            <EmptyState
              icon={bookIcon}
              title={query ? 'No words match your search' : 'No words yet'}
              description={query ? undefined : 'Add names, products and abbreviations Bliro should spell correctly.'}
            />
          }
        />
      </SettingsSection>
      <AddDialog
        open={adding}
        title="Add word"
        submitLabel="Add word"
        fields={[
          {key: 'word', label: 'Word', placeholder: 'e.g. Strategio'},
          {key: 'soundsLike', label: 'Sounds like', placeholder: 'e.g. stra-teh-jo'},
        ]}
        onClose={() => setAdding(false)}
        onSubmit={({word, soundsLike}) => (setWords(all => [...all, {word, soundsLike}]), setAdding(false))}
      />
    </SettingsPage>
  );
}

// --- API access ----------------------------------------------------------------

type ApiKey = {id: string; name: string; clientId: string; created: string};

export function ApiAccessSettings({onMessage}: {onMessage: (m: string) => void}) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [creating, setCreating] = useState(false);
  const create = () => setCreating(true);
  const columns: Column<ApiKey>[] = [
    {key: 'name', label: 'Name', render: k => <Typography variant="bodySmallMedium">{k.name}</Typography>},
    {
      key: 'client',
      label: 'Client ID',
      width: 'minmax(0, 1.5fr)',
      render: k => (
        <>
          <Typography variant="bodySmallRegular" noWrap sx={{fontFamily: 'ui-monospace, monospace', fontSize: 13}}>
            {k.clientId}
          </Typography>
          <Tooltip title="Copy client ID">
            <IconButton aria-label={`Copy client ID for ${k.name}`} onClick={() => (navigator.clipboard?.writeText(k.clientId).catch(() => {}), onMessage('Client ID copied'))} sx={{...iconBtnSx, width: 28, height: 28}}>
              <Icon src={copyIcon} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
    {key: 'created', label: 'Created', width: '120px', render: k => <Typography variant="bodySmallRegular" color="textSecondary">{k.created}</Typography>},
    {
      key: 'actions',
      label: '',
      width: '48px',
      align: 'right',
      render: k => <RowMenu label={`More actions for ${k.name}`} items={[{label: 'Revoke key', danger: true, onClick: () => setKeys(all => all.filter(x => x.id !== k.id))}]} />,
    },
  ];
  return (
    <SettingsPage
      title="API Access"
      description="Create keys for apps that use the Bliro API. Don’t share client secrets or expose them in a browser; Bliro may disable keys that leak."
      helpHref="https://bliro.io"
      actions={keys.length ? <AddButton label="Create API key" onClick={create} /> : undefined}
    >
      <SettingsSection card={false}>
        <DataTable
          label="API keys"
          columns={columns}
          rows={keys}
          rowKey={k => k.id}
          empty={<EmptyState icon={keyIcon} title="No API keys yet" description="Create a key to connect your own tools to Bliro." action={<AddButton label="Create API key" onClick={create} />} />}
        />
      </SettingsSection>
      <AddDialog
        open={creating}
        title="Create API key"
        submitLabel="Create key"
        fields={[{key: 'name', label: 'Name', placeholder: 'e.g. Data warehouse sync'}]}
        onClose={() => setCreating(false)}
        onSubmit={({name}) => {
          const id = Math.random().toString(36).slice(2, 10);
          setKeys(all => [...all, {id, name, clientId: `bliro_${id}${id.slice(0, 6)}`, created: 'Today'}]);
          setCreating(false);
          onMessage('API key created');
        }}
      />
    </SettingsPage>
  );
}

// --- Webhooks ------------------------------------------------------------------

type Webhook = {id: string; name: string; url: string; active: boolean};
const WEBHOOKS: Webhook[] = [
  {id: 'crm', name: 'CRM sync', url: 'https://hooks.example.com/crm', active: true},
  {id: 'slack', name: 'Slack summaries', url: 'https://hooks.slack.com/services/T0/B0', active: true},
  {id: 'warehouse', name: 'Data warehouse', url: 'https://ingest.example.com/bliro', active: false},
];

export function WebhooksSettings({onMessage}: {onMessage: (m: string) => void}) {
  const [hooks, setHooks] = useState(WEBHOOKS);
  const [creating, setCreating] = useState(false);
  const columns: Column<Webhook>[] = [
    {key: 'name', label: 'Name', render: h => <Typography variant="bodySmallMedium">{h.name}</Typography>},
    {key: 'url', label: 'URL', width: 'minmax(0, 1.5fr)', render: h => <Typography variant="bodySmallRegular" color="textSecondary" noWrap>{h.url}</Typography>},
    {
      key: 'status',
      label: 'Active',
      width: '72px',
      render: h => <Switch checked={h.active} onChange={(_, active) => setHooks(all => all.map(x => (x.id === h.id ? {...x, active} : x)))} slotProps={{input: {'aria-label': `${h.name} active`}}} />,
    },
    {
      key: 'actions',
      label: '',
      width: '176px',
      align: 'right',
      render: h => (
        <>
          <Button variant="outlined" size="small" startIcon={<Icon src={sendIcon} />} onClick={() => onMessage(`Test event sent to ${h.name}`)} disabled={!h.active}>
            Test
          </Button>
          <RowMenu label={`More actions for ${h.name}`} items={[{label: 'Delete webhook', danger: true, onClick: () => setHooks(all => all.filter(x => x.id !== h.id))}]} />
        </>
      ),
    },
  ];
  return (
    <SettingsPage
      title="Webhook Management"
      description="Send meeting events to your own systems as they happen."
      helpHref="https://bliro.io"
      actions={<AddButton label="New webhook" onClick={() => setCreating(true)} />}
    >
      <SettingsSection card={false}>
        <DataTable
          label="Webhooks"
          columns={columns}
          rows={hooks}
          rowKey={h => h.id}
          empty={<EmptyState icon={webhookIcon} title="No webhooks yet" description="Add a URL and Bliro will post meeting events to it." />}
        />
      </SettingsSection>
      <AddDialog
        open={creating}
        title="New webhook"
        submitLabel="Add webhook"
        fields={[
          {key: 'name', label: 'Name', placeholder: 'e.g. CRM sync'},
          {key: 'url', label: 'URL', placeholder: 'https://'},
        ]}
        onClose={() => setCreating(false)}
        onSubmit={({name, url}) => (setHooks(all => [...all, {id: `${name}-${Date.now()}`, name, url, active: true}]), setCreating(false))}
      />
    </SettingsPage>
  );
}
