import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import LeaveForm from './LeaveForm';
import type { LeaveRecord } from './LeaveList';

describe('LeaveForm', () => {
  it('renders and submits new record', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <LeaveForm open={true} onClose={onClose} onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByLabelText(/學生/), { target: { value: '小明' } });
    fireEvent.change(screen.getByLabelText(/日期/), { target: { value: '2025-05-24' } });
    fireEvent.change(screen.getByLabelText(/事由/), { target: { value: '感冒' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /狀態/ }));
    fireEvent.click(screen.getByRole('option', { name: '通過' }));
    fireEvent.click(screen.getByText('新增'));
    expect(onSubmit).toHaveBeenCalledWith({ studentName: '小明', date: '2025-05-24', reason: '感冒', status: '通過' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders and submits edit record', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    const initial: Partial<LeaveRecord> = { studentName: '小華', date: '2025-05-23', reason: '家庭事', status: '審核中' };
    render(
      <LeaveForm open={true} onClose={onClose} onSubmit={onSubmit} initial={initial} />
    );
    fireEvent.change(screen.getByLabelText(/事由/), { target: { value: '私人事' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /狀態/ }));
    fireEvent.click(screen.getByRole('option', { name: '駁回' }));
    fireEvent.click(screen.getByText('儲存'));
    expect(onSubmit).toHaveBeenCalledWith({ studentName: '小華', date: '2025-05-23', reason: '私人事', status: '駁回' });
    expect(onClose).toHaveBeenCalled();
  });
});
