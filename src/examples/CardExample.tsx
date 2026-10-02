import React, {useState} from 'react';
import {Button, Card, CardActions, CardContent, Typography} from '../index';
import {ShareSummaryModal} from './ShareSummaryModal';

export interface CardExampleProps {
  title?: string;
  body?: string;
  primaryAction?: string;
  secondaryAction?: string;
}

/**
 * A card built only from the package's MUI components and the Bliro theme:
 * no local styles beyond layout spacing. The main button opens the Figma
 * Modal (ShareSummaryModal). Used by examples/card (HTML page) and by the
 * Examples/Card story.
 */
export function CardExample({
  title = 'Discovery call with Acme',
  body = 'Budget is confirmed for Q4 and the team wants a technical demo with IT before signing. Share the summary with attendees, or review the action items first.',
  primaryAction = 'Share summary',
  secondaryAction = 'Review action items',
}: CardExampleProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Card variant="outlined" sx={{maxWidth: 420}}>
      <CardContent sx={{p: 3, pb: 2}}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {body}
        </Typography>
      </CardContent>
      {/* disableSpacing: use `gap` instead of MUI's sibling margins, so the
          buttons can wrap onto two rows on narrow screens. */}
      <CardActions disableSpacing sx={{px: 3, pb: 3, pt: 0, gap: 1.5, flexWrap: 'wrap'}}>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          {primaryAction}
        </Button>
        <Button variant="outlined">{secondaryAction}</Button>
      </CardActions>
      <ShareSummaryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Card>
  );
}
