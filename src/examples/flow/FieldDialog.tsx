import React, {useId, useRef, useState} from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  OutlinedInput,
  Typography,
  tokens,
} from '../../index';
import {ModalField, ModalHeader} from '../ModalParts';
import plusIcon from '../companies-assets/plus.svg';
import xIcon from '../fields-assets/x-16.svg';
import {FIELD_TYPES, isChoice, type CompanyField, type FieldType} from './companyFields';

// Add or edit a company field. Not in Figma: uses the Figma Modal
// (ModalHeader, ModalField, 560px) and the design system's inputs.

const {color, radius} = tokens;

const Icon = ({src}: {src: string}) => (
  <Box component="img" src={src} alt="" sx={{display: 'block', flexShrink: 0}} />
);

export interface FieldDialogProps {
  open: boolean;
  /** The field being edited; omit to add a new one. */
  field?: CompanyField;
  /** Other fields' labels, to keep names unique. */
  takenLabels: string[];
  onClose: () => void;
  onSave: (field: Pick<CompanyField, 'label' | 'type' | 'options'>) => void;
}

export function FieldDialog(props: FieldDialogProps) {
  // Remount per open, so the form starts from the field each time.
  return props.open ? <FieldForm {...props} /> : null;
}

function FieldForm({field, takenLabels, onClose, onSave}: FieldDialogProps) {
  const titleId = useId();
  const optionsLabelId = useId();
  const [label, setLabel] = useState(field?.label ?? '');
  const [type, setType] = useState<FieldType>(field?.type ?? 'text');
  const [options, setOptions] = useState<string[]>(field?.options?.length ? field.options : ['']);
  const [submitted, setSubmitted] = useState(false);
  const optionRefs = useRef<(HTMLInputElement | null)[]>([]);

  const name = label.trim();
  const cleanOptions = [...new Set(options.map(o => o.trim()).filter(Boolean))];
  const nameError = !name
    ? 'Give the field a name.'
    : takenLabels.some(l => l.toLowerCase() === name.toLowerCase())
      ? 'Another field already has this name.'
      : null;
  const optionsError = isChoice(type) && cleanOptions.length === 0 ? 'Add at least one option.' : null;

  const addOption = (after = options.length - 1) => {
    setOptions(o => [...o.slice(0, after + 1), '', ...o.slice(after + 1)]);
    requestAnimationFrame(() => optionRefs.current[after + 1]?.focus());
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby={titleId} slotProps={{paper: {sx: {width: 560}}}}>
      <Box
        component="form"
        noValidate
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          setSubmitted(true);
          if (nameError || optionsError) return;
          onSave({label: name, type, options: isChoice(type) ? cleanOptions : undefined});
        }}
      >
        <ModalHeader id={titleId} title={field ? `Edit “${field.label}”` : 'Add company field'} onClose={onClose} />
        <DialogContent>
          <Box>
            <ModalField
              label="Field name"
              placeholder="e.g. Industry"
              value={label}
              autoFocus
              onChange={event => setLabel(event.target.value)}
              error={submitted && Boolean(nameError)}
              inputProps={{'aria-describedby': nameError && submitted ? `${titleId}-name-error` : undefined}}
            />
            {submitted && nameError ? (
              <Typography id={`${titleId}-name-error`} variant="bodyXsmallMedium" color="error" sx={{mt: 0.5}}>
                {nameError}
              </Typography>
            ) : null}
          </Box>

          {/* Type: fixed for built-in fields (their values feed other parts of Bliro). */}
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
            <Typography id={`${titleId}-type`} variant="bodySmallSemibold" sx={{color: color.neutral['900']}}>
              Type
            </Typography>
            {field?.builtIn ? (
              <Typography variant="bodySmallRegular" color="textSecondary">
                {FIELD_TYPES.find(t => t.type === type)!.label} · Built-in fields keep their type.
              </Typography>
            ) : (
              <Box
                role="radiogroup"
                aria-labelledby={`${titleId}-type`}
                sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'}, gap: 1}}
              >
                {FIELD_TYPES.map(t => {
                  const checked = t.type === type;
                  return (
                    <ButtonBase
                      key={t.type}
                      role="radio"
                      aria-checked={checked}
                      onClick={() => setType(t.type)}
                      sx={{
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 1,
                        p: 1.5,
                        textAlign: 'left',
                        border: `1px solid ${checked ? color.button.primary.main : color.neutral['100']}`,
                        borderRadius: `${radius.lg}px`,
                        bgcolor: checked ? 'action.selected' : 'background.paper',
                        '&:hover': {bgcolor: checked ? 'action.selected' : 'action.hover'},
                      }}
                    >
                      <Box sx={{mt: '3px'}}>
                        <Icon src={t.icon} />
                      </Box>
                      <Box>
                        <Typography variant="bodySmallMedium" component="div">
                          {t.label}
                        </Typography>
                        <Typography variant="bodyXsmallRegular" color="textSecondary" component="div">
                          {t.hint}
                        </Typography>
                      </Box>
                    </ButtonBase>
                  );
                })}
              </Box>
            )}
          </Box>

          {isChoice(type) ? (
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
              <Typography id={optionsLabelId} variant="bodySmallSemibold" sx={{color: color.neutral['900']}}>
                Options
              </Typography>
              <Box role="group" aria-labelledby={optionsLabelId} sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                {options.map((option, i) => (
                  <Box key={i} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <OutlinedInput
                      inputRef={el => {
                        optionRefs.current[i] = el;
                      }}
                      value={option}
                      placeholder={`Option ${i + 1}`}
                      onChange={event => setOptions(o => o.map((v, j) => (j === i ? event.target.value : v)))}
                      onKeyDown={event => {
                        // Enter adds the next option instead of submitting.
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addOption(i);
                        }
                      }}
                      inputProps={{'aria-label': `Option ${i + 1}`}}
                      sx={theme => ({
                        flex: 1,
                        height: 40,
                        px: 2,
                        '& .MuiOutlinedInput-input': {...theme.typography.bodySmallRegular, p: 0},
                      })}
                    />
                    <IconButton
                      aria-label={`Remove option ${option || i + 1}`}
                      disabled={options.length === 1}
                      onClick={() => setOptions(o => o.filter((_, j) => j !== i))}
                      sx={{width: 32, height: 32, borderRadius: `${radius.lg}px`}}
                    >
                      <Icon src={xIcon} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Box>
                <Button variant="text" size="small" startIcon={<Icon src={plusIcon} />} onClick={() => addOption()}>
                  Add option
                </Button>
              </Box>
              {submitted && optionsError ? (
                <Typography variant="bodyXsmallMedium" color="error">
                  {optionsError}
                </Typography>
              ) : null}
            </Box>
          ) : null}

          <Typography variant="bodyXsmallRegular" color="textSecondary">
            Fields apply to every company in your organization.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            {field ? 'Save' : 'Add field'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
