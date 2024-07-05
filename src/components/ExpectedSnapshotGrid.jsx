import React, { useState } from 'react';
import { Grid, Typography, Box, Button, Collapse } from '@mui/material';
import ExpectedSnapshotDetailsCard from './ExpectedSnapshotDetailsCard';

const ExpectedSnapshotGrid = ({ expectedSnapshots = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Determine how many items to show when collapsed
  const displayedSnapshots = expanded ? expectedSnapshots : expectedSnapshots.slice(0, 4);

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Expected Snapshots
      </Typography>
      <Button variant="contained" onClick={toggleExpand} sx={{ mb: 3 }}>
        {expanded ? 'Show Less' : 'Show More'}
      </Button>
      <Grid container spacing={3}>
        {expectedSnapshots.length > 0 ? (
          displayedSnapshots.map((snapshot, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ExpectedSnapshotDetailsCard snapshot={snapshot} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 3 }}>
            No expected snapshots available.
          </Typography>
        )}
      </Grid>
      {!expanded && expectedSnapshots.length > 4 && (
        <Typography variant="body1" sx={{ mt: 3 }}>
          {expectedSnapshots.length - 4} more snapshots not shown. Click "Show More" to view all.
        </Typography>
      )}
    </Box>
  );
};

export default ExpectedSnapshotGrid;
