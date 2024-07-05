import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Divider } from '@mui/material';
import backend from "../api";
import { UserContext } from "../contexts/UserContext";
import FRAX_icon from "../assets/FRAX_icon.webp";

const PaymentComponent = ({ total_principal_owed, total_penalty_owed, payment_token_address, user_id, bond_id, onPaymentSuccess }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', type: '' });
  const { currentUserId } = useContext(UserContext);

  useEffect(() => {
    const fetchUserBalanceAndApprovedAmount = async () => {
      try {
        const balanceResponse = await backend.get(`/balance/${payment_token_address}`, { params: { user_id: currentUserId } });
        const approvedAmountResponse = await backend.get(`/approved/${payment_token_address}`, { params: { user_id: currentUserId, spender_id: bond_id } });
        setUserBalance(balanceResponse.data.balance);
        setApprovedAmount(approvedAmountResponse.data.approvedAmount);
      } catch (error) {
        console.error('Error fetching balance or approved amount:', error);
      }
    };

    fetchUserBalanceAndApprovedAmount();
  }, [bond_id]);

  const handlePaymentAmountChange = (e) => {
    const value = e.target.value;
    setPaymentAmount(value);
  };

  const handleApprove = async () => {
    try {
      await backend.post(`/approve/${payment_token_address}`, { user_id: currentUserId, spender: bond_id, amount: paymentAmount });
      const approvedAmountResponse = await backend.get(`/approved/${payment_token_address}`, { params: { user_id: currentUserId, spender_id: bond_id } });
      setApprovedAmount(approvedAmountResponse.data.approvedAmount);
      setNotification({ open: true, message: 'Approval successful', type: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Approval failed', type: 'error' });
      console.error('Approval error:', error);
    }
  };

  const handlePayment = async () => {
    try {
      await backend.post(`/bonds/${bond_id}/deposit_payment?amount=${paymentAmount}`);
      setNotification({ open: true, message: 'Payment successful', type: 'success' });
      onPaymentSuccess(); // Refresh the data after payment
    } catch (error) {
      setNotification({ open: true, message: 'Payment failed', type: 'error' });
      console.error('Payment error:', error);
    }
  };

  const handleAmountClick = (amount) => {
    setPaymentAmount(amount);
  };

  const totalOwed = total_principal_owed + total_penalty_owed;
  const isPaymentDisabled = paymentAmount <= 0 || paymentAmount > totalOwed || paymentAmount > userBalance;
  const isApproveDisabled = paymentAmount <= approvedAmount;

  return (
    <Box p={3} boxShadow={2} borderRadius={4} width={300}>
      <Typography variant="h6">Payment</Typography>
      <Typography variant="body2">
        Total Principal Owed: 
        <span onClick={() => handleAmountClick(total_principal_owed)} style={{ cursor: 'pointer', }}>
          {total_principal_owed}
        </span>
      </Typography>
      <Typography variant="body2">
        Total Penalty Owed: 
        <span onClick={() => handleAmountClick(total_penalty_owed)} style={{ cursor: 'pointer', }}>
          {total_penalty_owed}
        </span>
      </Typography>
      <Divider style={{ margin: '10px 0' }} />
      <Typography variant="body2" gutterBottom>
        Total Owed: 
        <span onClick={() => handleAmountClick(totalOwed)} style={{ cursor: 'pointer', }}>
          {totalOwed}
        </span>
      </Typography>
      <TextField
        label="Amount to Pay"
        type="number"
        value={paymentAmount}
        onChange={handlePaymentAmountChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <Box display="flex" alignItems="center">
              <img src={FRAX_icon} alt="FRAX" width={24} height={24} />
            </Box>
          ),
        }}
      />
      <Typography variant="body2" gutterBottom>
        Available Balance: {userBalance}
      </Typography>
      {isApproveDisabled ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayment}
          fullWidth
          disabled={isPaymentDisabled}
        >
          Pay
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleApprove}
          fullWidth
          disabled={isPaymentDisabled}
        >
          Approve
        </Button>
      )}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ open: false, message: '', type: '' })}
        message={notification.message}
      />
    </Box>
  );
};

export default PaymentComponent;
