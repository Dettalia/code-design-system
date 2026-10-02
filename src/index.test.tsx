import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button, Typography, ThemeProvider, theme, tokens, useTheme} from './index';

describe('theme', () => {
  it('maps Figma tokens onto the MUI palette', () => {
    expect(theme.palette.primary.main).toBe(tokens.color.button.primary.main);
    expect(theme.palette.primary.dark).toBe(tokens.color.button.primary.hovered);
    expect(theme.palette.error.main).toBe(tokens.color.error.default);
    expect(theme.palette.success.main).toBe(tokens.color.success.default);
    expect(theme.palette.background.default).toBe(tokens.color.background.page);
    expect(theme.palette.divider).toBe(tokens.color.border.default);
    expect(theme.shape.borderRadius).toBe(tokens.radius.sm);
    expect(theme.tokens).toEqual(tokens);
  });

  it('maps Figma text styles onto MUI typography variants', () => {
    // Heading/H1: Inter Bold 48/64, letter spacing -2% in Figma.
    expect(theme.typography.h1).toMatchObject({
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.3333,
      letterSpacing: '-0.02em',
    });
    expect(theme.typography.body1).toMatchObject(theme.typography.bodyNormalRegular);
    expect(theme.typography.fontFamily).toBe('"Inter", sans-serif');
  });

  it('maps Figma shadows onto MUI elevations', () => {
    expect(theme.shadows[0]).toBe('none');
    expect(theme.shadows[1]).toBe(tokens.shadow['1']);
    expect(theme.shadows[4]).toBe(tokens.shadow['2']);
    expect(theme.shadows[24]).toBe(tokens.shadow.modal);
  });

  it('is applied by the Bliro ThemeProvider by default', () => {
    function Probe() {
      return <span>{useTheme().palette.primary.main}</span>;
    }
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText(tokens.color.button.primary.main)).toBeInTheDocument();
  });
});

describe('MUI re-exports', () => {
  it('renders an MUI Button and handles clicks', async () => {
    const onClick = jest.fn();
    render(
      <ThemeProvider>
        <Button onClick={onClick}>Click me</Button>
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', {name: 'Click me'}));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a disabled Button as disabled', () => {
    render(
      <ThemeProvider>
        <Button disabled>Click me</Button>
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', {name: 'Click me'})).toBeDisabled();
  });

  it('supports the generated Bliro typography variants', () => {
    render(
      <ThemeProvider>
        <Typography variant="bodySmallSemibold">Hello</Typography>
      </ThemeProvider>,
    );
    expect(screen.getByText('Hello')).toHaveClass('MuiTypography-bodySmallSemibold');
  });
});
