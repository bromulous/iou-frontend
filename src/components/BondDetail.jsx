import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
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
      <Typography variant="h4" gutterBottom>
        {bond.issuer}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {bond.bond_details.title}
      </Typography>
      <Typography variant="body1" paragraph>
        Total Supply: {bond.total_supply}
        <br />
        Total Amount: {bond.bond_details.totalAmount}
        <br />
        Token Price: {bond.bond_details.tokenPrice}
        <br />
        Interest Rate: {bond.bond_details.interestRate}%
        <br />
        APR: {bond.apr}%
        <br />
        Purpose: {bond.project_info.description}
        <br />
        Auction Type: {bond.auction_schedule.auctionType}
        <br />
        Auction Duration: {bond.auction_schedule.auctionDuration.days} days{" "}
        {bond.auction_schedule.auctionDuration.hours} hours
        <br />
        Bond Status: {bond.bond_status}
        <br />
        <SwapComponent
          sendTokenSymbol={"FRAX"}
          sendTokenAddress={bond.bond_details.paymentTokenAddress}
          receiveTokenSymbol={bond.bond_details.tokenSymbol}
          receiveTokenAddress={bond.contract_address}
          purchasePrice={bond.current_auction_price}
          bond_status={bond.bond_status}
        />
        <GoalProgress
          description={bond.project_info.description}
          totalAmount={bond.bond_details.totalAmount}
          currentAmount={bond.total_supply}
          totalValue={
            bond.bond_details.totalAmount * bond.bond_details.tokenPrice
          }
          apr={bond.apr}
          price={bond.current_auction_price}
          balance={bond.remaining_tokens}
        />
        <SnapshotCard user_id={currentUserId} bond_id={bondId} current_block={bond.current_block} next_snapshot_block={bond.next_eligible_snapshot} onSnapshotTaken={handleSnapshotTaken} />
        <UserSnapshotDetailsCard snapshot = {bond.amount_user_entitled_to_and_claimable} />
        <ClaimAllCard snapshots = {bond.amount_user_entitled_to_and_claimable} userId = {currentUserId} bondId = {bondId} claimCallback = {fetchBondDetails} />
        <IssuerOwedBreakdownList records = {bond.total_issuer_owes_break_down} />
        <PaymentComponent total_principal_owed={bond.total_issuers_owes.total_principal_owed} total_penalty_owed={bond.total_issuers_owes.total_penalty_owed} payment_token_address={bond.bond_details.paymentTokenAddress} bond_id={bondId} onPaymentSuccess={fetchBondDetails} />
        <WithdrawFundsComponent token_price = {bond.bond_details.tokenPrice} has_withdrawn_funds={bond.withdrawn_funds} user_id = {currentUserId} supply = {bond.total_supply} bond_id = {bond.contract_address} available_funds={bond.funds_from_bond_purchase} onWithdrawSuccess={fetchBondDetails}/>
        <Button
          variant="contained"
          color="primary"
          href={bond.project_info.website}
          target="_blank"
          sx={{ mt: 2 }}
        >
          View Project
        </Button>
      </Typography>
    </Box>
  );
};

export default BondDetail;
