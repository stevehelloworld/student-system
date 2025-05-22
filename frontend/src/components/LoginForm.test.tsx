import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginForm', () => {
  it('renders and submits login', async () => {
    const onLogin = vi.fn();
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'jwt', role: 'admin', userId: 1 } });
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText(/密碼/), { target: { value: 'pw' } });
    fireEvent.click(screen.getByText('登入'));
    await waitFor(() => expect(onLogin).toHaveBeenCalledWith('jwt', 'admin', 1));
  });

  it('shows error on login fail', async () => {
    const onLogin = vi.fn();
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { error: '帳號或密碼錯誤' } } });
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText(/密碼/), { target: { value: 'pw' } });
    fireEvent.click(screen.getByText('登入'));
    expect(await screen.findByText('帳號或密碼錯誤')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });
});
