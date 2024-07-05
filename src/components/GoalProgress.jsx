import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Grid, Divider } from '@mui/material';

const GoalProgress = ({ description, totalAmount, currentAmount, totalValue, apr, price, balance }) => {
    const progress = (currentAmount / totalAmount) * 100;

    return (
        <Card style={{ maxWidth: 600, margin: '20px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <CardContent>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    {description}
                </Typography>
                <Box mt={2} mb={2}>
                    <Divider />
                </Box>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Total Value Locked
                        </Typography>
                        <Box mt={1} mb={1}>
                            <LinearProgress variant="determinate" value={progress} style={{ height: '10px', borderRadius: '5px' }} />
                        </Box>
                        <Typography variant="h6">
                            ${totalAmount.toLocaleString()} / ${totalValue.toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Est. Daily Pool Rewards
                        </Typography>
                        <Typography variant="h5" color="primary">
                            {apr} PENDLE
                        </Typography>
                    </Grid>
                </Grid>
                <Box mt={2} mb={2}>
                    <Divider />
                </Box>
                <Typography variant="body2">Current Amount: {currentAmount.toLocaleString()}</Typography>
                <Typography variant="body2">Price: {price}</Typography>
                <Typography variant="body2">Balance: {balance}</Typography>
            </CardContent>
        </Card>
    );
}

export default GoalProgress;
