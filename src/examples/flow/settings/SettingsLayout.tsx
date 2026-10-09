import React from 'react';
import {Box, ButtonBase, Link, Tooltip, Typography, tokens} from '../../../index';
import circleHelp from '../../settings-assets/circle-help-16.svg';
import externalLink from '../../settings-assets/external-link-16.svg';
import {hiddenScrollbarSx} from '../FlowShell';

// Settings layout system. Every settings page uses one of three templates,
// built from the same parts, so new settings slot in without new layouts:
//
//   Form          SettingsPage > SettingsSection > SettingRow
//                 (Account, General, Usage). Exploration 8153:91545: section
//                 title above a bordered card, one setting per row, label on
//                 the left and its control on the right.
//   Collection    SettingsPage > SettingsSection (card={false}) > DataTable / EmptyState
//                 (Members, Dictionary, API access, Webhooks, Company fields).
//   List–detail   ListDetail > ListPane + DetailPane
//                 (Skills, Integrations, Templates): the pages that already work.
//
// Shared rules: one page header (title, description, help link, actions on the
// right), 880px content width centered, Save/Cancel in the header and only
// enabled with unsaved changes, 32px between sections.

const {color, radius} = tokens;
export const hairline = `1px solid ${color.neutral['100']}`;
export const CONTENT_WIDTH = 880;

/**
 * How Form sections are drawn, one per Figma exploration (section 8183:146430):
 *   banded  A (8145:86593)  grey band with the section name, rows on a white panel
 *   card    B (8153:91545)  title above a bordered card, dividers between rows (default)
 *   flat    C (8153:92096)  title above flat rows, dividers between sections only
 * Pages don't change; only SettingsSection and SettingsPage read it.
 */
export type SectionStyle = 'banded' | 'card' | 'flat';
export const SectionStyleContext = React.createContext<SectionStyle>('card');

export const Icon = ({src, size}: {src: string; size?: number}) => (
  <Box component="img" src={src} alt="" sx={{display: 'block', flexShrink: 0, ...(size ? {width: size, height: size} : {})}} />
);

/** A "?" icon that explains a setting on hover or focus. */
export function HelpTip({title}: {title: string}) {
  return (
    <Tooltip title={title} placement="top">
      <Box
        component="span"
        tabIndex={0}
        role="img"
        aria-label={title}
        sx={{display: 'inline-flex', borderRadius: `${radius.full}px`, cursor: 'help', '&:focus-visible': {outline: `2px solid ${color.button.primary.main}`}}}
      >
        <Icon src={circleHelp} />
      </Box>
    </Tooltip>
  );
}

// --- Page --------------------------------------------------------------------

export interface SettingsPageProps {
  title: string;
  description?: React.ReactNode;
  /** Optional "Go to Help Center" link after the description. */
  helpHref?: string;
  /** Right side of the header: the page's primary action, or Cancel/Save on form pages. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/** Page header + sections, 880px wide and centered (Form and Collection templates). */
export function SettingsPage({title, description, helpHref, actions, children}: SettingsPageProps) {
  const style = React.useContext(SectionStyleContext);
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: CONTENT_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        // C: sections are separated by a divider instead of cards.
        ...(style === 'flat' ? {'& > section ~ section': {borderTop: hairline, pt: 3}} : {}),
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap'}}>
        <Box sx={{minWidth: 0, flex: '1 1 320px'}}>
          <Typography variant="h5" component="h1">
            {title}
          </Typography>
          {description || helpHref ? (
            <Typography variant="bodySmallRegular" color="textSecondary" component="p" sx={{mt: 0.5, maxWidth: 560}}>
              {description}
              {helpHref ? (
                <>
                  {description ? ' ' : null}
                  <Link href={helpHref} target="_blank" rel="noreferrer" underline="hover" sx={{display: 'inline-flex', alignItems: 'center', gap: 0.5, verticalAlign: 'bottom', fontWeight: 500}}>
                    Go to Help Center
                    <Icon src={externalLink} size={14} />
                  </Link>
                </>
              ) : null}
            </Typography>
          ) : null}
        </Box>
        {actions ? <Box sx={{display: 'flex', gap: 1, flexShrink: 0}}>{actions}</Box> : null}
      </Box>
      {children}
    </Box>
  );
}

// --- Section -----------------------------------------------------------------

export interface SettingsSectionProps {
  title?: string;
  description?: React.ReactNode;
  /** Right of the section title, e.g. a search field or a secondary action. */
  action?: React.ReactNode;
  /** Rows go in a bordered card with dividers (default). Off for tables and custom content. */
  card?: boolean;
  children: React.ReactNode;
}

export function SettingsSection({title, description, action, card = true, children}: SettingsSectionProps) {
  const style = React.useContext(SectionStyleContext);

  // A: the section is a grey band holding its name, with the rows on a white panel.
  if (style === 'banded' && card) {
    return (
      <Box component="section" aria-label={title} sx={{bgcolor: color.neutral['50'], borderRadius: `${radius['2xl']}px`, p: 0.5}}>
        {title || action ? (
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 1.5, py: 0.75, minHeight: 32}}>
            <Box>
              {title ? (
                <Typography variant="bodySmallRegular" color="textSecondary" component="h2">
                  {title}
                </Typography>
              ) : null}
              {description ? (
                <Typography variant="bodyXsmallRegular" color="textSecondary" component="p">
                  {description}
                </Typography>
              ) : null}
            </Box>
            {action}
          </Box>
        ) : null}
        <Box sx={{bgcolor: 'background.paper', borderRadius: `${radius.xl}px`, boxShadow: `0 0 0 1px ${color.neutral['100']}`, px: 1.5, py: 0.5}}>{children}</Box>
      </Box>
    );
  }

  return (
    <Box component="section" aria-label={title} sx={{display: 'flex', flexDirection: 'column', gap: style === 'flat' ? 0.5 : 1.5}}>
      {title || action ? (
        <Box sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, minHeight: 32}}>
          <Box>
            {title ? (
              <Typography variant="subheadingSubheading3" component="h2">
                {title}
              </Typography>
            ) : null}
            {description ? (
              <Typography variant="bodyXsmallRegular" color="textSecondary" component="p" sx={{mt: 0.25}}>
                {description}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Box>
      ) : null}
      {card && style === 'card' ? (
        // B: bordered card, one setting per row, separated by dividers.
        <Box sx={{border: hairline, borderRadius: `${radius['2xl']}px`, px: 2, '& > * + *': {borderTop: hairline}}}>{children}</Box>
      ) : card ? (
        // C: flat rows, no card or row dividers.
        <Box>{children}</Box>
      ) : (
        children
      )}
    </Box>
  );
}

// --- Row ---------------------------------------------------------------------

export interface SettingRowProps {
  label: React.ReactNode;
  /** Short explanation, shown as a "?" tooltip next to the label. */
  help?: string;
  /** Always-visible text under the label (use when the user needs it to decide). */
  description?: React.ReactNode;
  /** Right-aligned control: switch, select, input, button, segmented control. */
  control?: React.ReactNode;
  /** Full-width content under the row, e.g. the disclaimer text or a dependent setting. */
  children?: React.ReactNode;
  /** id for the label, so controls can use aria-labelledby. */
  labelId?: string;
}

/** One setting: label (+ help, description) on the left, its control on the right. */
export function SettingRow({label, help, description, control, children, labelId}: SettingRowProps) {
  return (
    <Box sx={{py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, minHeight: 32, flexWrap: {xs: 'wrap', sm: 'nowrap'}}}>
        <Box sx={{minWidth: 0, flex: 1}}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75}}>
            <Typography id={labelId} variant="bodySmallMedium" component="div" sx={{color: 'text.primary'}}>
              {label}
            </Typography>
            {help ? <HelpTip title={help} /> : null}
          </Box>
          {description ? (
            <Typography variant="bodyXsmallRegular" color="textSecondary" component="div" sx={{mt: 0.25}}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {control ? <Box sx={{flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1, maxWidth: '100%'}}>{control}</Box> : null}
      </Box>
      {children}
    </Box>
  );
}

// --- Table / empty state -----------------------------------------------------

export interface Column<T> {
  key: string;
  label: React.ReactNode;
  /** CSS grid track, e.g. '2fr' or '120px'. Default 1fr. */
  width?: string;
  align?: 'left' | 'right';
  render: (row: T) => React.ReactNode;
}

/** A bordered table card in the Companies/Company fields style; rows are 56px. */
export function DataTable<T>({label, columns, rows, rowKey, empty}: {
  label: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Shown inside the card when there are no rows. */
  empty?: React.ReactNode;
}) {
  const grid = columns.map(c => c.width ?? 'minmax(0, 1fr)').join(' ');
  const cell = (align?: 'left' | 'right') => ({minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', gap: 1});
  return (
    <Box role="table" aria-label={label} sx={{border: hairline, borderRadius: `${radius['2xl']}px`, overflowX: 'auto', ...hiddenScrollbarSx}}>
      <Box role="row" sx={{display: 'grid', gridTemplateColumns: grid, columnGap: 2, px: 2, py: 1, minWidth: 560, bgcolor: color.neutral['25'], borderBottom: hairline}}>
        {columns.map(c => (
          <Box role="columnheader" key={c.key} sx={{...cell(c.align), typography: 'bodyXsmallMedium', color: 'text.secondary'}}>
            {c.label}
          </Box>
        ))}
      </Box>
      {rows.length === 0 && empty ? (
        <Box role="row">
          <Box role="cell">{empty}</Box>
        </Box>
      ) : (
        rows.map((row, i) => (
          <Box
            role="row"
            key={rowKey(row)}
            sx={{display: 'grid', gridTemplateColumns: grid, columnGap: 2, alignItems: 'center', px: 2, minHeight: 56, minWidth: 560, borderTop: i ? hairline : 0, typography: 'bodySmallRegular'}}
          >
            {columns.map(c => (
              <Box role="cell" key={c.key} sx={cell(c.align)}>
                {c.render(row)}
              </Box>
            ))}
          </Box>
        ))
      )}
    </Box>
  );
}

export function EmptyState({icon, title, description, action}: {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Box sx={{py: 6, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1}}>
      <Box sx={{width: 48, height: 48, display: 'grid', placeItems: 'center', bgcolor: color.neutral['25'], borderRadius: `${radius.lg}px`, mb: 0.5}}>
        <Icon src={icon} />
      </Box>
      <Typography variant="bodySmallSemibold" component="p">
        {title}
      </Typography>
      {description ? (
        <Typography variant="bodyXsmallRegular" color="textSecondary" component="p" sx={{maxWidth: 360}}>
          {description}
        </Typography>
      ) : null}
      {action ? <Box sx={{mt: 1}}>{action}</Box> : null}
    </Box>
  );
}

// --- List–detail -------------------------------------------------------------

/** Two panes filling the page: a 280px list and the selected item's detail. */
export function ListDetail({list, detail}: {list: React.ReactNode; detail: React.ReactNode}) {
  return (
    <Box sx={{flex: 1, minHeight: 0, display: 'flex', flexDirection: {xs: 'column', md: 'row'}}}>
      <Box
        sx={{
          width: {xs: '100%', md: 280},
          flexShrink: 0,
          borderRight: {md: hairline},
          borderBottom: {xs: hairline, md: 0},
          overflowY: 'auto',
          maxHeight: {xs: 320, md: 'none'},
          ...hiddenScrollbarSx,
        }}
      >
        {list}
      </Box>
      <Box sx={{flex: 1, minWidth: 0, overflowY: 'auto', ...hiddenScrollbarSx}}>
        <Box sx={{maxWidth: CONTENT_WIDTH, px: {xs: 2, md: 4}, py: 3}}>{detail}</Box>
      </Box>
    </Box>
  );
}

export function ListPane({title, description, actions, children}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{p: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
      <Box>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32}}>
          <Typography variant="subheadingSubheading2" component="h1">
            {title}
          </Typography>
          {actions ? <Box sx={{display: 'flex', gap: 0.5}}>{actions}</Box> : null}
        </Box>
        {description ? (
          <Typography variant="bodySmallRegular" color="textSecondary" component="p" sx={{mt: 0.5}}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Box>
  );
}

/** A labelled group of list items (not collapsible, like the side menu). */
export function ListGroup({label, children}: {label?: string; children: React.ReactNode}) {
  return (
    <Box role="group" aria-label={label} sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
      {label ? (
        <Typography variant="bodyXsmallRegular" color="textSecondary" component="div" sx={{height: 24, display: 'flex', alignItems: 'center', px: 1}}>
          {label}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}

export function ListItem({icon, title, subtitle, selected, muted, trailing, onClick}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  /** Greyed out: disabled skill, integration that isn't connected. */
  muted?: boolean;
  trailing?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-current={selected ? 'true' : undefined}
      sx={{
        width: '100%',
        justifyContent: 'flex-start',
        gap: 1,
        px: 1,
        py: subtitle ? 1 : '9px',
        textAlign: 'left',
        borderRadius: `${radius.lg}px`,
        bgcolor: selected ? 'action.selected' : 'transparent',
        '&:hover': {bgcolor: selected ? 'action.selected' : 'action.hover'},
      }}
    >
      {icon ? <Box sx={{opacity: muted ? 0.5 : 1, display: 'flex'}}>{icon}</Box> : null}
      <Box sx={{minWidth: 0, flex: 1}}>
        <Typography variant="bodySmallMedium" noWrap component="div" sx={{color: muted ? 'text.disabled' : 'text.primary'}}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="bodyXxsmallRegular" color="textSecondary" noWrap component="div">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {trailing}
    </ButtonBase>
  );
}

/** Detail pane header: title (+ leading visual) and actions on the right. */
export function DetailHeader({leading, title, actions, children}: {
  leading?: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mb: 3}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, minHeight: 40}}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0}}>
          {leading}
          <Typography variant="h6" component="h2" noWrap>
            {title}
          </Typography>
        </Box>
        {actions ? <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0}}>{actions}</Box> : null}
      </Box>
      {children}
    </Box>
  );
}
