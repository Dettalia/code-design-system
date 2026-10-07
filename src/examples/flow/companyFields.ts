import type {Company} from '../CompaniesPage';
import globeIcon from '../company-assets/globe.svg';
import mapPinIcon from '../company-assets/map-pin.svg';
import tagIcon from '../company-assets/tag.svg';
import usersIcon from '../company-assets/users.svg';
import calendarIcon from '../fields-assets/calendar-16.svg';
import circleDotIcon from '../fields-assets/circle-dot-16.svg';
import hashIcon from '../fields-assets/hash-16.svg';
import linkIcon from '../fields-assets/link-16.svg';
import listChecksIcon from '../fields-assets/list-checks-16.svg';
import textIcon from '../fields-assets/text-16.svg';
import userIcon from '../fields-assets/user-16.svg';

// Company fields an organization sets up (Settings › Organization › Company
// fields). Not in Figma: a prototype of the "customizable company data"
// proposal. The four Figma fields are built in: they can be renamed, hidden,
// reordered and get their own choice lists, but not deleted or retyped.

export type FieldType = 'text' | 'number' | 'url' | 'date' | 'select' | 'multiselect' | 'person';

export const FIELD_TYPES: {type: FieldType; label: string; icon: string; hint: string}[] = [
  {type: 'text', label: 'Text', icon: textIcon, hint: 'Short free text'},
  {type: 'number', label: 'Number', icon: hashIcon, hint: 'Counts, amounts, scores'},
  {type: 'url', label: 'Link', icon: linkIcon, hint: 'A web address'},
  {type: 'date', label: 'Date', icon: calendarIcon, hint: 'Renewals, deadlines'},
  {type: 'select', label: 'Single choice', icon: circleDotIcon, hint: 'One option from a list'},
  {type: 'multiselect', label: 'Multiple choice', icon: listChecksIcon, hint: 'Any options from a list'},
  {type: 'person', label: 'Person', icon: userIcon, hint: 'Someone in your workspace'},
];

export const fieldTypeInfo = (type: FieldType) => FIELD_TYPES.find(t => t.type === type)!;

export const isChoice = (type: FieldType) => type === 'select' || type === 'multiselect';

/** Built-in fields map onto Company properties; custom ones are stored per company. */
export type BuiltInKey = 'location' | 'website' | 'employees' | 'icpFit';

export interface CompanyField {
  id: string;
  label: string;
  type: FieldType;
  /** Choice fields only. */
  options?: string[];
  hidden?: boolean;
  builtIn?: BuiltInKey;
  /** Built-in fields keep their Figma icon; custom ones use their type's icon. */
  icon?: string;
}

export const fieldIcon = (field: CompanyField) => field.icon ?? fieldTypeInfo(field.type).icon;

/** People in the workspace, for Person fields. */
export const WORKSPACE_PEOPLE = ['Peter Hoffmann', 'Anna Weber', 'Luca Rossi', 'Mara Ionescu'];

export const DEFAULT_FIELDS: CompanyField[] = [
  {
    id: 'location',
    builtIn: 'location',
    label: 'Location',
    type: 'select',
    icon: mapPinIcon,
    // From the Figma dropdown (8117:120716), plus the countries in the example data.
    options: [
      'Austria',
      'England',
      'Germany',
      'Hungary',
      'Netherlands',
      'Romania',
      'Spain',
      'Switzerland',
      'United Kingdom',
      'United States',
    ],
  },
  {id: 'website', builtIn: 'website', label: 'Website', type: 'url', icon: globeIcon},
  {id: 'employees', builtIn: 'employees', label: 'Employees', type: 'text', icon: usersIcon},
  {
    id: 'icpFit',
    builtIn: 'icpFit',
    label: 'ICP fit',
    type: 'select',
    icon: tagIcon,
    // Figma dropdown 8117:120756.
    options: ['OK ICP', 'Core ICP', 'No ICP'],
  },
  // Examples of fields an organization might add.
  {
    id: 'industry',
    label: 'Industry',
    type: 'select',
    options: ['SaaS', 'Fintech', 'Healthcare', 'Manufacturing', 'Retail', 'Consulting'],
  },
  {id: 'owner', label: 'Account owner', type: 'person'},
  {id: 'renewal', label: 'Renewal date', type: 'date'},
];

export type FieldValue = string | string[];

/** Example values for the example custom fields. */
export const CUSTOM_VALUES: Record<string, Record<string, FieldValue>> = {
  strategio: {industry: 'Consulting', owner: 'Peter Hoffmann', renewal: '2027-03-31'},
  acme: {industry: 'Manufacturing', owner: 'Anna Weber', renewal: '2026-12-15'},
  durran: {industry: 'SaaS', owner: 'Peter Hoffmann'},
  northstar: {industry: 'SaaS', owner: 'Luca Rossi', renewal: '2027-06-01'},
  atlas: {industry: 'Healthcare', owner: 'Mara Ionescu'},
  meridian: {industry: 'Fintech', owner: 'Anna Weber', renewal: '2027-01-20'},
};

/** A company's value for a field: built-ins read the Company, custom fields the stored values. */
export function fieldValue(
  field: CompanyField,
  company: Company,
  custom: Record<string, FieldValue> = {},
): FieldValue {
  if (field.builtIn) return company[field.builtIn];
  return custom[field.id] ?? (field.type === 'multiselect' ? [] : '');
}

/** URL-safe, unique id for a new field. */
export function newFieldId(label: string, fields: CompanyField[]) {
  const base = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'field';
  let id = base;
  for (let i = 2; fields.some(f => f.id === id); i++) id = `${base}-${i}`;
  return id;
}
