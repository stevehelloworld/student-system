import axios from 'axios';

const API_BASE = '/api/makeup';

export interface MakeUpSession {
  id: number;
  originalSessionId: number;
  studentId: number;
  makeUpDate: string;
  startTime: string;
  endTime: string;
  attendanceStatus: string;
  content: string | null;
  createdById: number;
  createdAt: string;
  leaveRequestId: number | null;
  student?: { id: number; name: string; email: string; studentNo?: string };
  originalSession?: any;
  createdBy?: { id: number; name: string };
  leaveRequest?: any;
}

export async function fetchAllMakeups(token: string): Promise<MakeUpSession[]> {
  const res = await axios.get('/api/makeup', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export async function fetchStudentMakeups(studentId: number, token: string): Promise<MakeUpSession[]> {
  const res = await axios.get(`/api/makeup/student/${studentId}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export async function createMakeup(data: Partial<MakeUpSession>, token: string) {
  const res = await axios.post(API_BASE, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateMakeup(id: number, data: Partial<MakeUpSession>, token: string) {
  const res = await axios.put(`${API_BASE}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteMakeup(id: number, token: string) {
  const res = await axios.delete(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
