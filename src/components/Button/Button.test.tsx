import React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {Button} from './Button';

describe('Button', () => {
  it('renders its label', async () => {
    await render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button onPress={onPress}>Click me</Button>);
    await user.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(
      <Button disabled onPress={onPress}>
        Click me
      </Button>,
    );
    await user.press(screen.getByText('Click me'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
