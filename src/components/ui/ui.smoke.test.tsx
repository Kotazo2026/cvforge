import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Badge } from './Badge';
import { Button } from './Button';
import { Divider } from './Divider';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Tooltip } from './Tooltip';

describe('UI components smoke', () => {
  it('renders Button, Input, Textarea, Badge, Tooltip, Divider', () => {
    render(
      <div>
        <Button variant="primary" size="md" onClick={vi.fn()}>
          Enregistrer
        </Button>
        <Input label="Nom" value="" onChange={vi.fn()} />
        <Textarea label="Bio" value="" onChange={vi.fn()} />
        <Badge label="React" onRemove={vi.fn()} />
        <Tooltip content="Aide">
          <button type="button">?</button>
        </Tooltip>
        <Divider />
      </div>,
    );

    expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeTruthy();
    expect(screen.getByLabelText('Nom')).toBeTruthy();
    expect(screen.getByLabelText('Bio')).toBeTruthy();
    expect(screen.getByText('React')).toBeTruthy();
    expect(screen.getByRole('button', { name: '?' })).toBeTruthy();
    expect(screen.getByRole('separator')).toBeTruthy();
  });
});
