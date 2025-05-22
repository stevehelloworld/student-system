import { useState } from 'react';
import { Button } from '@mui/material';
import MakeupList from '../components/MakeupList';
import MakeupForm from '../components/MakeupForm';

const MakeupPage = ({ token, role, userId }: { token: string; role?: string; userId?: number }) => {
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

  const handleAdd = () => {
    setEditRecord(undefined);
    setFormOpen(true);
  };

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        新增補課
      </Button>
      <MakeupList 
        token={token} 
        onEdit={handleEdit} 
        role={role} 
        userId={userId} 
        key={refreshKey} 
      />
      <MakeupForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        token={token}
        initial={editRecord}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default MakeupPage;
