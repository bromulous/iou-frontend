import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import backend from '../api';

const ClaimAllCard = ({ snapshots, userId, bondId, claimCallback }) => {
  const totalAmount = snapshots.reduce((acc, snapshot) => acc + snapshot.available_to_claim, 0);

  const handleClaimAll = async () => {
    try {
      await backend.post(`/bonds/${bondId}/claim_payment/${userId}`);
      // Call the claim callback
      claimCallback();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" marginTop="2rem">
      <Card style={{ maxWidth: '400px', width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
            Total Amount Available to Claim
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom style={{ fontSize: '2.5rem' }}>
            {totalAmount.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClaimAll}
            disabled={totalAmount <= 0}
            fullWidth
            style={{
              padding: '0.75rem',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Claim All
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClaimAllCard;
