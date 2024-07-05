import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import SwapComponent from "./SwapComponent";
import GoalProgress from "./GoalProgress";
import SnapshotCard from "./SnapshotCard";
import UserSnapshotDetailsCard from "./UserSnapshotDetailsCard";

const BondMainDetail = function({bond, bondId, currentUserId, handleSnapshotTaken}){
    return (
        <Box mt={5}>
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
                title = {bond.bond_details.title}
                issuer={bond.project_info.name}
                bondStatus={bond.bond_status}
                startDate={bond.auction_schedule.startDate}
                duration={bond.auction_schedule.auctionDuration.days}
                bond={bond}
            />
        </Box>
    )
}

export default BondMainDetail;