import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const IssuerOwedBreakdownCard = ({ record }) => {
  const { snapshot_block, principal_owed, penalty_owed } = record;

  return (
    <Card variant="outlined" sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Snapshot Block: {snapshot_block}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Principal Owed: ${principal_owed.toFixed(2)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Penalty Owed: ${penalty_owed.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const IssuerOwedBreakdownList = ({ records }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {records.map((record, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <IssuerOwedBreakdownCard record={record} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IssuerOwedBreakdownList;