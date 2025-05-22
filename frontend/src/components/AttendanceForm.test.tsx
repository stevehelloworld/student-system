import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AttendanceForm from './AttendanceForm';
import type { AttendanceRecord } from './AttendanceList';

describe('AttendanceForm', () => {
  it('renders and submits new record', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <AttendanceForm open={true} onClose={onClose} onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByLabelText(/學生/), { target: { value: '小明' } });
    fireEvent.change(screen.getByLabelText(/日期/), { target: { value: '2025-05-23' } });
    // 狀態選單互動
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /狀態/ }));
    fireEvent.click(screen.getByRole('option', { name: '遲到' }));
    fireEvent.click(screen.getByText('新增'));
    expect(onSubmit).toHaveBeenCalledWith({ studentName: '小明', date: '2025-05-23', status: '遲到' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders and submits edit record', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    const initial: Partial<AttendanceRecord> = { studentName: '小華', date: '2025-05-22', status: '缺席' };
    render(
      <AttendanceForm open={true} onClose={onClose} onSubmit={onSubmit} initial={initial} />
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /狀態/ }));
    fireEvent.click(screen.getByRole('option', { name: '出席' }));
    fireEvent.click(screen.getByText('儲存'));
    expect(onSubmit).toHaveBeenCalledWith({ studentName: '小華', date: '2025-05-22', status: '出席' });
    expect(onClose).toHaveBeenCalled();
  });
});
