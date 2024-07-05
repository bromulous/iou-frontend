import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Grid, Divider } from '@mui/material';
import SwapComponent from './SwapComponent';
import SnapshotCard from './SnapshotCard';

const GoalProgress = ({ description, totalAmount, currentAmount, totalValue, apr, price, balance, title, issuer, duration, bondStatus, startDate, bond, currentUserId, bondId, fetchBondDetails }) => {
    const progress = (currentAmount / totalAmount) * 100;

    const date = new Date(startDate);

    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric',
        second: 'numeric',
        hour12: true // Set to false for 24-hour time format
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    return (
        <Card style={{ maxWidth: 600, margin: '20px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px'}}>
            <CardContent>
                <Typography variant="h2" color="primary" gutterBottom>
                    {title} ({bond.bond_details.tokenSymbol})
                </Typography>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                    Issued By: {issuer}
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    Purpose: {description}
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    APR: {apr.toFixed(2)}%
                </Typography>
                <Box mt={2} mb={2}>
                    <Divider />
                </Box>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                        <Typography variant="h4" color="textSecondary">
                            Total Amount Raised
                        </Typography>
                        <Box mt={1} mb={1}>
                            <LinearProgress variant="determinate" value={progress} style={{ height: '10px', borderRadius: '5px' }} />
                        </Box>
                        <Typography variant="h6">
                            ${currentAmount.toLocaleString()} / ${totalValue.toLocaleString()}
                        </Typography>
                    </Grid>
                </Grid>
                <Box mt={2} mb={2}>
                    <Divider />
                </Box>
                <Typography variant="h4" gutterBottom>{bondStatus}</Typography>
                <Typography variant="h7" gutterBottom>Auction Start Date: {formattedDate}</Typography>
                <br />
                <Typography variant="h7" gutterBottom>Auction Duration: {duration} Days</Typography>
                <br />
                <br />
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                >
                    {bondStatus === 'Bond Live' ? (
                        <SnapshotCard 
                            user_id={currentUserId} 
                            bond_id={bondId} 
                            current_block={bond.current_block} 
                            next_snapshot_block={bond.next_eligible_snapshot} 
                            onSnapshotTaken={fetchBondDetails} 
                        />
                    ) : (
                        <SwapComponent
                            sendTokenSymbol={"FRAX"}
                            sendTokenAddress={bond.bond_details.paymentTokenAddress}
                            receiveTokenSymbol={bond.bond_details.tokenSymbol}
                            receiveTokenAddress={bond.contract_address}
                            purchasePrice={bond.current_auction_price}
                            bond_status={bond.bond_status}
                            bond={bond}
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default GoalProgress;
