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
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const BondCardV2 = ({ bond }) => {
  const {
    contract_address,
    name,
    status,
    apr,
    interest,
    duration,
    token_price,
    tokens,
    total_amount,
    total_supply,
    auction_start_block,
    auction_end_block,
    next_snap_shot_block,
    image_url,
    late_penalty
  } = bond;

  const displayDuration = `${duration.years}y ${duration.months}m ${duration.days}d`;

  const displayFaceValue =
    status === "Auction Live" ? `Total Raised: ${total_amount} Frax` : 
    status === "Bond Live" ? `Total Supply: ${total_supply} Frax` : 
    `Face Value: ${total_amount} Frax`;

  const displayAPR = status === "Auction Live" ? apr : interest;

  const displayEndDate = status === "Bond Live" && auction_end_block !== 0 ? (
    new Date((auction_end_block + duration.days * 86400 + duration.months * 2592000 + duration.years * 31536000) * 1000).toLocaleDateString()
  ) : "N/A";

  return (
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
            src={image_url}
            alt={`${name} logo`}
            sx={{ mr: 1, width: 48, height: 48 }}
          />
          <Typography variant="h6" component="div">
            {name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Type: Non-convertible
        </Typography>
        <Typography variant="body2">
          {displayFaceValue}
          <br />
          Maturity Date: {displayEndDate}
          <br />
          Interest Rate: {interest}%
          <br />
          APR: {displayAPR}%
          <br />
          Status: {status}
          <br />
          Duration: {displayDuration}
          <br />
          Late Penalty: {late_penalty}%
          <br />
          Auction Start Block: {auction_start_block !== 0 ? auction_start_block : "Manual Start"}
          <br />
          Auction End Date: {displayEndDate}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          href={`/bond/${contract_address}`}
          sx={{ textTransform: "none" }}
          endIcon={<ArrowForwardIosIcon />}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default BondCardV2;
