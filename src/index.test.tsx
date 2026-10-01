import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button, Typography, ThemeProvider, theme, tokens, useTheme} from './index';

describe('theme', () => {
  it('maps tokens onto the MUI palette and shape', () => {
    expect(theme.palette.primary.main).toBe(tokens.colors.button.primary.main);
    expect(theme.palette.error.main).toBe(tokens.colors.error.default);
    expect(theme.shape.borderRadius).toBe(tokens.radius.button);
    expect(theme.tokens).toEqual(tokens);
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
    expect(screen.getByText(tokens.colors.button.primary.main)).toBeInTheDocument();
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
