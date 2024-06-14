import React, { useContext } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "../index.css"; // Ensure this path is correct
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUserId } = useContext(UserContext);

  return (
    <Box className="landing-page">
      <Box className="overlay" />
      <Box className="content" textAlign="center">
        <Typography variant="h3" gutterBottom>
          Welcome to IOU Finance
        </Typography>
        <Typography variant="h6" gutterBottom>
          Revolutionizing decentralized finance with on-chain bonds.
        </Typography>
        <Box mt={3}>
          <Button variant="contained" color="primary" size="large" href="/browse-bonds">
            ENTER APP
          </Button>
        </Box>
        <Box mt={5}>
          <Typography variant="h4" gutterBottom>
            Platform Highlights
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              >
                <TrendingUpIcon color="primary" fontSize="large" />
                <Typography variant="h6">Bonds Issued</Typography>
                <Typography variant="body1">500+</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              >
                <AccountBalanceIcon color="primary" fontSize="large" />
                <Typography variant="h6">Projects Funded</Typography>
                <Typography variant="body1">120</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              >
                <CheckCircleIcon color="primary" fontSize="large" />
                <Typography variant="h6">Successful Payments</Typography>
                <Typography variant="body1">99%</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <Box mt={5}>
          <Typography variant="h4" gutterBottom>
            Explore Our Features
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              >
                <Typography variant="h6">Issue a Bond</Typography>
                <Typography variant="body2">
                  Create and issue your own bonds on our platform.
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/issue-bond"
                  >
                    ISSUE A BOND
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              >
                <Typography variant="h6">Browse Bonds</Typography>
                <Typography variant="body2">
                  Browse and invest in bonds issued by various projects.
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/browse-bonds"
                  >
                    BROWSE BONDS
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              >
                <Typography variant="h6">Manage Your Profile</Typography>
                <Typography variant="body2">
                  View and manage your issued and invested bonds.
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/profile/${currentUserId}`)}
                  >
                    MANAGE PROFILE
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
