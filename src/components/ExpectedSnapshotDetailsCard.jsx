import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const ExpectedSnapshotDetailsCard = ({ snapshot }) => {
  const { snapshot_block, principal_due, interest_due, token_balance, date } = snapshot;
  const expected_earnings = token_balance * (principal_due + interest_due);

  return (
    <Card sx={{ minWidth: 275, margin: 1, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Snapshot Block: {snapshot_block}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Date: {date}
        </Typography>
        <Typography variant="body2">
          Principal Due: {principal_due}
          <br />
          Interest Due: {interest_due}
          <br />
          Token Balance: {token_balance}
          <br />
          Expected Earnings: {expected_earnings.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ExpectedSnapshotDetailsCard;
