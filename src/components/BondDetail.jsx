import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, CircularProgress, Tab } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import backend from "../api";
import { UserContext } from "../contexts/UserContext";
import SwapComponent from "./SwapComponent";
import GoalProgress from "./GoalProgress";
import SnapshotCard from "./SnapshotCard";
import UserSnapshotDetailsCard from "./UserSnapshotDetailsCard";
import ClaimAllCard from "./ClaimAllCard";
import IssuerOwedBreakdownList from "./IssuerOwedBreakdownList";
import PaymentComponent from "./PaymentComponent";
import WithdrawFundsComponent from "./WithdrawFundsComponent";
import BondOwnerDetail from "./BondOwnerDetail";
import BondIssuerDetail from "./BondIssuerDetail";
import BondMainDetail from "./BondMainDetail";

const BondDetail = () => {
  const { bondId } = useParams();
  const navigate = useNavigate();
  const [bond, setBond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUserId } = useContext(UserContext);

  const handleSnapshotTaken = () => {
    fetchBondDetails();
  };

  const fetchBondDetails = async () => {
    console.log("Fetching bond details");
    const body = {
      user_id: currentUserId,
    };
    try {
      const res = await backend.get(`/bond/${bondId}`, {
        params: { user_id: currentUserId },
      });
      setBond(res.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
   fetchBondDetails();
  }, [bondId]);

  if (loading) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={5}>
        <Typography variant="body1" color="error">
          Error loading bond details.
        </Typography>
      </Box>
    );
  }

  if (!bond) {
    return (
      <Box mt={5}>
        <Typography variant="body1" color="textSecondary">
          Bond not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={5}>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Back to Bonds
        </Button>
        <BondMainDetail bond={bond} bondId={bondId} currentUserId={currentUserId} handleSnapshotTaken={handleSnapshotTaken} />
        <BondOwnerDetail bond = {bond} bondId = {bondId} currentUserId={currentUserId} fetchBondDetails={fetchBondDetails} />
        <BondIssuerDetail bond= {bond} bondId={bondId} currentUserId={currentUserId} fetchBondDetails={fetchBondDetails} />
    </Box>
  );
};

export default BondDetail;
