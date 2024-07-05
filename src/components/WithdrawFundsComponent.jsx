import React, { useState } from 'react';
import { Button, Typography, Box, Snackbar, Divider } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import backend from '../api';

const WithdrawFundsComponent = ({ token_price, supply, user_id, bond_id, available_funds, has_withdrawn_funds, onWithdrawSuccess }) => {
  const [notification, setNotification] = useState({ open: false, message: '', type: '' });
  const totalFunds = supply * token_price;
  const saleDiscount = totalFunds - available_funds;
  const alreadyWithdrawn = has_withdrawn_funds ? available_funds : 0;
  const availableToWithdraw = has_withdrawn_funds ? 0 : available_funds;

  const handleWithdraw = async () => {
    try {
      await backend.post(`/users/${user_id}/withdraw_funds/${bond_id}`);
      setNotification({ open: true, message: 'Withdrawal successful', type: 'success' });
      onWithdrawSuccess(); // Refresh the data after withdrawal
    } catch (error) {
      setNotification({ open: true, message: 'Withdrawal failed', type: 'error' });
      console.error('Withdrawal error:', error);
    }
  };

  return (
    <Box p={3} boxShadow={2} borderRadius={4} width={300} bgcolor="white">
      <Typography variant="h6">Withdraw Funds</Typography>
      <Typography variant="body2">
        Total Funds: {totalFunds}
      </Typography>
      <Typography variant="body2">
        Sale Discount: {saleDiscount}
      </Typography>
      <Typography variant="body2">
        Already Withdrawn: {alreadyWithdrawn}
      </Typography>
      <Divider style={{ margin: '10px 0' }} />
      <Typography variant="body2" gutterBottom>
        Available Funds: {availableToWithdraw}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleWithdraw}
        fullWidth
        disabled={availableToWithdraw <= 0}
      >
        Withdraw
      </Button>
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ open: false, message: '', type: '' })}
        message={notification.message}
      />
    </Box>
  );
};

export default WithdrawFundsComponent;
