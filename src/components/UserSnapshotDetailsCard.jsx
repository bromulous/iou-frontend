import React from 'react';
import ClaimAllCard from './ClaimAllCard';
import { Card, CardContent, Container, Typography } from '@mui/material';

const UserSnapshotDetailsCard = ({ snapshot: snapshots }) => {
  return (
    <Card style={{ marginBottom: '1rem' }}>
      <CardContent>
        <Typography variant="h6">Snapshot Block: {snapshots.snapshot_block}</Typography>
        <Typography variant="body1">Principal Owed: {snapshots.principal_owed}</Typography>
        <Typography variant="body1">Penalty Owed: {snapshots.penalty_owed}</Typography>
        <Typography variant="body1">Amount Already Claimed: {snapshots.amount_already_claimed}</Typography>
        <Typography variant="body1">Available to Claim: {snapshots.available_to_claim}</Typography>
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
      {snapshots.map((snapshot, index) => (
        <UserSnapshotDetailsCard
          key={index}
          snapshot={snapshot}
        />
      ))}
      <ClaimAllCard snapshots={snapshots} userId={userId} bondId={bondId} claimCallback={claimCallback} />
    </Container>
  );
};

export default ClaimSnapShotDetails;
