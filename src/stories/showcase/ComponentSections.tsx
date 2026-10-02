import React, {useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  AppBar,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Fab,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Skeleton,
  Slider,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  SvgIcon,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  type SvgIconProps,
} from '../../index';
import {ModalHeader} from '../../examples/ModalParts';
import {Demo, Row, Section} from './ui';

// Small inline icons, so the viewer doesn't need @mui/icons-material.
const icon = (d: string) =>
  function Icon(props: SvgIconProps) {
    return (
      <SvgIcon {...props}>
        <path d={d} />
      </SvgIcon>
    );
  };
const AddIcon = icon('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z');
const MicIcon = icon(
  'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.3-3a5.3 5.3 0 0 1-10.6 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9h-1.7z',
);
const MoreIcon = icon(
  'M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
);
const ExpandIcon = icon('M16.6 8.6 12 13.2 7.4 8.6 6 10l6 6 6-6z');
const CalendarIcon = icon(
  'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11z',
);
const InboxIcon = icon(
  'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 12h-4a3 3 0 0 1-6 0H5V5h14v10z',
);
const MailIcon = icon(
  'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
);

const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;

export function ButtonsSection() {
  return (
    <Section
      id="buttons"
      title="Buttons"
      description="Button follows the Figma component Button_v2 (see src/theme/components/button.ts). The full type × size × state sheet is in Components / Button / Figma sheet."
    >
      <Demo
        title="Button (Figma Button_v2)"
        inputs={[
          'Main → contained: color.button.primary.* / color.error.*',
          'Tonal → variant="tonal": color.button.tonal.*',
          'Outlined → outlined: color.button.outlined.*',
          'Text → text, Text-Subtle → variant="textSubtle": color.button.text.*',
          'sizes 32/40/48/56 → small/medium/large/xlarge',
          'corner radius ← radius.button (8px)',
          'focus ring ← color.border.focus',
        ]}
      >
        {(['contained', 'tonal', 'outlined', 'text', 'textSubtle'] as const).map(variant => (
          <Row key={variant} label={`variant="${variant}"`}>
            <Button variant={variant}>Label</Button>
            {variant === 'contained' ? (
              <Button variant={variant} color="error">
                Error
              </Button>
            ) : null}
            <Button variant={variant} disabled>
              Disabled
            </Button>
          </Row>
        ))}
        <Row label="Other MUI colors (no Figma design: MUI's own styling)">
          {colors
            .filter(color => color !== 'primary' && color !== 'error')
            .map(color => (
              <Button key={color} variant="contained" color={color}>
                {color}
              </Button>
            ))}
        </Row>
        <Row label="sizes, icons">
          <Button variant="contained" size="small">
            Small · 32
          </Button>
          <Button variant="contained">Medium · 40</Button>
          <Button variant="contained" size="large">
            Large · 48
          </Button>
          <Button variant="contained" size="xlarge">
            XLarge · 56
          </Button>
          <Button variant="contained" startIcon={<MicIcon />}>
            Start recording
          </Button>
          <Button variant="outlined" endIcon={<ExpandIcon />}>
            More
          </Button>
          <Button variant="contained" loading>
            Loading
          </Button>
        </Row>
      </Demo>
      <Demo
        title="ButtonGroup, IconButton, Fab, ToggleButton"
        inputs={['palette.action.*', 'palette.grey', 'shadows[6] (Fab)']}
      >
        <Row>
          <ButtonGroup variant="outlined">
            <Button>Day</Button>
            <Button>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
          <ButtonGroup variant="contained">
            <Button>Save</Button>
            <Button>Share</Button>
          </ButtonGroup>
        </Row>
        <Row>
          <IconButton aria-label="more">
            <MoreIcon />
          </IconButton>
          <IconButton color="primary" aria-label="record">
            <MicIcon />
          </IconButton>
          <IconButton disabled aria-label="disabled">
            <MicIcon />
          </IconButton>
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
          <Fab variant="extended" size="medium">
            <MicIcon sx={{mr: 1}} />
            Record
          </Fab>
          <ToggleGroupDemo />
        </Row>
      </Demo>
    </Section>
  );
}

function ToggleGroupDemo() {
  const [view, setView] = useState('list');
  return (
    <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small">
      <ToggleButton value="list">List</ToggleButton>
      <ToggleButton value="board">Board</ToggleButton>
      <ToggleButton value="calendar">Calendar</ToggleButton>
    </ToggleButtonGroup>
  );
}

export function InputsSection() {
  const [channel, setChannel] = useState('email');
  return (
    <Section id="inputs" title="Inputs">
      <Demo
        title="TextField"
        inputs={[
          'override: radius.input, border ← color.border.default',
          'focus ← palette.primary.main',
          'error ← palette.error.main',
          'typography.body1 ← Body/Normal/Regular',
        ]}
      >
        {(['outlined', 'filled', 'standard'] as const).map(variant => (
          <Row key={variant} label={`variant="${variant}"`}>
            <TextField variant={variant} label="Meeting title" placeholder="Weekly sync" />
            <TextField variant={variant} label="With helper" helperText="Shown to attendees" />
            <TextField
              variant={variant}
              label="Error"
              error
              defaultValue="not-an-email"
              helperText="Enter a valid email"
            />
            <TextField variant={variant} label="Disabled" disabled defaultValue="Read only" />
            <TextField variant={variant} label="Small" size="small" />
          </Row>
        ))}
        <Row label="multiline, select, autocomplete">
          <TextField label="Notes" multiline minRows={3} sx={{width: 260}} />
          <FormControl sx={{minWidth: 180}}>
            <InputLabel id="channel">Share via</InputLabel>
            <Select
              labelId="channel"
              label="Share via"
              value={channel}
              onChange={e => setChannel(e.target.value)}
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="slack">Slack</MenuItem>
              <MenuItem value="crm">CRM</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            options={['Anna Weber', 'Jonas Keller', 'Mia Schmidt', 'Lukas Braun']}
            sx={{width: 240}}
            renderInput={params => <TextField {...params} label="Attendee" />}
          />
        </Row>
      </Demo>
      <Demo
        title="Selection controls"
        inputs={['palette.primary.main', 'palette.action.disabled ← color.text.disabled']}
      >
        <Row>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
          <FormControlLabel control={<Checkbox />} label="Unchecked" />
          <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
          <FormControlLabel control={<Checkbox disabled />} label="Disabled" />
        </Row>
        <Row>
          <RadioGroup row defaultValue="a">
            <FormControlLabel value="a" control={<Radio />} label="Summary" />
            <FormControlLabel value="b" control={<Radio />} label="Transcript" />
            <FormControlLabel value="c" control={<Radio />} label="Disabled" disabled />
          </RadioGroup>
        </Row>
        <Row>
          <FormControlLabel control={<Switch defaultChecked />} label="Auto-join meetings" />
          <FormControlLabel control={<Switch />} label="Off" />
          <FormControlLabel control={<Switch disabled />} label="Disabled" />
        </Row>
        <Row>
          <Box sx={{width: 260, px: 1}}>
            <Slider defaultValue={40} aria-label="Volume" />
          </Box>
          <Box sx={{width: 260, px: 1}}>
            <Slider defaultValue={[20, 60]} marks step={10} />
          </Box>
          <Rating defaultValue={4} />
        </Row>
      </Demo>
    </Section>
  );
}

export function FeedbackSection() {
  const [dialog, setDialog] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  return (
    <Section id="feedback" title="Feedback">
      <Demo
        title="Alert"
        inputs={[
          'palette.success/info/warning/error.main ← color.*.default',
          'MUI tints the standard variant from main',
        ]}
      >
        {(['standard', 'filled', 'outlined'] as const).map(variant => (
          <Box
            key={variant}
            sx={{
              display: 'grid',
              gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'},
              gap: 1.5,
              mb: 2,
            }}
          >
            {(['success', 'info', 'warning', 'error'] as const).map(severity => (
              <Alert key={severity} severity={severity} variant={variant}>
                <AlertTitle>{severity}</AlertTitle>
                variant=&quot;{variant}&quot; — summary ready to share.
              </Alert>
            ))}
          </Box>
        ))}
      </Demo>
      <Demo
        title="Progress, Skeleton, Dialog, Snackbar, Tooltip"
        inputs={[
          'Dialog = Figma Modal: shadow.modal, radius.2xl, 480px',
          'DialogTitle padding 16 + divider, DialogContent 24, DialogActions 16',
        ]}
      >
        <Row>
          <CircularProgress />
          <CircularProgress color="success" />
          <CircularProgress variant="determinate" value={70} />
          <Box sx={{width: 240}}>
            <LinearProgress />
            <LinearProgress variant="determinate" value={60} color="warning" sx={{mt: 2}} />
          </Box>
        </Row>
        <Row>
          <Box sx={{width: 260}}>
            <Skeleton variant="text" />
            <Skeleton variant="rounded" height={48} />
          </Box>
          <Skeleton variant="circular" width={48} height={48} />
        </Row>
        <Row>
          <Button variant="contained" onClick={() => setDialog(true)}>
            Open dialog
          </Button>
          <Button variant="outlined" onClick={() => setSnackbar(true)}>
            Show snackbar
          </Button>
          <Tooltip title="Tooltip uses palette.grey[700] in MUI">
            <Button>Hover for tooltip</Button>
          </Tooltip>
        </Row>
        <Dialog open={dialog} onClose={() => setDialog(false)} aria-labelledby="showcase-dialog">
          <ModalHeader
            id="showcase-dialog"
            title="Share meeting summary?"
            onClose={() => setDialog(false)}
          />
          <DialogContent>
            <DialogContentText>
              The summary and action items will be sent to all 4 attendees.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => setDialog(false)}>
              Share
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar}
          autoHideDuration={3000}
          onClose={() => setSnackbar(false)}
          message="Summary shared"
        />
      </Demo>
    </Section>
  );
}

export function DataDisplaySection() {
  return (
    <Section id="data-display" title="Data display">
      <Demo
        title="Chip, Badge, Avatar"
        inputs={['override: Chip radius.tag', 'palette.* (colors)', 'palette.grey (default chip)']}
      >
        {(['filled', 'outlined'] as const).map(variant => (
          <Row key={variant} label={`variant="${variant}"`}>
            <Chip variant={variant} label="default" />
            {colors.map(color => (
              <Chip key={color} variant={variant} color={color} label={color} />
            ))}
            <Chip variant={variant} label="deletable" onDelete={() => {}} />
            <Chip variant={variant} label="clickable" onClick={() => {}} />
            <Chip variant={variant} size="small" label="small" />
          </Row>
        ))}
        <Row label="Badge, Avatar">
          <Badge badgeContent={4} color="primary">
            <MailIcon />
          </Badge>
          <Badge badgeContent={12} color="error">
            <InboxIcon />
          </Badge>
          <Badge variant="dot" color="success">
            <CalendarIcon />
          </Badge>
          <Avatar>AW</Avatar>
          <Avatar sx={{bgcolor: 'primary.main'}}>JK</Avatar>
          <AvatarGroup max={4}>
            <Avatar>AW</Avatar>
            <Avatar>JK</Avatar>
            <Avatar>MS</Avatar>
            <Avatar>LB</Avatar>
            <Avatar>TR</Avatar>
          </AvatarGroup>
        </Row>
      </Demo>
      <Demo
        title="List, Table, Divider"
        inputs={[
          'palette.action.hover/selected',
          'palette.divider ← color.border.default',
          'typography.body2',
        ]}
      >
        <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '280px 1fr'}, gap: 3}}>
          <Paper variant="outlined">
            <List dense>
              <ListItemButton selected>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="All meetings" secondary="Selected" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText primary="Upcoming" secondary="3 this week" />
              </ListItemButton>
              <Divider />
              <ListItemButton disabled>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Archived" secondary="Disabled" />
              </ListItemButton>
            </List>
          </Paper>
          <Paper variant="outlined" sx={{overflowX: 'auto'}}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Meeting</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ['Discovery call', '2 Oct', '32 min', 'success'],
                  ['Weekly sync', '1 Oct', '45 min', 'info'],
                  ['Renewal review', '30 Sep', '18 min', 'warning'],
                ].map(([name, date, duration, status]) => (
                  <TableRow key={name} hover>
                    <TableCell>{name}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell align="right">{duration}</TableCell>
                    <TableCell>
                      <Chip size="small" color={status as 'success'} label={status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Demo>
    </Section>
  );
}

export function NavigationSection() {
  const [tab, setTab] = useState(0);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <Section id="navigation" title="Navigation">
      <Demo
        title="Tabs, Breadcrumbs, Pagination, Stepper, Menu, Link"
        inputs={[
          'palette.primary.main',
          'palette.text.secondary',
          'shadows[8] ← shadow.modal (Menu)',
        ]}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{borderBottom: 1, borderColor: 'divider', mb: 2.5}}
        >
          <Tab label="Summary" />
          <Tab label="Transcript" />
          <Tab label="Action items" />
          <Tab label="Disabled" disabled />
        </Tabs>
        <Row>
          <Breadcrumbs>
            <Link underline="hover" color="inherit" href="#navigation">
              Meetings
            </Link>
            <Link underline="hover" color="inherit" href="#navigation">
              Acme Corp
            </Link>
            <Typography color="textPrimary">Discovery call</Typography>
          </Breadcrumbs>
        </Row>
        <Row>
          <Pagination count={8} defaultPage={2} color="primary" />
          <Pagination count={8} variant="outlined" shape="rounded" />
        </Row>
        <Box sx={{my: 3}}>
          <Stepper activeStep={1} alternativeLabel>
            {['Record', 'Summarize', 'Review', 'Share'].map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Row>
          <Button
            variant="outlined"
            onClick={e => setAnchor(e.currentTarget)}
            endIcon={<ExpandIcon />}
          >
            Open menu
          </Button>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
            <MenuItem onClick={() => setAnchor(null)}>Copy summary</MenuItem>
            <MenuItem onClick={() => setAnchor(null)}>Send to CRM</MenuItem>
            <MenuItem onClick={() => setAnchor(null)} disabled>
              Delete
            </MenuItem>
          </Menu>
          <Link href="#navigation">A text link</Link>
        </Row>
      </Demo>
    </Section>
  );
}

export function SurfacesSection() {
  return (
    <Section id="surfaces" title="Surfaces">
      <Demo
        title="Card, Paper, Accordion, AppBar"
        inputs={[
          'override: Card radius.2xl (16px, code only; Figma radius.card is 8px)',
          'Paper outlined border ← color.border.default',
          'background.paper ← color.background.surface',
          'shadows[1] ← shadow.1',
        ]}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {xs: '1fr', md: 'repeat(3, 1fr)'},
            gap: 2.5,
            mb: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="overline" color="textSecondary">
                Elevated card
              </Typography>
              <Typography variant="h6">Discovery call — Acme</Typography>
              <Typography variant="body2" color="textSecondary">
                Budget confirmed for Q4. Next step: technical demo with IT.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Open</Button>
              <Button size="small" color="secondary">
                Share
              </Button>
            </CardActions>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" color="textSecondary">
                Outlined card
              </Typography>
              <Typography variant="h6">Weekly sync</Typography>
              <Typography variant="body2" color="textSecondary">
                3 action items, 2 decisions.
              </Typography>
            </CardContent>
          </Card>
          <Paper sx={{p: 2, bgcolor: 'background.default'}} elevation={0}>
            <Typography variant="subtitle1">background.default</Typography>
            <Typography variant="body2" color="textSecondary">
              ← color.background.page. This is the page background CssBaseline applies.
            </Typography>
          </Paper>
        </Box>
        <Box sx={{mb: 3}}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Typography variant="subtitle1">Action items</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Send pricing to Anna by Friday. Book the technical demo.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Typography variant="subtitle1">Decisions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">Pilot starts in November.</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{flexGrow: 1}}>
              AppBar (primary)
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <AppBar position="static" color="default" sx={{mt: 2}}>
          <Toolbar>
            <Typography variant="h6" sx={{flexGrow: 1}}>
              AppBar (default)
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip size="small" label="Recording" color="error" />
            </Stack>
          </Toolbar>
        </AppBar>
      </Demo>
    </Section>
  );
}
