import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import SwapComponent from "./SwapComponent";
import GoalProgress from "./GoalProgress";
import SnapshotCard from "./SnapshotCard";
import UserSnapshotDetailsCard from "./UserSnapshotDetailsCard";

const BondMainDetail = function({bond, bondId, currentUserId, handleSnapshotTaken}){
    return (
        <Box mt={5}>
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
            </Typography>
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
            <Button
                variant="contained"
                color="primary"
                href={bond.project_info.website}
                target="_blank"
                sx={{ mt: 2 }}
                >
                View Project
            </Button>
        </Box>
    )
}

export default BondMainDetail;