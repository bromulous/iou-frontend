import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Typography, Box, Snackbar, IconButton } from '@mui/material';
import { SwapVert as SwapIcon } from '@mui/icons-material';
import backend from "../api";
import { UserContext } from "../contexts/UserContext";
import FRAX_icon from "../assets/FRAX_icon.webp";

const SwapComponent = ({ sendTokenSymbol, receiveTokenSymbol, sendTokenAddress, receiveTokenAddress, purchasePrice, bond_status, bond }) => {
  const [sendAmount, setSendAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sendBalance, setSendBalance] = useState(0);
  const [receiveBalance, setReceiveBalance] = useState(0);
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', type: '' });
  const { currentUserId } = useContext(UserContext);

  useEffect(() => {
    const fetchBalancesAndApprovals = async () => {
      try {
        const sendBalanceResponse = await backend.get(`/balance/${sendTokenAddress}`, { params: { user_id: currentUserId } });
        const receiveBalanceResponse = await backend.get(`/balance/${receiveTokenAddress}`, { params: { user_id: currentUserId } });
        const approvedAmountResponse = await backend.get(`/approved/${sendTokenAddress}`, { params: { user_id: currentUserId, spender_id: receiveTokenAddress } });

        setSendBalance(sendBalanceResponse.data.balance);
        setReceiveBalance(receiveBalanceResponse.data.balance);
        setApprovedAmount(approvedAmountResponse.data.approvedAmount);
      } catch (error) {
        console.error('Error fetching balances or approvals:', error);
      }
    };

    fetchBalancesAndApprovals();
  }, [sendTokenAddress, receiveTokenAddress]);

  const handleSendAmountChange = async (e) => {
    const value = e.target.value;
    setSendAmount(value);
    setReceiveAmount(value / purchasePrice);

    // Re-fetch the approved amount to check if it's still sufficient
    try {
      const approvedAmountResponse = await backend.get(`/approved/${sendTokenAddress}`, { params: { user_id: currentUserId, spender_id: receiveTokenAddress } });
      setApprovedAmount(approvedAmountResponse.data.approvedAmount);
    } catch (error) {
      console.error('Error fetching approved amount:', error);
    }
  };

  const handleReceiveAmountChange = async (e) => {
    const value = e.target.value;
    setReceiveAmount(value);
    setSendAmount(value * purchasePrice);

    // Re-fetch the approved amount to check if it's still sufficient
    try {
      const approvedAmountResponse = await backend.get(`/approved/${sendTokenAddress}`, { params: { user_id: currentUserId, spender_id: receiveTokenAddress } });
      setApprovedAmount(approvedAmountResponse.data.approvedAmount);
    } catch (error) {
      console.error('Error fetching approved amount:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await backend.post(`/approve/${sendTokenAddress}`, { user_id: currentUserId, spender: receiveTokenAddress, amount: sendAmount });
      const approvedAmountResponse = await backend.get(`/approved/${sendTokenAddress}`, { params: { user_id: currentUserId, spender_id: receiveTokenAddress } });
      setApprovedAmount(approvedAmountResponse.data.approvedAmount);
      setNotification({ open: true, message: 'Approval successful', type: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Approval failed', type: 'error' });
      console.error('Approval error:', error);
    }
  };

  const handleSwap = async () => {
    try {
      await backend.post(`/purchase_bond/${receiveTokenAddress}`, {
        payment_token_address: sendTokenAddress,
        bond_id: receiveTokenAddress,
        payment_token_amount: sendAmount,
        bond_token_amount: receiveAmount,
        user_id: currentUserId
      });
      setSendBalance((prev) => prev - sendAmount);
      setApprovedAmount((prev) => prev - sendAmount);
      setReceiveBalance((prev) => prev + receiveAmount);
      setNotification({ open: true, message: 'Swap successful', type: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Swap failed', type: 'error' });
      console.error('Swap error:', error);
    }
  };

  const isSwapDisabled = sendAmount > sendBalance || sendAmount <= 0 || receiveAmount <= 0 || bond_status !== 'Auction Live';
  const isApproveDisabled = sendAmount <= approvedAmount;

  if(bond_status != "Auction Live") {
    return null
  }
  return (
    <Box p={3} boxShadow={2} borderRadius={4} width={300}>
      <Typography variant="h6">Token Swap</Typography>
      <TextField
        label="Send"
        type="number"
        value={sendAmount}
        onChange={handleSendAmountChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <Box display="flex" alignItems="center">
              <img src={FRAX_icon} alt={sendTokenSymbol} width={24} height={24} />
              <Typography variant="body2">{sendTokenSymbol}</Typography>
            </Box>
          ),
        }}
      />
      <Typography variant="body2" align="right">
        Balance: {sendBalance}
      </Typography>
      <IconButton>
        <SwapIcon />
      </IconButton>
      <TextField
        label="Receive"
        type="number"
        value={receiveAmount}
        onChange={handleReceiveAmountChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <Box display="flex" alignItems="center">
              <img src={bond.project_info.imageUrl} alt={receiveTokenSymbol} width={24} height={24} />
              <Typography variant="body2">{receiveTokenSymbol}</Typography>
            </Box>
          ),
        }}
      />
      <Typography variant="body2" align="right">
        Balance: {receiveBalance}
      </Typography>
      {isApproveDisabled ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSwap}
          fullWidth
          disabled={isSwapDisabled}
        >
          Swap
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleApprove}
          fullWidth
          disabled={isSwapDisabled}
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
      <Typography variant="caption" display="block" align="center" marginTop={2}>
        1 {receiveTokenSymbol} = {purchasePrice} {sendTokenSymbol}
      </Typography>
    </Box>
  );
};

export default SwapComponent;
