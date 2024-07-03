import React, { useEffect, useState } from "react";
import backend from "../api";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BondCardV2 from "./BondCardV2";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await backend.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
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

  useEffect(() => {
    fetchUser();
    fetchTokens();
  }, [userId]);

  const addFunds = async () => {
    try {
      const response = await backend.post(`/users/${userId}/add-funds`, {
        user_id: userId,
        token: selectedToken,
        amount: parseFloat(amount),
      });

      if (response.data.message === "Funds added successfully") {
        setSelectedToken("");
        setAmount(0);
        setDialogOpen(false);
        fetchUser(); // Fetch updated user data
      }
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const deleteDraft = async (draftId) => {
    try {
      await backend.delete(`/users/${userId}/delete_draft/${draftId}`);
      setDeleteDialogOpen(false);
      fetchUser(); // Fetch updated user data
    } catch (error) {
      console.error("Error deleting draft bond:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleDraftClick = (draft) => {
    navigate("/issue-bond", { state: { bond: draft } });
  };

  const handleDraftEditClick = (draft) => {
    navigate("/issue-bond", { state: { bond: draft } });
  };

  const handleDraftDeleteClick = (draft) => {
    setDraftToDelete(draft.draft_id);
    setDeleteDialogOpen(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {user.name}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        Add Funds
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
          <Button onClick={addFunds}>Add Funds</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this draft bond?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => deleteDraft(draftToDelete)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Tokens Held
        </Typography>
        <Grid container spacing={2}>
          {user.tokens_held.map((token) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={token.contract_address}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{token.name}</Typography>
                  <Typography variant="body2">
                    Balance: {token.balances[userId]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Bonds Purchased
        </Typography>
        <Grid container spacing={2}>
          {user.bonds_purchased.map((bond) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={bond.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{bond.name}</Typography>
                  <Typography variant="body2">
                    Balance: {bond.balances[userId]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Bonds Created
        </Typography>
        <Grid container spacing={2}>
          {user.bonds_created.map((bond) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={bond.id}>
              <BondCardV2 bond={bond} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Link to="/issue-bond" style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h6">+</Typography>
                  <Typography variant="body2">Create Bond</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Draft Bonds
        </Typography>
        <Grid container spacing={2}>
          {user.draft_bonds.map((draft, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" flexDirection="column">
                    <Box onClick={() => handleDraftClick(draft)}>
                      {draft.project_info.imageUrl && (
                        <Box
                          component="img"
                          src={draft.project_info.imageUrl}
                          alt={draft.bond_details.title}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            marginBottom: 1,
                          }}
                        />
                      )}
                      <Typography variant="h6">
                        {draft.bond_details.title}
                      </Typography>
                      <Typography variant="body2">
                        Type: {draft.bond_details.type || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Face Value: {draft.bond_details.totalAmount}
                      </Typography>
                      <Typography variant="body2">
                        Maturity Date:{" "}
                        {draft.bond_details.maturityDate || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Interest Rate: {draft.bond_details.interestRate}%
                      </Typography>
                      <Typography variant="body2">
                        APR: {draft.bond_details.apr || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Auction Status: {(draft.is_draft && "Draft") || "N/A"}
                      </Typography>
                    </Box>
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleDraftEditClick(draft)}
                        sx={{ flexGrow: 1, marginRight: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDraftDeleteClick(draft)}
                        sx={{ flexGrow: 1 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Profile;
