import { render, screen } from '@testing-library/react';
import LeaveList from './LeaveList';
import type { LeaveRecord } from './LeaveList';

describe('LeaveList', () => {
  const records: LeaveRecord[] = [
    { id: 1, studentName: '小明', date: '2025-05-22', reason: '感冒', status: '審核中' },
    { id: 2, studentName: '小華', date: '2025-05-23', reason: '家庭事', status: '通過' },
  ];

  it('renders records', () => {
    render(<LeaveList records={records} />);
    expect(screen.getByText('小明')).toBeInTheDocument();
    expect(screen.getByText('小華')).toBeInTheDocument();
    expect(screen.getByText('感冒')).toBeInTheDocument();
    expect(screen.getByText('家庭事')).toBeInTheDocument();
    expect(screen.getByText('審核中')).toBeInTheDocument();
    expect(screen.getByText('通過')).toBeInTheDocument();
  });

  it('shows empty message if no records', () => {
    render(<LeaveList records={[]} />);
    expect(screen.getByText('無請假紀錄')).toBeInTheDocument();
  });
});
