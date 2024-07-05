import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import IssuerOwedBreakdownList from "./IssuerOwedBreakdownList";
import PaymentComponent from "./PaymentComponent";
import WithdrawFundsComponent from "./WithdrawFundsComponent";

const BondIssuerDetail = function({bond, bondId, currentUserId, fetchBondDetails}) {
    return (
        <Box mt={5}>
            <IssuerOwedBreakdownList records = {bond.total_issuer_owes_break_down} />
            <PaymentComponent total_principal_owed={bond.total_issuers_owes.total_principal_owed} total_penalty_owed={bond.total_issuers_owes.total_penalty_owed} payment_token_address={bond.bond_details.paymentTokenAddress} bond_id={bondId} onPaymentSuccess={fetchBondDetails} />
            <WithdrawFundsComponent token_price = {bond.bond_details.tokenPrice} has_withdrawn_funds={bond.withdrawn_funds} user_id = {currentUserId} supply = {bond.total_supply} bond_id = {bond.contract_address} available_funds={bond.funds_from_bond_purchase} onWithdrawSuccess={fetchBondDetails}/>
        </Box>
    )
}

export default BondIssuerDetail