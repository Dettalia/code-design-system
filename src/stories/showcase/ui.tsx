import React from 'react';
import {Box, Chip, Paper, Stack, Typography} from '../../index';

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box component="section" id={id} sx={{scrollMarginTop: 88, mb: 6}}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="textSecondary" sx={{mt: 0.5, mb: 2.5, maxWidth: 820}}>
          {description}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}

export function TokenPath({path}: {path: string}) {
  return (
    <Box
      component="code"
      sx={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: '0.75rem',
        color: 'text.primary',
        bgcolor: 'action.hover',
        px: 0.5,
        borderRadius: 0.5,
        overflowWrap: 'anywhere',
      }}
    >
      {path}
    </Box>
  );
}

/** A labelled component demo with the theme inputs that shape it. */
export function Demo({
  title,
  inputs,
  children,
}: {
  title: string;
  inputs?: string[];
  children: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{p: {xs: 2, md: 3}, mb: 3}}>
      <Typography variant="h6" component="h3">
        {title}
      </Typography>
      {inputs?.length ? (
        <Stack direction="row" spacing={0.75} useFlexGap sx={{flexWrap: 'wrap', mt: 1, mb: 2.5}}>
          {inputs.map(input => (
            <Chip key={input} size="small" variant="outlined" label={input} />
          ))}
        </Stack>
      ) : (
        <Box sx={{mb: 2.5}} />
      )}
      {children}
    </Paper>
  );
}

export function Row({label, children}: {label?: string; children: React.ReactNode}) {
  return (
    <Box sx={{mb: 2}}>
      {label ? (
        <Typography variant="caption" color="textSecondary" sx={{display: 'block', mb: 1}}>
          {label}
        </Typography>
      ) : null}
      <Stack direction="row" spacing={1.5} useFlexGap sx={{flexWrap: 'wrap', alignItems: 'center'}}>
        {children}
      </Stack>
    </Box>
  );
}
