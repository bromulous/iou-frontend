import React from "react";
import { Box, Typography } from "@mui/material";

const AuctionSummary = ({ bondDetails, auctionSchedule, bondRepayment }) => {
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateEffectiveApr = (price, discountPrice, interestRate, bondDuration) => {
    let intInterestRate = 0;
    if (interestRate !== undefined) {
      intInterestRate = parseInt(interestRate);
      if (isNaN(intInterestRate)) {
        intInterestRate = 0;
      }
    }
    const discountApr = ((price - discountPrice) / discountPrice) * 100;
    const annualizedDiscountApr = bondDuration ? (discountApr / bondDuration) : discountApr;
    const totalApr = annualizedDiscountApr + intInterestRate;
    return totalApr;
  };

  const renderAuctionSummary = () => {
    const basePrice = bondDetails.infiniteTokens
      ? bondDetails.tokenPrice
      : bondDetails.totalAmount / bondDetails.tokens;

    const steps = [];
    const adjustmentInterval = auctionSchedule.adjustmentDetails.intervalDays + auctionSchedule.adjustmentDetails.intervalHours / 24;
    const auctionDuration = auctionSchedule.auctionDuration.days + auctionSchedule.auctionDuration.hours / 24;
    const iterations = Math.floor(auctionDuration / adjustmentInterval);
    const bondDuration = (bondRepayment.bondDuration.years || 0) + (bondRepayment.bondDuration.months / 12 || 0) + (bondRepayment.bondDuration.days / 365 || 0) || 1; // Default to 1 year if bondDuration is not set

    for (let i = 0; i <= iterations; i++) {
      const adjustedPrice = auctionSchedule.adjustmentType === "percentage"
        ? basePrice - (basePrice * auctionSchedule.adjustmentDetails.rate / 100) * i
        : basePrice - auctionSchedule.adjustmentDetails.amount * i;

      const effectiveApr = calculateEffectiveApr(basePrice, adjustedPrice, bondDetails.interestRate, bondDuration);
      if (adjustedPrice <= auctionSchedule.minPrice) {
        break;
      }
      steps.push(
        <Typography key={i} variant="body1">
          Auction after {i * adjustmentInterval} days: the price will be reduced to {formatNumberWithCommas(adjustedPrice.toFixed(2))} giving an effective APR of {effectiveApr.toFixed(2)}%
        </Typography>
      );

      
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          Auction starts at {formatNumberWithCommas(basePrice)} and a {bondDetails.interestRate}% interest rate, giving an effective APR of {calculateEffectiveApr(basePrice, basePrice, bondDetails.interestRate, bondDuration).toFixed(2)}%
        </Typography>
        {steps}
        <Typography variant="body1">
          After {auctionDuration} days the auction will end when {auctionSchedule.auctionEndCondition === "full-sale" ? "all tokens are sold" : auctionSchedule.auctionEndCondition === "hard-end" ? "the hard end date is reached" : "manually stopped"}.
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2 }}>Auction Summary</Typography>
      {renderAuctionSummary()}
    </Box>
  );
};

export default AuctionSummary;
