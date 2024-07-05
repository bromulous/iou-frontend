import React, { useState, useEffect, useContext } from 'react';
import { Tabs, Tab, Box, Typography, Card, CardContent, Grid, CircularProgress, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import backend from '../api';
import { UserContext } from "../contexts/UserContext";
import { useParams } from 'react-router-dom';
import BondMainDetail from './BondMainDetail';
import BondIssuerDetail from './BondIssuerDetail';
import BondOwnerDetail from './BondOwnerDetail';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const BondDetailsTabbedComponent = () => {
  const { bondId } = useParams();
  const { currentUserId } = useContext(UserContext);
  const [value, setValue] = useState(0);
  const [bond, setBond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSnapshotTaken = () => {
    fetchBondDetails();
  };

  const fetchBondDetails = async () => {
    console.log("Fetching bond details");
    try {
      const res = await backend.get(`/bond/${bondId}`, {
        params: { user_id: currentUserId },
      });
      setBond(res.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBondDetails();
  }, [currentUserId, bondId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Dummy eligibility check
  const isEligibleForTab2 = currentUserId % 2 === 0;
  const isEligibleForTab3 = currentUserId % 3 === 0;

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error.message}</Alert>
      ) : (
        <>
          <Tabs value={value} onChange={handleChange} aria-label="bond details tabs">
            <Tab label="Bond Details" />
            {isEligibleForTab2 && <Tab label="Bond Holders" />}
            {isEligibleForTab3 && <Tab label="Manage Bond" />}
          </Tabs>
          <TabPanel value={value} index={0}>
            <Tab1Content bond={bond} bondId={bondId} currentUserId={currentUserId} handleSnapshotTaken={handleSnapshotTaken} refetchData={fetchBondDetails} />
          </TabPanel>
          {isEligibleForTab2 && (
            <TabPanel value={value} index={1}>
              <Tab2Content bond={bond} bondId={bondId} currentUserId={currentUserId} fetchBondDetails={fetchBondDetails} refetchData={fetchBondDetails} />
            </TabPanel>
          )}
          {isEligibleForTab3 && (
            <TabPanel value={value} index={2}>
              <Tab3Content bond={bond} bondId={bondId} currentUserId={currentUserId} fetchBondDetails={fetchBondDetails} refetchData={fetchBondDetails} />
            </TabPanel>
          )}
        </>
      )}
    </div>
  );
};

const Tab1Content = ({ bond, bondId, currentUserId, handleSnapshotTaken, refetchData }) => (
  <Card variant="outlined">
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <BondMainDetail bond={bond} bondId={bondId} currentUserId={currentUserId} handleSnapshotTaken={handleSnapshotTaken} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Tab2Content = ({ bond, bondId, currentUserId, fetchBondDetails, refetchData }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom>Tab 2 Content</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <BondOwnerDetail bond={bond} bondId={bondId} currentUserId={currentUserId} fetchBondDetails={fetchBondDetails} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Tab3Content = ({ bond, bondId, currentUserId, fetchBondDetails, refetchData }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom>Tab 3 Content</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <BondIssuerDetail bond={bond} bondId={bondId} currentUserId={currentUserId} fetchBondDetails={fetchBondDetails} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

BondDetailsTabbedComponent.propTypes = {
  userId: PropTypes.number.isRequired,
  bondId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number.isRequired,
};

export default BondDetailsTabbedComponent;
