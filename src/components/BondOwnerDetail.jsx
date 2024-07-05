import React from "react";
import { Box } from "@mui/material";
import ClaimAllCard from "./ClaimAllCard";
import ClaimSnapShotDetails from "./UserSnapshotDetailsCard";
import ExpectedSnapshotGrid from "./ExpectedSnapshotGrid";
import SnapshotCard from "./SnapshotCard";

const BondOwnerDetail = function({ bond, bondId, currentUserId, fetchBondDetails }) {

    const isBondLive = bond.bond_status === "Bond Live";

    return (
        <Box mt={5}>
            {isBondLive && (
                <SnapshotCard
                    user_id={currentUserId}
                    bond_id={bondId}
                    current_block={bond.current_block}
                    next_snapshot_block={bond.next_eligible_snapshot}
                    onSnapshotTaken={fetchBondDetails}
                />
            )}
            <ExpectedSnapshotGrid expectedSnapshots={bond.expected_snapshots_details} />
            <ClaimSnapShotDetails
                snapshots={bond.amount_user_entitled_to_and_claimable}
                userId={currentUserId}
                bondId={bondId}
                claimCallback={fetchBondDetails}
            />
        </Box>
    );
}

export default BondOwnerDetail;
