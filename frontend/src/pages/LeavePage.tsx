import { useState } from 'react';
import { Button } from '@mui/material';
import LeaveList from '../components/LeaveList';
import LeaveForm from '../components/LeaveForm';

const LeavePage = ({ token, role, userId }: { token: string; role?: string; userId?: number }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (record: any) => {
    setEditRecord(record);
    setFormOpen(true);
  };

  const handleSuccess = () => {
    setFormOpen(false);
    setEditRecord(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={() => setFormOpen(true)}
        sx={{ mb: 2 }}
      >
        新增請假申請
      </Button>
      <LeaveList 
        token={token} 
        onEdit={handleEdit} 
        role={role} 
        userId={userId} 
        key={refreshKey} 
      />
      <LeaveForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        token={token}
        initial={editRecord}
        onSuccess={handleSuccess}
        userId={userId}
      />
    </div>
  );
};

export default LeavePage;
