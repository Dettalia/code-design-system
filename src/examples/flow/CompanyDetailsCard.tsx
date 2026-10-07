import React, {useId, useState} from 'react';
import {Box, Button, ButtonBase, IconButton, Link, Popover, Tooltip, Typography, tokens} from '../../index';
import type {Company} from '../CompaniesPage';
import chevronDown from '../company-assets/chevron-down-16.svg';
import plusIcon from '../companies-assets/plus.svg';
import eyeIcon from '../fields-assets/eye-16.svg';
import eyeOffIcon from '../fields-assets/eye-off-16.svg';
import gripIcon from '../fields-assets/grip-vertical-16.svg';
import pencilIcon from '../fields-assets/pencil-16.svg';
import {useDragReorder} from './CompanyFieldsPage';
import {EditableSelect, EditableText} from './EditableDetail';
import {FieldDialog} from './FieldDialog';
import {
  WORKSPACE_PEOPLE,
  fieldIcon,
  fieldValue,
  newFieldId,
  type CompanyField,
  type FieldValue,
} from './companyFields';

// The company page's details card (Figma 8117:120063), rendering the fields
// the organization set up, plus the "Edit fields" shortcut and "Show all
// fields". Not in Figma beyond the four built-in fields.

const {color, radius, shadow} = tokens;
const hairline = `1px solid ${color.neutral['100']}`;

/** Fields shown before "Show all fields": three rows of two, as in Figma's card. */
const COLLAPSED_COUNT = 6;

const Icon = ({src}: {src: string}) => (
  <Box component="img" src={src} alt="" sx={{display: 'block', flexShrink: 0}} />
);

function FieldEditor({
  field,
  value,
  onSave,
}: {
  field: CompanyField;
  value: FieldValue;
  onSave: (value: FieldValue) => void;
}) {
  // "Account owner" -> "account owner", but acronyms stay ("ICP fit" -> "ICP fit").
  const noun = field.label
    .split(' ')
    .map(word => (/[A-Z]{2}/.test(word) ? word : word.toLowerCase()))
    .join(' ');
  if (field.type === 'select' || field.type === 'person') {
    return (
      <EditableSelect
        label={field.label}
        value={value as string}
        options={field.type === 'person' ? WORKSPACE_PEOPLE : (field.options ?? [])}
        // Location keeps Figma's placeholder.
        placeholder={field.builtIn === 'location' ? 'Select country' : `Select ${noun}`}
        onSave={onSave}
      />
    );
  }
  if (field.type === 'multiselect') {
    return (
      <EditableSelect
        multiple
        label={field.label}
        value={value as string[]}
        options={field.options ?? []}
        placeholder={`Select ${noun}`}
        onSave={onSave}
      />
    );
  }
  return (
    <EditableText
      label={field.label}
      type={field.type}
      value={value as string}
      placeholder={field.builtIn === 'employees' ? 'Add employee count' : `Add ${noun}`}
      onSave={next => onSave(field.type === 'url' ? next.replace(/^https?:\/\//, '') : next)}
    />
  );
}

function FieldCells({
  fields,
  company,
  custom,
  onEditValue,
}: {
  fields: CompanyField[];
  company: Company;
  custom: Record<string, FieldValue>;
  onEditValue: (field: CompanyField, value: FieldValue) => void;
}) {
  // Figma: icon + label column (96px, wider for longer labels), 16px gap, then the value field.
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(96px, max-content) minmax(0, 1fr)',
        columnGap: 2,
        rowGap: 2,
        alignItems: 'center',
        alignContent: 'start',
        minWidth: 0,
      }}
    >
      {fields.map(field => (
        <React.Fragment key={field.id}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1, height: 32, maxWidth: 160, minWidth: 0}}>
            <Icon src={fieldIcon(field)} />
            <Typography variant="bodySmallMedium" color="textSecondary" noWrap title={field.label}>
              {field.label}
            </Typography>
          </Box>
          <FieldEditor
            field={field}
            value={fieldValue(field, company, custom)}
            onSave={value => onEditValue(field, value)}
          />
        </React.Fragment>
      ))}
    </Box>
  );
}

export interface CompanyDetailsCardProps {
  company: Company;
  fields: CompanyField[];
  /** This company's values for custom fields. */
  custom: Record<string, FieldValue>;
  onEditValue: (field: CompanyField, value: FieldValue) => void;
  onFieldsChange: (fields: CompanyField[]) => void;
  onOpenFieldSettings: () => void;
}

export function CompanyDetailsCard({
  company,
  fields,
  custom,
  onEditValue,
  onFieldsChange,
  onOpenFieldSettings,
}: CompanyDetailsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = fields.filter(f => !f.hidden);
  const shown = expanded ? visible : visible.slice(0, COLLAPSED_COUNT);
  // Fill the left column first, as Figma does (Location, Website | Employees, ICP fit).
  const half = Math.ceil(shown.length / 2);
  const cellProps = {company, custom, onEditValue};

  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2}}>
        <Typography variant="bodyNormalSemibold" component="h2">
          Overview
        </Typography>
        <EditFieldsButton fields={fields} onFieldsChange={onFieldsChange} onOpenFieldSettings={onOpenFieldSettings} />
      </Box>

      <Box
        component="section"
        aria-label="Company details"
        sx={{border: hairline, borderRadius: `${radius['2xl']}px`, p: 2}}
      >
        {visible.length === 0 ? (
          <Typography variant="bodySmallRegular" color="textSecondary">
            No company details are shown. Use Edit fields to choose some.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'},
              columnGap: 4,
              rowGap: 2,
            }}
          >
            <FieldCells fields={shown.slice(0, half)} {...cellProps} />
            <FieldCells fields={shown.slice(half)} {...cellProps} />
          </Box>
        )}
        {visible.length > COLLAPSED_COUNT ? (
          <ButtonBase
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
            sx={{
              mt: 2,
              gap: 0.5,
              px: 1,
              ml: -1,
              height: 28,
              borderRadius: `${radius.lg}px`,
              typography: 'bodySmallMedium',
              color: 'text.secondary',
              '&:hover': {bgcolor: 'action.hover'},
            }}
          >
            {expanded ? 'Show fewer' : `Show all fields (${visible.length})`}
            <Box sx={{transform: expanded ? 'rotate(180deg)' : 'none', display: 'flex'}}>
              <Icon src={chevronDown} />
            </Box>
          </ButtonBase>
        ) : null}
      </Box>
    </>
  );
}

/** "Edit fields": show, hide and reorder fields, or add one, without leaving the page. */
function EditFieldsButton({
  fields,
  onFieldsChange,
  onOpenFieldSettings,
}: Pick<CompanyDetailsCardProps, 'fields' | 'onFieldsChange' | 'onOpenFieldSettings'>) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [adding, setAdding] = useState(false);
  const titleId = useId();
  const {itemProps, dragSx} = useDragReorder(fields, onFieldsChange);

  return (
    <>
      <Button
        variant="text"
        size="small"
        startIcon={<Icon src={pencilIcon} />}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
        onClick={event => setAnchor(event.currentTarget)}
      >
        Edit fields
      </Button>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-labelledby': titleId,
            sx: {mt: 0.5, width: 320, p: 1, borderRadius: `${radius['2xl']}px`, boxShadow: shadow.modal},
          },
        }}
      >
        <Box sx={{px: 1, pt: 0.5, pb: 1}}>
          <Typography id={titleId} variant="bodySmallSemibold" component="h2">
            Company details fields
          </Typography>
          <Typography variant="bodyXsmallRegular" color="textSecondary">
            Applies to every company in your organization.
          </Typography>
        </Box>
        <Box component="ul" aria-label="Fields" sx={{listStyle: 'none', m: 0, p: 0, maxHeight: 320, overflowY: 'auto'}}>
          {fields.map((field, i) => (
            <Box
              component="li"
              key={field.id}
              {...itemProps(i)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                height: 40,
                px: 1,
                borderRadius: `${radius.lg}px`,
                '&:hover': {bgcolor: 'action.hover'},
                '&:hover .grip': {opacity: 1},
                ...dragSx(i),
              }}
            >
              <Box className="grip" aria-hidden sx={{cursor: 'grab', opacity: 0.4}}>
                <Icon src={gripIcon} />
              </Box>
              <Box sx={{opacity: field.hidden ? 0.5 : 1}}>
                <Icon src={fieldIcon(field)} />
              </Box>
              <Typography
                variant="bodySmallMedium"
                noWrap
                sx={{flex: 1, color: field.hidden ? 'text.disabled' : 'text.primary'}}
              >
                {field.label}
              </Typography>
              <Tooltip title={field.hidden ? 'Show' : 'Hide'}>
                <IconButton
                  aria-label={`${field.hidden ? 'Show' : 'Hide'} ${field.label}`}
                  aria-pressed={!field.hidden}
                  onClick={() => onFieldsChange(fields.map(f => (f.id === field.id ? {...f, hidden: !f.hidden} : f)))}
                  sx={{width: 28, height: 28, borderRadius: `${radius.lg}px`}}
                >
                  <Icon src={field.hidden ? eyeOffIcon : eyeIcon} />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: hairline, mt: 1, pt: 1, px: 0.5}}>
          <Button variant="text" size="small" startIcon={<Icon src={plusIcon} />} onClick={() => setAdding(true)}>
            Add field
          </Button>
          <Link
            component="button"
            type="button"
            underline="hover"
            color="textSecondary"
            onClick={() => {
              setAnchor(null);
              onOpenFieldSettings();
            }}
            sx={{typography: 'bodySmallMedium', mr: 1}}
          >
            All field settings
          </Link>
        </Box>
      </Popover>
      <FieldDialog
        open={adding}
        takenLabels={fields.map(f => f.label)}
        onClose={() => setAdding(false)}
        onSave={field => {
          onFieldsChange([...fields, {id: newFieldId(field.label, fields), ...field}]);
          setAdding(false);
        }}
      />
    </>
  );
}
