/// <reference lib="dom" />
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    test('should render card', () => {
      const { getByText } = render(<Card>Card Content</Card>);
      expect(getByText('Card Content')).toBeInTheDocument();
    });

    test('should accept className prop', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('CardHeader', () => {
    test('should render card header', () => {
      const { getByText } = render(<CardHeader>Header</CardHeader>);
      expect(getByText('Header')).toBeInTheDocument();
    });
  });

  describe('CardTitle', () => {
    test('should render card title', () => {
      const { getByText } = render(<CardTitle>Title</CardTitle>);
      expect(getByText('Title')).toBeInTheDocument();
    });
  });

  describe('CardDescription', () => {
    test('should render card description', () => {
      const { getByText } = render(<CardDescription>Description</CardDescription>);
      expect(getByText('Description')).toBeInTheDocument();
    });
  });

  describe('CardContent', () => {
    test('should render card content', () => {
      const { getByText } = render(<CardContent>Content</CardContent>);
      expect(getByText('Content')).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    test('should render card footer', () => {
      const { getByText } = render(<CardFooter>Footer</CardFooter>);
      expect(getByText('Footer')).toBeInTheDocument();
    });
  });

  describe('Complete Card', () => {
    test('should render complete card with all parts', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main Content</p>
          </CardContent>
          <CardFooter>
            <p>Footer Content</p>
          </CardFooter>
        </Card>
      );

      expect(getByText('Card Title')).toBeInTheDocument();
      expect(getByText('Card Description')).toBeInTheDocument();
      expect(getByText('Main Content')).toBeInTheDocument();
      expect(getByText('Footer Content')).toBeInTheDocument();
    });
  });
});
