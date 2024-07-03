import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import {
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import backend from "../api";

const UserMenu = ({ anchorEl, open, onClose, onUserSwitch }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenSymbol, setNewTokenSymbol] = useState("");
  const [newTokenSupply, setNewTokenSupply] = useState(0);
  const [users, setUsers] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [dialogType, setDialogType] = useState("");
  const navigate = useNavigate();
  const { currentUserId } = useContext(UserContext);

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchTokens();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const response = await backend.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await backend.get("/tokens");
      setTokens(response.data);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await backend.post("/users", { name: newUserName });
      setNewUserName("");
      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleCreateToken = async () => {
    try {
      await backend.post("/tokens", {
        name: newTokenName,
        symbol: newTokenSymbol,
        total_supply: newTokenSupply,
      });
      setNewTokenName("");
      setNewTokenSymbol("");
      setNewTokenSupply(1000000000);
      setDialogOpen(false);
      fetchTokens();
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  const handleAddFunds = async (userId) => {
    try {
      await backend.post(`/users/${userId}/add-funds`, {
        user_id: userId,
        token: selectedToken,
        amount: parseFloat(amount),
      });
      fetchUsers();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case "createToken":
        return (
          <>
            <DialogTitle>Create Token</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Token Name"
                fullWidth
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Token Symbol"
                fullWidth
                value={newTokenSymbol}
                onChange={(e) => setNewTokenSymbol(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Total Supply"
                type="number"
                fullWidth
                value={newTokenSupply}
                onChange={(e) => setNewTokenSupply(Number(e.target.value))}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateToken}>Create</Button>
            </DialogActions>
          </>
        );
      case "switchUser":
        return (
          <>
            <DialogTitle>Switch User</DialogTitle>
            <DialogContent>
              <List>
                {users.map((user) => (
                  <ListItem
                    button
                    key={user.id}
                    onClick={() => onUserSwitch(user.id)}
                  >
                    <ListItemText
                      primary={user.name}
                      secondary={`ID: ${user.id}`}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </>
        );
      case "addFunds":
        return (
          <>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Token</InputLabel>
                <Select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                >
                  {tokens.map((token) => (
                    <MenuItem key={token.contract_address} value={token.symbol}>
                      {token.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                label="Amount"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => handleAddFunds(1)}>Add Funds</Button>
            </DialogActions>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        {/* <MenuItem onClick={() => handleOpenDialog("createToken")}>
          Create Token
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog("switchUser")}>
          Switch User
        </MenuItem> */}
        <MenuItem onClick={() => navigate(`/profile/${currentUserId}`)}>Profile</MenuItem>
        {/* <MenuItem onClick={() => handleOpenDialog("addFunds")}>
          Add Funds
        </MenuItem> */}
        <MenuItem onClick={() => navigate('/users')}>Users</MenuItem>
        {/* <MenuItem onClick={onClose}>Activity</MenuItem> */}
        <MenuItem onClick={() => navigate('/issue-bond')}>Issue Bond</MenuItem>
        <MenuItem onClick={onClose}>Disconnect Wallet</MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        {renderDialogContent()}
      </Dialog>
    </div>
  );
};

export default UserMenu;
