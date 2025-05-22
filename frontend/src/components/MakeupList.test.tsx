import { render, screen, fireEvent } from '@testing-library/react';
import MakeupList from './MakeupList';
import type { MakeUpSession } from '../api/makeup';

const mockMakeups: MakeUpSession[] = [
  {
    id: 1,
    originalSessionId: 10,
    studentId: 2,
    makeUpDate: '2025-09-20',
    startTime: '14:00',
    endTime: '15:00',
    attendanceStatus: '未簽到',
    content: '補課說明',
    createdById: 3,
    createdAt: '2025-05-22T01:55:33.000Z',
    leaveRequestId: null,
    student: { id: 2, name: '學生A', email: 'a@example.com', studentNo: 'S001' },
    createdBy: { id: 3, name: '老師A' },
  },
];

import * as makeupApi from '../api/makeup';
import { vi } from 'vitest';

beforeEach(() => {
  vi.spyOn(makeupApi, 'fetchAllMakeups').mockResolvedValue(mockMakeups);
  vi.spyOn(makeupApi, 'deleteMakeup').mockResolvedValue({ success: true });
});

describe('MakeupList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('shows only own makeups for student', async () => {
    const studentMakeups = [
      { ...mockMakeups[0], studentId: 2 },
    ];
    vi.spyOn(makeupApi, 'fetchStudentMakeups').mockResolvedValueOnce(studentMakeups);
    render(<MakeupList token="fake" onEdit={vi.fn()} role="student" userId={2} />);
    expect(await screen.findByText(studentMakeups[0].content!)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /編輯/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /刪除/i })).not.toBeInTheDocument();
  });

  it('shows edit/delete for admin', async () => {
    vi.spyOn(makeupApi, 'fetchAllMakeups').mockResolvedValueOnce(mockMakeups);
    render(<MakeupList token="fake" onEdit={vi.fn()} role="admin" />);
    expect(await screen.findByText(mockMakeups[0].content!)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /編輯/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /刪除/i }).length).toBeGreaterThan(0);
  });
  it('renders makeup list and calls onEdit when edit clicked', async () => {
    const onEdit = vi.fn();
    vi.spyOn(makeupApi, 'fetchAllMakeups').mockResolvedValueOnce(mockMakeups);
    render(<MakeupList token="fake" onEdit={onEdit} role="admin" />);
    expect(await screen.findByText('學生A')).toBeInTheDocument();
    expect(screen.getByText('補課說明')).toBeInTheDocument();
    // 點擊編輯按鈕
    fireEvent.click(screen.getByRole('button', { name: '編輯' }));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: mockMakeups[0].id }));
  });

  it('shows empty message if no data', async () => {
    (makeupApi.fetchAllMakeups as any).mockResolvedValueOnce([]);
    render(<MakeupList token="fake" onEdit={() => {}} />);
    expect(await screen.findByText('無補課紀錄')).toBeInTheDocument();
  });
});
