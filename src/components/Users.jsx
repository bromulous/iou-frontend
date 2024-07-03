import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import backend from "../api";
import { UserContext } from "../contexts/UserContext";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { currentUserId, setCurrentUserId } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [tokens, setTokens] = useState([]);
  const [openTokenDialog, setOpenTokenDialog] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenSymbol, setNewTokenSymbol] = useState("");
  const [newTokenSupply, setNewTokenSupply] = useState(10000000000);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
    fetchTokens();
  }, []);

  const handleOpenTokenDialog = () => {
    setOpenTokenDialog(true);
  };

  const handleCloseTokenDialog = () => {
    setOpenTokenDialog(false);
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
      setNewTokenSupply(10000000000);
      setOpenTokenDialog(false);
      fetchTokens();
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  const fetchUsers = async () => {
    const response = await backend.get("/users");
    setUsers(response.data);
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await backend.get("/current_user");
      setCurrentUser(response.data);
      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const switchUser = async (userId) => {
    try {
      await backend.post(`/users/${userId}/switch`);
      setCurrentUserId(userId);
      fetchCurrentUser();
    } catch (error) {
      console.error("Error switching user:", error);
    }
  };

  const fetchTokens = async () => {
    const response = await backend.get("/tokens");
    setTokens(response.data);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateUser = async () => {
    try {
      await backend.post("/users", { name: newUserName });
      setNewUserName("");
      setOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        User Profiles
      </Typography>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Box
              sx={{
                borderColor:
                  currentUser && currentUser.id === user.id
                    ? "blue"
                    : "transparent",
                borderWidth: currentUser && currentUser.id === user.id ? 8 : 0,
                borderStyle: "solid",
              }}
            >
              <Card
                style={
                  currentUser && currentUser.id === user.id
                    ? { borderColor: "blue", borderWidth: 8 }
                    : {}
                }
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <CardContent>
                  <Typography variant="h5">{user.name}</Typography>
                  <Typography variant="body2">ID: {user.id}</Typography>
                  {user.balances && (
                    <>
                      <Typography variant="h6">Balances:</Typography>
                      {Object.entries(user.balances).map(([token, balance]) => (
                        <Typography key={token} variant="body2">
                          {token}: {balance}
                        </Typography>
                      ))}
                    </>
                  )}
                  <Button onClick={() => switchUser(user.id)} color="primary">
                    Switch User
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card onClick={handleOpen}>
            <CardContent>
              <Typography variant="h1" align="center">
                +
              </Typography>
              <Typography variant="h6" align="center">
                Create a New User
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new user, please enter the details here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="User Name"
            fullWidth
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateUser} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4" gutterBottom>
        Tokens
      </Typography>
      <Grid container spacing={3}>
        {tokens.map((token) => (
          <Grid item xs={12} sm={6} md={4} key={token.contract_address}>
            <Card onClick={() => navigate(`/token/${token.contract_address}`)}>
              <CardContent>
                <Typography variant="h5">{token.name}</Typography>
                <Typography variant="body2">ID: {token.contract_address}</Typography>
                <Typography variant="body2">Symbol: {token.symbol}</Typography>
                <Typography variant="body2">
                  Supply: {token.total_supply}
                </Typography>
                {/* Display other token info here */}
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card onClick={handleOpenTokenDialog}>
            <CardContent>
              <Typography variant="h1" align="center">
                +
              </Typography>
              <Typography variant="h6" align="center">
                Create a New Token
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={openTokenDialog} onClose={handleCloseTokenDialog}>
        <DialogTitle>Create New Token</DialogTitle>
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
          <Button onClick={handleCloseTokenDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateToken} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
