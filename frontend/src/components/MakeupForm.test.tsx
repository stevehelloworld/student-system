import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import MakeupForm from './MakeupForm';
import type { MakeUpSession } from '../api/makeup';

vi.mock('../api/makeup', async () => {
  return {
    createMakeup: vi.fn(() => Promise.resolve({ success: true })),
    updateMakeup: vi.fn(() => Promise.resolve({ success: true })),
  };
});

describe('MakeupForm', () => {
  const baseProps = {
    open: true,
    onClose: vi.fn(),
    token: 'fake',
    onSuccess: vi.fn(),
  };

  it('renders and submits new record', async () => {
    render(<MakeupForm {...baseProps} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: /學生ID/ }), { target: { value: '2' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /原課堂SessionID/ }), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/補課日期/), { target: { value: '2025-09-20' } });
    fireEvent.change(screen.getByLabelText(/開始時間/), { target: { value: '14:00' } });
    fireEvent.change(screen.getByLabelText(/結束時間/), { target: { value: '15:00' } });
    fireEvent.change(screen.getByLabelText(/補課說明/), { target: { value: '單元補課' } });
    fireEvent.click(screen.getByText('新增'));
    await waitFor(() => expect(baseProps.onSuccess).toHaveBeenCalled());
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('renders and submits edit record', async () => {
    const initial: Partial<MakeUpSession> = {
      id: 1, studentId: 2, originalSessionId: 10, makeUpDate: '2025-09-20', startTime: '14:00', endTime: '15:00', content: '單元補課'
    };
    render(<MakeupForm {...baseProps} initial={initial} />);
    fireEvent.change(screen.getByLabelText('補課說明'), { target: { value: '改內容' } });
    fireEvent.click(screen.getByText('儲存'));
    await waitFor(() => expect(baseProps.onSuccess).toHaveBeenCalled());
    expect(baseProps.onClose).toHaveBeenCalled();
  });
});
