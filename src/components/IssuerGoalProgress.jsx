import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Grid, Divider } from '@mui/material';

const IssuerGoalProgress = ({ description, totalAmount, currentAmount, totalValue, apr, title, issuer, duration, bondStatus, startDate, nextSnapshot, bond }) => {
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
        <Box mt={4}>
            <Card style={{ margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px'}}>
                <CardContent>
                    <Typography variant="h4" color="primary" gutterBottom>
                        {title} ({bond.bond_details.tokenSymbol})
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Issued By: {issuer}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        Purpose: {description}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        APR: {apr.toFixed(2)}%
                    </Typography>
                    <Box mt={2} mb={2}>
                        <Divider />
                    </Box>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h5" color="textSecondary">
                                Total Amount Raised
                            </Typography>
                            <Box mt={1} mb={1}>
                                <LinearProgress variant="determinate" value={progress} style={{ height: '10px', borderRadius: '5px' }} />
                            </Box>
                            <Typography variant="subtitle1">
                                ${currentAmount.toLocaleString()} / ${totalValue.toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box mt={2} mb={2}>
                        <Divider />
                    </Box>
                    <Typography variant="h5" gutterBottom>{bondStatus}</Typography>
                    <Typography variant="body1" gutterBottom>Auction Start Date: {formattedDate}</Typography>
                    <Typography variant="body1" gutterBottom>Auction Duration: {duration} Days</Typography>
                    {bondStatus === "Bond Live" && (
                        <Typography variant="body1" gutterBottom>Next Snapshot: {nextSnapshot}</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default IssuerGoalProgress;
