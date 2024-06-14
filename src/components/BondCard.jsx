import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Avatar,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const BondCard = ({ bond }) => (
  <Card
    sx={{
      minWidth: 275,
      mb: 2,
      boxShadow: 3,
      borderRadius: 2,
      borderColor: "divider",
    }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={bond.logo}
          alt={`${bond.issuer} logo`}
          sx={{ mr: 1, width: 48, height: 48 }}
        />
        <Typography variant="h6" component="div">
          {bond.issuer}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Type: {bond.type}
      </Typography>
      <Typography variant="body2">
        Face Value: {bond.faceValue}
        <br />
        Maturity Date: {bond.maturityDate}
        <br />
        Interest Rate: {bond.interestRate}%
        <br />
        APR: {bond.apr}%
        <br />
        Auction Status: {bond.auctionStatus}
      </Typography>
    </CardContent>
    <CardActions>
      <Button
        size="small"
        href={`/bond/${bond.id}`}
        sx={{ textTransform: "none" }}
        endIcon={<ArrowForwardIosIcon />}
      >
        Learn More
      </Button>
    </CardActions>
  </Card>
);

export default BondCard;
