import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DateField } from './DateField';
import { TagField } from './TagField';
import { TextField } from './TextField';
import { TextareaField } from './TextareaField';

describe('editor fields', () => {
  it('TextField appelle onChange (contrôlé)', () => {
    const onChange = vi.fn();
    render(<TextField label="Titre" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Titre'), { target: { value: 'Dev' } });
    expect(onChange).toHaveBeenCalledWith('Dev');
  });

  it('TextareaField appelle onChange (contrôlé)', () => {
    const onChange = vi.fn();
    render(<TextareaField label="Description" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Texte' } });
    expect(onChange).toHaveBeenCalledWith('Texte');
  });

  it('DateField met à jour les dates et le poste actuel', () => {
    const onChange = vi.fn();
    render(
      <DateField startDate="2020-01" endDate="2022-06" current={false} onChange={onChange} />,
    );

    fireEvent.click(screen.getByLabelText('Poste actuel'));
    expect(onChange).toHaveBeenCalledWith('2020-01', '', true);
  });

  it('TagField ajoute un tag via le bouton', () => {
    const onTagsChange = vi.fn();
    const onInputChange = vi.fn();
    render(
      <TagField
        tags={['React']}
        onTagsChange={onTagsChange}
        inputValue="TypeScript"
        onInputChange={onInputChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    expect(onTagsChange).toHaveBeenCalledWith(['React', 'TypeScript']);
    expect(onInputChange).toHaveBeenCalledWith('');
  });
});
