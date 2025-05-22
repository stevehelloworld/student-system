import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CourseForm from './CourseForm';
import type { CourseRecord } from './CourseList';

describe('CourseForm', () => {
  it('renders and submits new record', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <CourseForm open={true} onClose={onClose} onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByLabelText(/課程名稱/), { target: { value: '物理' } });
    fireEvent.change(screen.getByLabelText(/教師/), { target: { value: '張老師' } });
    fireEvent.change(screen.getByLabelText(/時間/), { target: { value: '週三 09:00' } });
    fireEvent.change(screen.getByLabelText(/地點/), { target: { value: 'C303' } });
    fireEvent.click(screen.getByText('新增'));
    expect(onSubmit).toHaveBeenCalledWith({ name: '物理', teacher: '張老師', time: '週三 09:00', location: 'C303' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders and submits edit record', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    const initial: Partial<CourseRecord> = { name: '化學', teacher: '陳老師', time: '週五 13:00', location: 'D404' };
    render(
      <CourseForm open={true} onClose={onClose} onSubmit={onSubmit} initial={initial} />
    );
    fireEvent.change(screen.getByLabelText(/時間/), { target: { value: '週五 14:00' } });
    fireEvent.click(screen.getByText('儲存'));
    expect(onSubmit).toHaveBeenCalledWith({ name: '化學', teacher: '陳老師', time: '週五 14:00', location: 'D404' });
    expect(onClose).toHaveBeenCalled();
  });
});
