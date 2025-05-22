import { render, screen } from '@testing-library/react';
import AttendanceList from './AttendanceList';
import type { AttendanceRecord } from './AttendanceList';

describe('AttendanceList', () => {
  const records: AttendanceRecord[] = [
    { id: 1, studentName: '小明', date: '2025-05-22', status: '出席' },
    { id: 2, studentName: '小華', date: '2025-05-22', status: '缺席' },
  ];

  it('renders records', () => {
    render(<AttendanceList records={records} />);
    expect(screen.getByText('小明')).toBeInTheDocument();
    expect(screen.getByText('小華')).toBeInTheDocument();
    expect(screen.getByText('出席')).toBeInTheDocument();
    expect(screen.getByText('缺席')).toBeInTheDocument();
  });

  it('shows empty message if no records', () => {
    render(<AttendanceList records={[]} />);
    expect(screen.getByText('無出缺勤紀錄')).toBeInTheDocument();
  });
});
