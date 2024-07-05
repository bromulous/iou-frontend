import React from 'react';
import ClaimAllCard from './ClaimAllCard';
import { Card, CardContent, Container, Typography, Grid, Box } from '@mui/material';

const UserSnapshotDetailsCard = ({ snapshot }) => {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h6">Snapshot Block: {snapshot.snapshot_block}</Typography>
        <Typography variant="body1">Principal Owed: {snapshot.principal_owed}</Typography>
        <Typography variant="body1">Penalty Owed: {snapshot.penalty_owed}</Typography>
        <Typography variant="body1">Amount Already Claimed: {snapshot.amount_already_claimed}</Typography>
        <Typography variant="body1">Available to Claim: {snapshot.available_to_claim}</Typography>
      </CardContent>
    </Card>
  );
};

const ClaimSnapShotDetails = ({ snapshots, userId, bondId, claimCallback }) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Claimable Amounts
      </Typography>
      <Grid container spacing={2}>
        {snapshots.map((snapshot, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <UserSnapshotDetailsCard snapshot={snapshot} />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={3}>
        <ClaimAllCard snapshots={snapshots} userId={userId} bondId={bondId} claimCallback={claimCallback} />
      </Box>
    </Container>
  );
};

export default ClaimSnapShotDetails;
