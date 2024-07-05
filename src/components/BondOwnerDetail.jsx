import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ClaimAllCard from "./ClaimAllCard";
import ClaimSnapShotDetails from "./UserSnapshotDetailsCard";
import ExpectedSnapshotGrid from "./ExpectedSnapshotGrid";

const BondOwnerDetail = function({bond, bondId, currentUserId, fetchBondDetails}) {

    return (
        <Box mt={5}>
            {/* <ClaimAllCard snapshots = {bond.amount_user_entitled_to_and_claimable} userId = {currentUserId} bondId = {bondId} claimCallback = {fetchBondDetails} /> */}
            <ExpectedSnapshotGrid expectedSnapshots={bond.expected_snapshots_details} />
            <ClaimSnapShotDetails snapshots = {bond.amount_user_entitled_to_and_claimable} userId = {currentUserId} bondId = {bondId} claimCallback = {fetchBondDetails} />
        </Box>
    )
}

export default BondOwnerDetail