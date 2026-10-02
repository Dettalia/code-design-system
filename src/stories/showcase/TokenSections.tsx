import React from 'react';
import {createTheme, type Theme} from '@mui/material/styles';
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  type TypographyProps,
} from '../../index';
import * as mapping from '../../../style-dictionary/mui-mapping.mjs';
import {groupTokens, isPrimitive, shortName, tokenByPath, type ExportedToken} from './tokens';
import {Section, TokenPath} from './ui';

const muiDefault = createTheme();

function get(object: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], object);
}

function Swatch({color, size = 32}: {color: string; size?: number}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 1,
        bgcolor: color,
        border: 1,
        borderColor: 'divider',
        // Checkerboard behind translucent colors.
        backgroundImage: `linear-gradient(${color}, ${color}), repeating-conic-gradient(#ddd 0 25%, #fff 0 50%)`,
        backgroundSize: '100% 100%, 8px 8px',
      }}
    />
  );
}

function AliasChain({token}: {token: ExportedToken}) {
  if (isPrimitive(token))
    return (
      <Typography variant="bodyXsmallRegular" color="textSecondary">
        primitive
      </Typography>
    );
  return (
    <Stack direction="row" spacing={0.5} sx={{alignItems: 'center', flexWrap: 'wrap'}}>
      {token.aliases.map(alias => (
        <React.Fragment key={alias}>
          <Typography variant="bodyXsmallRegular" color="textSecondary">
            →
          </Typography>
          <TokenPath path={alias} />
        </React.Fragment>
      ))}
    </Stack>
  );
}

// --- Colors -------------------------------------------------------------------

export function ColorSection() {
  const groups = groupTokens('color');
  const ramps = [...groups].filter(([, tokens]) => tokens.every(isPrimitive));
  const roles = [...groups].filter(([, tokens]) => !tokens.every(isPrimitive));

  return (
    <Section
      id="colors"
      title="Colors"
      description="Primitive ramps from the Figma Primitives collection, and semantic roles from the Semantic collection with the primitive each one aliases."
    >
      <Typography variant="subheadingSubheading3" sx={{mb: 1.5}}>
        Primitive ramps
      </Typography>
      <Stack spacing={2} sx={{mb: 4}}>
        {ramps.map(([group, tokens]) => (
          <Box key={group}>
            <Typography variant="bodySmallSemibold" sx={{mb: 0.5}}>
              {group}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
                gap: 1,
              }}
            >
              {tokens.map(token => (
                <Tooltip key={token.path} title={token.path}>
                  <Box>
                    <Box
                      sx={{
                        height: 48,
                        borderRadius: 1,
                        bgcolor: token.resolved as string,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    />
                    <Typography variant="bodyXsmallMedium" sx={{display: 'block', mt: 0.5}}>
                      {shortName(token.path, `color.${group}`)}
                    </Typography>
                    <Typography variant="bodyXxsmallRegular" color="textSecondary">
                      {String(token.resolved)}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        ))}
      </Stack>

      <Typography variant="subheadingSubheading3" sx={{mb: 1.5}}>
        Semantic roles
      </Typography>
      <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', lg: '1fr 1fr'}, gap: 2}}>
        {roles.map(([group, tokens]) => (
          <Paper key={group} variant="outlined" sx={{p: 2}}>
            <Typography variant="bodySmallSemibold" sx={{mb: 1}}>
              {group}
            </Typography>
            <Stack spacing={1.25}>
              {tokens.map(token => (
                <Stack key={token.path} direction="row" spacing={1.5} sx={{alignItems: 'center'}}>
                  <Swatch color={token.resolved as string} />
                  <Box sx={{minWidth: 0}}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{alignItems: 'baseline', flexWrap: 'wrap'}}
                    >
                      <TokenPath path={token.path} />
                      <Typography variant="bodyXxsmallRegular" color="textSecondary">
                        {String(token.resolved)}
                      </Typography>
                    </Stack>
                    <AliasChain token={token} />
                    {token.description ? (
                      <Typography
                        variant="bodyXxsmallRegular"
                        color="textSecondary"
                        sx={{display: 'block'}}
                      >
                        “{token.description}”
                      </Typography>
                    ) : null}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        ))}
      </Box>
    </Section>
  );
}

// --- Palette mapping ----------------------------------------------------------

export function PaletteMappingSection({theme}: {theme: Theme}) {
  const rows: {slot: string; path: string}[] = [];
  for (const [slot, value] of Object.entries(mapping.palette)) {
    if (typeof value === 'string') rows.push({slot, path: value});
    else for (const [key, path] of Object.entries(value)) rows.push({slot: `${slot}.${key}`, path});
  }
  return (
    <Section
      id="palette"
      title="MUI palette"
      description="How style-dictionary/mui-mapping.mjs fills MUI's palette. MUI derives the rest (light/dark shades, contrast text) from these. Unmapped slots keep MUI's defaults."
    >
      <Box sx={{overflowX: 'auto'}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>MUI slot</TableCell>
              <TableCell>Figma token</TableCell>
              <TableCell>Bliro</TableCell>
              <TableCell>MUI default</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({slot, path}) => {
              const bliro = String(get(theme.palette, slot));
              const fallback = String(get(muiDefault.palette, slot));
              return (
                <TableRow key={slot}>
                  <TableCell>
                    <code>palette.{slot}</code>
                  </TableCell>
                  <TableCell>
                    <TokenPath path={path} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                      <Swatch color={bliro} size={24} />
                      <Typography variant="bodyXsmallRegular">{bliro}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                      <Swatch color={fallback} size={24} />
                      <Typography variant="bodyXsmallRegular" color="textSecondary">
                        {fallback}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Section>
  );
}

// --- Typography ---------------------------------------------------------------

function styleSpec(value: Record<string, unknown>) {
  return `${value.fontSize} / ${value.lineHeight} · ${value.fontWeight} · ${value.letterSpacing}`;
}

function variantName(path: string) {
  return path
    .split('.')
    .slice(1)
    .map((part, i) =>
      part
        .split('-')
        .map((s, j) => (i === 0 && j === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
        .join(''),
    )
    .join('');
}

export function TypographySection() {
  const textStyles = [...tokenByPath.values()].filter(t => t.type === 'typography');
  return (
    <Section
      id="typography"
      title="Typography"
      description='MUI&apos;s own variants take their style from a Figma text style (mui-mapping.mjs). Every Figma text style is also a variant of its own, e.g. variant="bodySmallSemibold".'
    >
      <Typography variant="subheadingSubheading3" sx={{mb: 1.5}}>
        MUI variants
      </Typography>
      <Stack divider={<Box sx={{borderBottom: 1, borderColor: 'divider'}} />} sx={{mb: 4}}>
        {Object.entries(mapping.typography).map(([variant, path]) => {
          const token = tokenByPath.get(path)!;
          return (
            <Box
              key={variant}
              sx={{
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', md: '220px 1fr'},
                gap: 2,
                py: 1.5,
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="bodySmallSemibold" component="div">
                  {variant}
                </Typography>
                <TokenPath path={path} />
                <Typography
                  variant="bodyXxsmallRegular"
                  color="textSecondary"
                  sx={{display: 'block'}}
                >
                  {styleSpec(token.resolved as Record<string, unknown>)}
                </Typography>
              </Box>
              <Typography
                variant={variant as TypographyProps['variant']}
                sx={{display: 'block', overflowWrap: 'anywhere'}}
              >
                The quick brown fox jumps over the lazy dog
              </Typography>
            </Box>
          );
        })}
      </Stack>

      <Typography variant="subheadingSubheading3" sx={{mb: 1.5}}>
        All Figma text styles ({textStyles.length})
      </Typography>
      <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', lg: '1fr 1fr'}, columnGap: 4}}>
        {textStyles.map(token => (
          <Box key={token.path} sx={{py: 1, borderBottom: 1, borderColor: 'divider'}}>
            <Stack direction="row" spacing={1} sx={{alignItems: 'baseline', flexWrap: 'wrap'}}>
              <Typography variant="bodyXsmallSemibold" component="code">
                {variantName(token.path)}
              </Typography>
              <Typography variant="bodyXxsmallRegular" color="textSecondary">
                {styleSpec(token.resolved as Record<string, unknown>)}
              </Typography>
            </Stack>
            <Typography
              variant={variantName(token.path) as TypographyProps['variant']}
              sx={{display: 'block'}}
            >
              Meeting notes, summarized
            </Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}

// --- Spacing, radius, border --------------------------------------------------

function px(value: unknown) {
  return Number(String(value).replace('px', ''));
}

export function SpacingSection({theme}: {theme: Theme}) {
  const spacing = [...tokenByPath.values()].filter(t => t.path.startsWith('spacing.'));
  return (
    <Section
      id="spacing"
      title="Spacing"
      description="The theme keeps MUI's 8px spacing factor: sx={{p: 2}} is 16px. Bliro's scale sits on MUI's half-steps, shown on the right. Use tokens.spacing for exact values."
    >
      <Stack spacing={1}>
        {spacing.map(token => {
          const value = px(token.resolved);
          const factor = value / 8;
          return (
            <Box
              key={token.path}
              sx={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr 140px',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Box>
                <TokenPath path={token.path} />
                <AliasChain token={token} />
              </Box>
              <Box sx={{height: 12, width: value, bgcolor: 'primary.main', borderRadius: 0.5}} />
              <Typography variant="bodyXsmallRegular" color="textSecondary">
                {value}px · theme.spacing({factor}) = {theme.spacing(factor)}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Section>
  );
}

export function RadiusBorderSection() {
  const radii = [...tokenByPath.values()].filter(t => t.path.startsWith('radius.'));
  const borders = [...tokenByPath.values()].filter(t => t.path.startsWith('border.width.'));
  return (
    <Section
      id="radius"
      title="Radius & borders"
      description="theme.shape.borderRadius (MUI's default) comes from radius.sm. Buttons, cards, inputs, chips and dialogs use their semantic radius token via component overrides in src/theme/."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 2,
          mb: 4,
        }}
      >
        {radii.map(token => (
          <Box key={token.path}>
            <Box
              sx={{
                height: 72,
                bgcolor: 'action.selected',
                border: 2,
                borderColor: 'primary.main',
                borderRadius: `${Math.min(px(token.resolved), 36)}px`,
              }}
            />
            <TokenPath path={token.path} />
            <Typography variant="bodyXxsmallRegular" color="textSecondary" sx={{display: 'block'}}>
              {String(token.resolved)}
            </Typography>
            <AliasChain token={token} />
          </Box>
        ))}
      </Box>
      <Stack direction="row" spacing={3} sx={{flexWrap: 'wrap'}}>
        {borders.map(token => (
          <Box key={token.path} sx={{width: 150}}>
            <Box
              sx={{
                height: 48,
                border: `${token.resolved} solid`,
                borderColor: 'text.primary',
                borderRadius: 1,
              }}
            />
            <TokenPath path={token.path} />
            <Typography variant="bodyXxsmallRegular" color="textSecondary" sx={{display: 'block'}}>
              {String(token.resolved)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Section>
  );
}

// --- Shadows ------------------------------------------------------------------

export function ShadowSection({theme}: {theme: Theme}) {
  const shadowTokens = [...tokenByPath.values()].filter(t => t.type === 'shadow');
  const sourceFor = (elevation: number) => {
    let source: string | null = null;
    for (let e = 1; e <= elevation; e++) if (mapping.shadows[e]) source = mapping.shadows[e];
    return elevation === 0 ? 'none' : source;
  };
  return (
    <Section
      id="shadows"
      title="Shadows & elevation"
      description="Figma shadow styles, and the MUI elevation each one feeds. Elevations without their own mapping reuse the closest lower one. Card/Paper use 1, AppBar 4, Menu/Popover 8, Dialog 24."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 3,
          mb: 4,
          p: 1,
        }}
      >
        {shadowTokens.map(token => (
          <Paper
            key={token.path}
            elevation={0}
            sx={{
              p: 2,
              height: 110,
              boxShadow:
                theme.tokens.shadow[
                  shortName(token.path, 'shadow') as keyof typeof theme.tokens.shadow
                ],
            }}
          >
            <TokenPath path={token.path} />
            <Typography
              variant="bodyXxsmallRegular"
              color="textSecondary"
              sx={{display: 'block', mt: 1}}
            >
              {(token.resolved as {offsetY: string; blur: string; color: string}[])
                .map(s => `y ${s.offsetY} · blur ${s.blur} · ${s.color}`)
                .join(' + ')}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Typography variant="subheadingSubheading3" sx={{mb: 1.5}}>
        MUI elevations
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 2.5,
          p: 1,
        }}
      >
        {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map(elevation => (
          <Paper key={elevation} elevation={elevation} sx={{p: 1.5, height: 76}}>
            <Typography variant="bodySmallSemibold">{elevation}</Typography>
            <Chip size="small" label={sourceFor(elevation)} sx={{mt: 0.5, maxWidth: '100%'}} />
          </Paper>
        ))}
      </Box>
    </Section>
  );
}
