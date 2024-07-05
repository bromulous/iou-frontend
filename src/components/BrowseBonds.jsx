

import React, { useEffect, useState } from "react";
import {
    Button,
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
} from "@mui/material";
import { dummyBonds } from "../utils/dummyData";
import BondCardV2 from "./BondCardV2";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import backend from "../api";

const BrowseBonds = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [auctionStatus, setAuctionStatus] = useState("");
  const [minInterestRate, setMinInterestRate] = useState("");
  const [maxMaturityDate, setMaxMaturityDate] = useState("");
  const [bonds, setBonds] = useState([])

  const fetchBonds = async () => {
    const response = await backend.get('/bonds');
    setBonds(response.data);
  }

  useEffect(function(){
    fetchBonds();
  }, [])

  const filterBonds = (status) =>
    bonds.filter((bond) => {
      return (
        (!search || bond.issuer.toLowerCase().includes(search.toLowerCase())) &&
        (!type || bond.type === type) &&
        (!auctionStatus || bond.auctionStatus === auctionStatus) &&
        (!minInterestRate || bond.interestRate >= minInterestRate) &&
        (!maxMaturityDate ||
          new Date(bond.maturityDate) <= new Date(maxMaturityDate)) &&
        (status == bond.status)
      );
    });

  const sections = [
    { title: "Active Auctions", bonds: filterBonds("Auction Live") },
    { title: "Upcoming Auctions", bonds: filterBonds("Pre-Auction") },
    { title: "New Bonds", bonds: bonds.slice(0, 5) }, // Assuming new bonds are the latest 5 bonds
    {
      title: "Expiring Soon",
      bonds: bonds.filter(
        (bond) =>
          new Date(bond.maturityDate) <
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
    }, // Bonds expiring in the next 30 days
    { title: "Secondary Market", bonds: bonds.slice(5, 10) }, // Placeholder for secondary market bonds
    { title: "Past Bonds", bonds: filterBonds("Past") },
  ];

  return (
    <Box mt={5}>
      <Typography variant="h4" gutterBottom>
        Browse Bonds
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search by Project"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Non-convertible">Non-convertible</MenuItem>
                <MenuItem value="Convertible">Convertible</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Auction Status</InputLabel>
              <Select
                value={auctionStatus}
                onChange={(e) => setAuctionStatus(e.target.value)}
                label="Auction Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
                <MenuItem value="Past">Past</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Min Interest Rate"
              type="number"
              value={minInterestRate}
              onChange={(e) => setMinInterestRate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Max Maturity Date"
              type="date"
              value={maxMaturityDate}
              onChange={(e) => setMaxMaturityDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item>
            <IconButton color="primary">
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      {sections.map((section, index) => (
        <Box key={index} mb={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" gutterBottom>
              {section.title}
            </Typography>
            <Box>
              <IconButton>
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Box>
          <Grid
            container
            spacing={2}
            sx={{ overflowX: "auto", flexWrap: "nowrap" }}
          >
            {section.bonds.map((bond) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={bond.id}>
                <BondCardV2 bond={bond} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%" }}
              >
                <Button size="large" variant="outlined">
                  See More
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
      {bonds.length === 0 && (
        <Typography variant="body1" color="textSecondary">
          No bonds found matching the criteria.
        </Typography>
      )}
    </Box>
  );
};

export default BrowseBonds;
