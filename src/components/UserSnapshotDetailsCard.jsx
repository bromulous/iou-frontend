import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

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

export default UserSnapshotDetailsCard;
