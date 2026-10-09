import React, {useId, useState} from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  tokens,
} from '../../index';
import {AlertTriangleIcon, ModalHeader} from '../ModalParts';
import plusIcon from '../companies-assets/plus.svg';
import arrowDownIcon from '../fields-assets/arrow-down-16.svg';
import arrowUpIcon from '../fields-assets/arrow-up-16.svg';
import ellipsisIcon from '../fields-assets/ellipsis-20.svg';
import eyeIcon from '../fields-assets/eye-16.svg';
import eyeOffIcon from '../fields-assets/eye-off-16.svg';
import gripIcon from '../fields-assets/grip-vertical-20.svg';
import pencilIcon from '../fields-assets/pencil-16.svg';
import trashIcon from '../fields-assets/trash-16.svg';
import {FieldDialog} from './FieldDialog';
import {MaskIcon} from './FlowShell';
import {SettingsPage} from './settings/SettingsLayout';
import {
  fieldIcon,
  fieldTypeInfo,
  isChoice,
  newFieldId,
  type CompanyField,
} from './companyFields';

// Settings › Organization › Company fields. Not in Figma: the admin page of
// the "customizable company data" proposal, styled like My Account.

const {color, radius} = tokens;
const hairline = `1px solid ${color.neutral['100']}`;

const Icon = ({src}: {src: string}) => (
  <Box component="img" src={src} alt="" sx={{display: 'block', flexShrink: 0}} />
);

/** Moves the item at `from` to `to`. */
export const move = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/**
 * Native drag-and-drop reordering for a list. `itemProps(i)` goes on each
 * item; `dragSx(i)` dims the dragged item and marks where it will land.
 */
export function useDragReorder<T>(list: T[], onChange: (list: T[]) => void) {
  const [drag, setDrag] = useState<{from: number; over: number} | null>(null);
  const itemProps = (i: number) => ({
    draggable: true,
    onDragStart: (event: React.DragEvent) => {
      event.dataTransfer.effectAllowed = 'move';
      setDrag({from: i, over: i});
    },
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      if (drag && drag.over !== i) setDrag({...drag, over: i});
    },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      if (drag && drag.from !== i) onChange(move(list, drag.from, i));
      setDrag(null);
    },
    onDragEnd: () => setDrag(null),
  });
  const dragSx = (i: number) => ({
    opacity: drag?.from === i ? 0.5 : 1,
    boxShadow:
      drag && drag.over === i && drag.from !== i
        ? `inset 0 ${drag.from < i ? -2 : 2}px 0 ${color.button.primary.main}`
        : 'none',
  });
  return {itemProps, dragSx};
}

export const fieldSummary = (field: CompanyField) =>
  isChoice(field.type)
    ? `${fieldTypeInfo(field.type).label} · ${field.options?.length ?? 0} options`
    : fieldTypeInfo(field.type).label;

export interface CompanyFieldsPageProps {
  fields: CompanyField[];
  onChange: (fields: CompanyField[]) => void;
}

export function CompanyFieldsPage({fields, onChange}: CompanyFieldsPageProps) {
  const [editing, setEditing] = useState<CompanyField | 'new' | null>(null);
  const [deleting, setDeleting] = useState<CompanyField | null>(null);
  const [menu, setMenu] = useState<{anchor: HTMLElement; field: CompanyField} | null>(null);
  const {itemProps, dragSx} = useDragReorder(fields, onChange);
  const deleteTitleId = useId();

  const update = (id: string, changes: Partial<CompanyField>) =>
    onChange(fields.map(f => (f.id === id ? {...f, ...changes} : f)));
  const shown = fields.filter(f => !f.hidden).length;

  return (
    <SettingsPage
      title="Company fields"
      description="Choose what your team sees and edits about every company. Changes apply to all companies in your organization."
      actions={
        <Button
          variant="contained"
          startIcon={<MaskIcon src={plusIcon} color="primary.contrastText" />}
          onClick={() => setEditing('new')}
        >
          Add field
        </Button>
      }
    >
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 1}}>
        <Typography variant="bodySmallMedium" color="textSecondary" component="h2">
          {fields.length} fields · {shown} shown on company pages
        </Typography>
        <Box
          component="ul"
          aria-label="Company fields"
          sx={{listStyle: 'none', m: 0, p: 0, border: hairline, borderRadius: `${radius['2xl']}px`, overflow: 'hidden'}}
        >
          {fields.map((field, i) => (
            <Box
              component="li"
              key={field.id}
              aria-label={field.label}
              {...itemProps(i)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                minHeight: 56,
                pl: 1,
                pr: 1.5,
                py: 1,
                borderTop: i ? hairline : 0,
                bgcolor: 'background.paper',
                ...dragSx(i),
                '&:hover .grip': {opacity: 1},
              }}
            >
              <Box className="grip" aria-hidden sx={{cursor: 'grab', opacity: 0.5, display: {xs: 'none', sm: 'block'}}}>
                <Icon src={gripIcon} />
              </Box>
              <Box sx={{opacity: field.hidden ? 0.5 : 1}}>
                <Icon src={fieldIcon(field)} />
              </Box>
              <Box sx={{flex: 1, minWidth: 0}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                  <Typography
                    variant="bodySmallMedium"
                    component="span"
                    sx={{color: field.hidden ? 'text.disabled' : 'text.primary'}}
                  >
                    {field.label}
                  </Typography>
                  {field.builtIn ? <SmallChip label="Built-in" /> : null}
                  {field.hidden ? <SmallChip label="Hidden" /> : null}
                </Box>
                <Typography variant="bodyXsmallRegular" color="textSecondary" component="div">
                  {fieldSummary(field)}
                </Typography>
              </Box>
              <Tooltip title={field.hidden ? 'Show on company pages' : 'Hide from company pages'}>
                <IconButton
                  aria-label={`${field.hidden ? 'Show' : 'Hide'} ${field.label}`}
                  aria-pressed={!field.hidden}
                  onClick={() => update(field.id, {hidden: !field.hidden})}
                  sx={{width: 32, height: 32, borderRadius: `${radius.lg}px`}}
                >
                  <Icon src={field.hidden ? eyeOffIcon : eyeIcon} />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-label={`More actions for ${field.label}`}
                aria-haspopup="menu"
                onClick={event => setMenu({anchor: event.currentTarget, field})}
                sx={{width: 32, height: 32, borderRadius: `${radius.lg}px`}}
              >
                <Icon src={ellipsisIcon} />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Typography variant="bodyXsmallRegular" color="textSecondary">
          Drag fields to change their order on the company page.
        </Typography>
      </Box>

      <Menu
        anchorEl={menu?.anchor}
        open={menu !== null}
        onClose={() => setMenu(null)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        slotProps={{paper: {sx: {borderRadius: `${radius['2xl']}px`, p: 1, minWidth: 200}}, list: {sx: {p: 0}}}}
      >
        {menu
          ? (() => {
              const index = fields.findIndex(f => f.id === menu.field.id);
              const act = (fn: () => void) => () => {
                setMenu(null);
                fn();
              };
              const itemSx = {borderRadius: `${radius.lg}px`, typography: 'bodySmallMedium', minHeight: 40, gap: 1};
              return [
                <MenuItem key="edit" onClick={act(() => setEditing(menu.field))} sx={itemSx}>
                  <ListItemIcon sx={{minWidth: 0}}>
                    <Icon src={pencilIcon} />
                  </ListItemIcon>
                  Edit
                </MenuItem>,
                <MenuItem key="up" disabled={index === 0} onClick={act(() => onChange(move(fields, index, index - 1)))} sx={itemSx}>
                  <ListItemIcon sx={{minWidth: 0}}>
                    <Icon src={arrowUpIcon} />
                  </ListItemIcon>
                  Move up
                </MenuItem>,
                <MenuItem
                  key="down"
                  disabled={index === fields.length - 1}
                  onClick={act(() => onChange(move(fields, index, index + 1)))}
                  sx={itemSx}
                >
                  <ListItemIcon sx={{minWidth: 0}}>
                    <Icon src={arrowDownIcon} />
                  </ListItemIcon>
                  Move down
                </MenuItem>,
                menu.field.builtIn ? null : (
                  <MenuItem
                    key="delete"
                    onClick={act(() => setDeleting(menu.field))}
                    sx={{...itemSx, color: 'error.main'}}
                  >
                    <ListItemIcon sx={{minWidth: 0}}>
                      <MaskIcon src={trashIcon} color="error.main" size={16} />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                ),
              ];
            })()
          : null}
      </Menu>

      <FieldDialog
        open={editing !== null}
        field={editing === 'new' ? undefined : (editing ?? undefined)}
        takenLabels={fields.filter(f => editing === 'new' || f.id !== editing?.id).map(f => f.label)}
        onClose={() => setEditing(null)}
        onSave={changes => {
          if (editing === 'new') onChange([...fields, {id: newFieldId(changes.label, fields), ...changes}]);
          else if (editing) update(editing.id, changes);
          setEditing(null);
        }}
      />

      <Dialog open={deleting !== null} onClose={() => setDeleting(null)} aria-labelledby={deleteTitleId}>
        <ModalHeader
          id={deleteTitleId}
          title={`Delete “${deleting?.label}”?`}
          onClose={() => setDeleting(null)}
          icon={<AlertTriangleIcon color="error" />}
        />
        <DialogContent>
          <DialogContentText>
            The field and its values will be removed from every company. This can’t be undone. To keep the
            values, hide the field instead.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onChange(fields.filter(f => f.id !== deleting!.id));
              setDeleting(null);
            }}
          >
            Delete field
          </Button>
        </DialogActions>
      </Dialog>
    </SettingsPage>
  );
}

function SmallChip({label}: {label: string}) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 20,
        borderRadius: `${radius.sm}px`,
        bgcolor: color.neutral['50'],
        color: 'text.secondary',
        '& .MuiChip-label': {px: 0.75, typography: 'bodyXxsmallRegular', fontWeight: 500},
      }}
    />
  );
}
