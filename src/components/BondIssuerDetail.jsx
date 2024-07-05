import React from "react";
import { Box, Typography, Button } from "@mui/material";
import IssuerOwedBreakdownList from "./IssuerOwedBreakdownList";
import PaymentComponent from "./PaymentComponent";
import WithdrawFundsComponent from "./WithdrawFundsComponent";
import IssuerGoalProgress from "./IssuerGoalProgress";

const BondIssuerDetail = function({ bond, bondId, currentUserId, fetchBondDetails }) {
    const handleStartAuction = () => {
        // Logic to start the auction manually
    };

    const handleEndAuction = () => {
        // Logic to end the auction manually
    };

    const handleCancelBond = () => {
        // Logic to cancel the bond
    };

    const handlePauseWithdrawals = () => {
        // Logic to pause withdrawals
    };

    return (
        <Box >
            <Box display="flex" flexDirection="column" alignItems="flex-start" mb={3}>
                
                <Box mt={2}>
                    {bond.bond_status === 'Pre-Auction' && (
                        <Button variant="contained" color="primary" onClick={handleStartAuction}>
                            Manually Start IOU
                        </Button>
                    )}
                    {bond.bond_status === 'Auction Live' && (
                        <Box>
                            <Button variant="contained" color="secondary" onClick={handleEndAuction} style={{ marginRight: '10px' }}>
                                Manually End Auction
                            </Button>
                            <Button variant="contained" color="error" onClick={handleCancelBond}>
                                Cancel IOU
                            </Button>
                        </Box>
                    )}
                    {bond.bond_status === 'Bond Live' && (
                        <Button variant="contained" color="warning" onClick={handlePauseWithdrawals}>
                            Pause Withdrawals
                        </Button>
                    )}
                </Box>
            </Box>

            <Box mt={5}>
                <IssuerGoalProgress
                    description={bond.project_info.description}
                    totalAmount={bond.bond_details.totalAmount}
                    currentAmount={bond.total_supply}
                    totalValue={
                        bond.bond_details.totalAmount * bond.bond_details.tokenPrice
                    }
                    apr={bond.apr}
                    price={bond.current_auction_price}
                    balance={bond.remaining_tokens}
                    title={bond.bond_details.title}
                    issuer={bond.project_info.name}
                    bondStatus={bond.bond_status}
                    startDate={bond.auction_schedule.startDate}
                    duration={bond.auction_schedule.auctionDuration.days}
                    bond={bond}
                />
            </Box>
            
            {bond.total_issuer_owes_break_down.length > 0 && (
                <>
                    <Typography variant="h6" align="center">IOU Snapshots To Be Paid</Typography>
                    <IssuerOwedBreakdownList records={bond.total_issuer_owes_break_down} />
                </>
            )}

            <Box display="flex" justifyContent="center" mt={3}>
                <Box mr={2}>
                    <PaymentComponent
                        total_principal_owed={bond.total_issuers_owes.total_principal_owed}
                        total_penalty_owed={bond.total_issuers_owes.total_penalty_owed}
                        payment_token_address={bond.bond_details.paymentTokenAddress}
                        bond_id={bondId}
                        onPaymentSuccess={fetchBondDetails}
                    />
                </Box>
                <Box ml={2}>
                    <WithdrawFundsComponent
                        token_price={bond.bond_details.tokenPrice}
                        has_withdrawn_funds={bond.withdrawn_funds}
                        user_id={currentUserId}
                        supply={bond.total_supply}
                        bond_id={bond.contract_address}
                        available_funds={bond.funds_from_bond_purchase}
                        onWithdrawSuccess={fetchBondDetails}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default BondIssuerDetail;
