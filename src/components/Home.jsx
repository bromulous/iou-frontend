import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Container,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DoneIcon from "@mui/icons-material/Done";

const Home = () => (
  <Box sx={{ flexGrow: 1 }}>
    
    <Container maxWidth="lg">
      <Box textAlign="center" mt={5} mb={5}>
        <Typography variant="h3" gutterBottom>
          Welcome to IOU Finance App
        </Typography>
        <Typography variant="h5">
          Your hub for decentralized bond issuance and trading.
        </Typography>
      </Box>
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Platform Highlights
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <TrendingUpIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={1}>
                Bonds Issued
              </Typography>
              <Typography variant="body1">500+</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <InsertChartIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={1}>
                Projects Funded
              </Typography>
              <Typography variant="body1">120</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <DoneIcon fontSize="large" color="primary" />
              <Typography variant="h6" mt={1}>
                Successful Payments
              </Typography>
              <Typography variant="body1">99%</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Explore Our Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Issue a Bond</Typography>
              <Typography variant="body1">
                Create and issue your own bonds on our platform.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href="/issue-bond"
                sx={{ mt: 2 }}
              >
                Issue a Bond
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Browse Bonds</Typography>
              <Typography variant="body1">
                Browse and invest in bonds issued by various projects.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href="/browse-bonds"
                sx={{ mt: 2 }}
              >
                Browse Bonds
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Manage Your Profile</Typography>
              <Typography variant="body1">
                View and manage your issued and invested bonds.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href="/profile"
                sx={{ mt: 2 }}
              >
                Manage Profile
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  </Box>
);

export default Home;
