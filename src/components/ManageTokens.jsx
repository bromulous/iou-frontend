import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import backend from '../api';

const ManageTokens = ({ open, onClose }) => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');

  const handleCreateToken = async () => {
    await backend.post('/tokens', { name: tokenName, symbol: tokenSymbol, total_supply: parseFloat(tokenSupply) });
    setTokenName('');
    setTokenSymbol('');
    setTokenSupply('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New ERC20 Token</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create a new ERC20 token, please enter the name, symbol, and total supply of the token.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Token Name"
          fullWidth
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Token Symbol"
          fullWidth
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Total Supply"
          fullWidth
          type="number"
          value={tokenSupply}
          onChange={(e) => setTokenSupply(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateToken} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageTokens;
