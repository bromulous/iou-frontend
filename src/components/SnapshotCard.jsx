import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import backend from '../api';

const StyledCard = styled(Card)({
  maxWidth: 350,
  margin: 'auto',
  marginTop: 20,
  padding: 20,
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const StyledButton = styled(Button)({
  marginTop: 20,
  fontSize: '1rem',
  padding: '10px 20px',
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:disabled': {
    backgroundColor: '#b0b0b0',
    color: '#7f7f7f',
  },
});

const SnapshotCard = ({ bond_id, user_id, current_block, next_snapshot_block, onSnapshotTaken }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSnapshotTaken, setIsSnapshotTaken] = useState(false);

  useEffect(() => {
    if (next_snapshot_block === 0) return;

    const initialBlocksLeft = next_snapshot_block - current_block;
    const initialSecondsLeft = initialBlocksLeft * 15;
    setTimeLeft(initialSecondsLeft);

    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => Math.max(prevTimeLeft - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [current_block, next_snapshot_block]);

  const handleTakeSnapshot = async () => {
    try {
      const response = await backend.post(`/bonds/${bond_id}/create_snapshot`, { user_id, bond_id });
      if (response.status === 200) {
        onSnapshotTaken();
        setIsSnapshotTaken(true);
      }
    } catch (error) {
      console.error('Error taking snapshot:', error);
    }
  };

  const formatTime = (seconds) => {
    const years = Math.floor(seconds / (3600 * 24 * 365));
    const months = Math.floor((seconds % (3600 * 24 * 365)) / (3600 * 24 * 30));
    const days = Math.floor((seconds % (3600 * 24 * 30)) / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${years > 0 ? `${years}y ` : ''}${months > 0 ? `${months}mo ` : ''}${days > 0 ? `${days}d ` : ''}${hours}h ${mins}m ${secs}s`;
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>Next Snapshot Block:</Typography>
        <Typography variant="h5" gutterBottom>{next_snapshot_block}</Typography>
        {next_snapshot_block === 0 ? (
          <Typography variant="body1" color="textSecondary">Not currently eligible for snapshot</Typography>
        ) : (
          <>
            <Typography variant="body1" gutterBottom>Estimated Time Until Next Snapshot:</Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              {formatTime(timeLeft)}
            </Typography>
            <StyledButton
              variant="contained"
              onClick={handleTakeSnapshot}
              disabled={isSnapshotTaken || timeLeft > 0}
            >
              {isSnapshotTaken ? 'Snapshot Taken' : 'Take Snapshot'}
            </StyledButton>
          </>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default SnapshotCard;
