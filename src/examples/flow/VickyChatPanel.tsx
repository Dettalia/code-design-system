import React, {useEffect, useRef, useState} from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  tokens,
} from '../../index';
import arrowUp from '../company-assets/arrow-up.svg';
import calendar16 from '../company-assets/calendar-16.svg';
import chevronDown16 from '../company-assets/chevron-down-16.svg';
import historyIcon from '../company-assets/history.svg';
import newChatIcon from '../company-assets/new-chat.svg';
import panelClose from '../company-assets/panel-close.svg';
import panelOpen from '../company-assets/panel-open.svg';
import sparkles20 from '../company-assets/sparkles-20.svg';
import sparkles40 from '../company-assets/sparkles-40.svg';

// "Ask Vicky" chat window from Figma (Bliro Web app, component "Chat window"
// 7783:109597, used on the company detail page 8032:74223). Open: 420px panel;
// closed: a 62px strip with the expand button.

const {color, radius, shadow} = tokens;

const SUGGESTIONS = [
  'Which questions did the other participants ask?',
  'What were the main concerns in this meeting?',
  'Write down the next steps for each participant.',
];

const RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

type Message = {from: 'user' | 'vicky'; text: string};

const Img = ({src}: {src: string}) => <Box component="img" src={src} alt="" sx={{display: 'block'}} />;

// Docked to the right of the page with a hairline on its left (Figma 8117:120152).
const panelSx = {
  flexShrink: 0,
  bgcolor: 'background.paper',
  borderLeft: `1px solid ${color.neutral['100']}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
} as const;

const iconButtonSx = {width: 32, height: 32, p: 0.5, borderRadius: `${radius.lg}px`} as const;

export function VickyChatPanel({companyName}: {companyName: string}) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [range, setRange] = useState('Last 30 days');
  const [rangeAnchor, setRangeAnchor] = useState<HTMLElement | null>(null);
  const [historyNote, setHistoryNote] = useState(false);
  const threadEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEnd.current?.scrollIntoView?.({block: 'end'});
  }, [messages]);

  const ask = (text: string) => {
    const question = text.trim();
    if (!question) return;
    setDraft('');
    setMessages(m => [
      ...m,
      {from: 'user', text: question},
      // Not in Figma: a placeholder answer, since the prototype has no AI behind it.
      {
        from: 'vicky',
        text: `In the app, I'd answer this from ${companyName}'s meetings (${range.toLowerCase()}). This prototype isn't connected to Vicky yet.`,
      },
    ]);
  };

  if (!open) {
    return (
      <Box component="aside" aria-label="Ask Vicky" sx={{...panelSx, width: 62, alignItems: 'center', pt: 2}}>
        <Tooltip title="Open Vicky" placement="left">
          <IconButton aria-label="Open Vicky" aria-expanded={false} onClick={() => setOpen(true)} sx={iconButtonSx}>
            <Img src={panelClose} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box component="aside" aria-label="Ask Vicky" sx={{...panelSx, width: 420}}>
      {/* Header: collapse, new chat, history */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', p: 2}}>
        <Tooltip title="Close Vicky">
          <IconButton aria-label="Close Vicky" aria-expanded onClick={() => setOpen(false)} sx={iconButtonSx}>
            <Img src={panelOpen} />
          </IconButton>
        </Tooltip>
        <Box sx={{display: 'flex', gap: 2}}>
          <Tooltip title="New chat">
            <IconButton aria-label="New chat" onClick={() => setMessages([])} sx={iconButtonSx}>
              <Img src={newChatIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip title={historyNote ? 'Chat history isn\'t in this prototype' : 'Chat history'}>
            <IconButton aria-label="Chat history" onClick={() => setHistoryNote(true)} sx={iconButtonSx}>
              <Img src={historyIcon} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Body: empty state with suggestions, or the conversation */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2,
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: messages.length ? 'flex-start' : 'center',
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1}}>
              <Img src={sparkles40} />
              <Typography variant="h6" component="h2" sx={{textAlign: 'center', maxWidth: 260}}>
                Ask Vicky anything about this call
              </Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
              {SUGGESTIONS.map(suggestion => (
                <ButtonBase
                  key={suggestion}
                  onClick={() => ask(suggestion)}
                  sx={{
                    justifyContent: 'flex-start',
                    gap: 1,
                    height: 68,
                    px: 2,
                    py: 1.5,
                    textAlign: 'left',
                    bgcolor: 'background.paper',
                    border: `1px solid ${color.neutral['100']}`,
                    borderRadius: `${radius.lg}px`,
                    boxShadow: shadow['1'],
                    typography: 'bodySmallMedium',
                    color: color.neutral['900'],
                    '&:hover': {bgcolor: 'action.hover'},
                  }}
                >
                  <Img src={sparkles20} />
                  {suggestion}
                </ButtonBase>
              ))}
            </Box>
          </Box>
        ) : (
          <Box role="log" aria-label="Conversation" sx={{display: 'flex', flexDirection: 'column', gap: 1.5, pb: 2}}>
            {messages.map((message, i) =>
              message.from === 'user' ? (
                <Box
                  key={i}
                  sx={{
                    alignSelf: 'flex-end',
                    maxWidth: '85%',
                    px: 1.5,
                    py: 1,
                    bgcolor: color.neutral['25'],
                    borderRadius: `${radius['2xl']}px`,
                    typography: 'bodySmallRegular',
                  }}
                >
                  {message.text}
                </Box>
              ) : (
                <Box key={i} sx={{display: 'flex', gap: 1, alignItems: 'flex-start', maxWidth: '92%'}}>
                  <Box sx={{flexShrink: 0, mt: '1px'}}>
                    <Img src={sparkles20} />
                  </Box>
                  <Typography variant="bodySmallRegular">{message.text}</Typography>
                </Box>
              ),
            )}
            <div ref={threadEnd} />
          </Box>
        )}
      </Box>

      {/* Composer */}
      <Box sx={{px: 2}}>
        <Box
          component="form"
          onSubmit={event => {
            event.preventDefault();
            ask(draft);
          }}
          sx={{
            border: `1px solid ${color.button.primary.main}`,
            borderRadius: `${radius['2xl']}px`,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <InputBase
            multiline
            minRows={2}
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                ask(draft);
              }
            }}
            placeholder="Ask Bliro about your calls..."
            inputProps={{'aria-label': 'Ask Vicky'}}
            sx={theme => ({
              ...theme.typography.bodySmallRegular,
              p: 0,
              '& textarea::placeholder': {color: theme.palette.text.disabled, opacity: 1},
            })}
          />
          <Divider sx={{borderColor: color.neutral['100']}} />
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <ButtonBase
              onClick={event => setRangeAnchor(event.currentTarget)}
              aria-haspopup="menu"
              aria-label={`Time range: ${range}`}
              sx={{height: 32, p: 1, gap: 1, borderRadius: `${radius.sm}px`, '&:hover': {bgcolor: 'action.hover'}}}
            >
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1, width: 120}}>
                <Img src={calendar16} />
                <Typography variant="bodyXsmallMedium" color="textSecondary">
                  {range}
                </Typography>
              </Box>
              <Img src={chevronDown16} />
            </ButtonBase>
            <Menu anchorEl={rangeAnchor} open={Boolean(rangeAnchor)} onClose={() => setRangeAnchor(null)}>
              {RANGES.map(option => (
                <MenuItem
                  key={option}
                  selected={option === range}
                  onClick={() => {
                    setRange(option);
                    setRangeAnchor(null);
                  }}
                  sx={{typography: 'bodySmallRegular'}}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
            <Button variant="contained" type="submit" aria-label="Send" sx={{width: 40, height: 40, p: 0}}>
              <Img src={arrowUp} />
            </Button>
          </Box>
        </Box>
        <Typography variant="bodySmallRegular" color="textSecondary" component="p" sx={{textAlign: 'center', py: 1}}>
          AI-generated content. Review before sharing.
        </Typography>
      </Box>
    </Box>
  );
}
