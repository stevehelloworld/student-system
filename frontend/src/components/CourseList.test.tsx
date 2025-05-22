import { render, screen } from '@testing-library/react';
import CourseList from './CourseList';
import type { CourseRecord } from './CourseList';

describe('CourseList', () => {
  const records: CourseRecord[] = [
    { id: 1, name: '數學', teacher: '王老師', time: '週一 10:00', location: 'A101' },
    { id: 2, name: '英文', teacher: '李老師', time: '週二 14:00', location: 'B202' },
  ];

  it('renders records', () => {
    render(<CourseList records={records} />);
    expect(screen.getByText('數學')).toBeInTheDocument();
    expect(screen.getByText('英文')).toBeInTheDocument();
    expect(screen.getByText('王老師')).toBeInTheDocument();
    expect(screen.getByText('李老師')).toBeInTheDocument();
    expect(screen.getByText('A101')).toBeInTheDocument();
    expect(screen.getByText('B202')).toBeInTheDocument();
  });

  it('shows empty message if no records', () => {
    render(<CourseList records={[]} />);
    expect(screen.getByText('無課程資料')).toBeInTheDocument();
  });
});
