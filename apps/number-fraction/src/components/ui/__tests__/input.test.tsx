/// <reference lib="dom" />
import { describe, test, expect, jest } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  describe('Rendering', () => {
    test('should render input element', () => {
      const { getByRole } = render(<Input />);
      expect(getByRole('textbox')).toBeInTheDocument();
    });

    test('should render with placeholder', () => {
      const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
      expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    test('should render with value', () => {
      const { getByDisplayValue } = render(<Input value="test value" readOnly />);
      expect(getByDisplayValue('test value')).toBeInTheDocument();
    });
  });

  describe('Types', () => {
    test('should render with different types', () => {
      const { rerender, getByRole, getByPlaceholderText } = render(<Input type="text" placeholder="text" />);
      expect(getByRole('textbox')).toHaveAttribute('type', 'text');

      rerender(<Input type="password" placeholder="password" />);
      // Password input doesn't have 'textbox' role by default
      expect(getByPlaceholderText('password')).toHaveAttribute('type', 'password');

      rerender(<Input type="email" placeholder="email" />);
      expect(getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input type="number" placeholder="number" />);
      expect(getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });
  });

  describe('Interactions', () => {
    test('should call onChange when typing', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      const { getByRole } = render(<Input onChange={handleChange} />);
      const input = getByRole('textbox');
      
      await user.type(input, 'a');
      expect(handleChange).toHaveBeenCalled();
    });

    test('should update value when typing', async () => {
      const user = userEvent.setup();
      
      const { getByRole } = render(<Input />);
      const input = getByRole('textbox');
      
      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });
  });

  describe('States', () => {
    test('should be disabled when disabled prop is true', () => {
      const { getByRole } = render(<Input disabled />);
      expect(getByRole('textbox')).toBeDisabled();
    });

    test('should be enabled by default', () => {
      const { getByRole } = render(<Input />);
      expect(getByRole('textbox')).toBeEnabled();
    });

    test('should be readonly when readOnly prop is true', () => {
      const { getByRole } = render(<Input readOnly />);
      expect(getByRole('textbox')).toHaveAttribute('readonly');
    });
  });

  describe('Custom Props', () => {
    test('should accept className prop', () => {
      const { getByRole } = render(<Input className="custom-class" />);
      expect(getByRole('textbox')).toHaveClass('custom-class');
    });

    test('should accept id prop', () => {
      const { getByRole } = render(<Input id="test-id" />);
      expect(getByRole('textbox')).toHaveAttribute('id', 'test-id');
    });

    test('should accept name prop', () => {
      const { getByRole } = render(<Input name="test-name" />);
      expect(getByRole('textbox')).toHaveAttribute('name', 'test-name');
    });
  });
});
