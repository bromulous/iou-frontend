import React from "react";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";

const SummaryStep = ({ projectInfo, bondDetails, auctionSchedule, bondRepayment, paymentSchedule, handlePublishBond }) => {
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Bond Preview</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">
          Title: {bondDetails.title}
        </Typography>
        <Typography variant="subtitle1">
          Total Amount: {formatNumberWithCommas(bondDetails.totalAmount)}
        </Typography>
        {bondDetails.infiniteTokens && (
          <Typography variant="subtitle1">
            Token Price: {formatNumberWithCommas(bondDetails.tokenPrice)}
          </Typography>
        )}
        <Typography variant="subtitle1">
          Interest Rate: {bondDetails.interestRate}%
        </Typography>
        <Typography variant="subtitle1">
          Min Price: {formatNumberWithCommas(auctionSchedule.minPrice)}
        </Typography>
        <Typography variant="subtitle1">
          Requires Full Sale:{" "}
          {bondDetails.requiresFullSale ? "Yes" : "No"}
        </Typography>
        <Typography variant="subtitle1">
          Late Payment Penalty: {bondDetails.latePenalty}%
        </Typography>
        <Typography variant="subtitle1">
          Early Repayment: {bondDetails.earlyRepayment ? "Allowed" : "Not Allowed"}
        </Typography>
        <Typography variant="subtitle1">
          Collateral: {bondDetails.collateral ? "Yes" : "No"}
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Auction Schedule</Typography>
        <Typography variant="subtitle1">
          Auction Type: {auctionSchedule.auctionType}
        </Typography>
        <Typography variant="subtitle1">
          Auction Duration: {auctionSchedule.auctionDuration.days} days{" "}
          {auctionSchedule.auctionDuration.hours} hours
        </Typography>
        <Typography variant="subtitle1">
          Auction End Condition: {auctionSchedule.auctionEndCondition}
        </Typography>
        <Typography variant="subtitle1">
          Adjust Automatically:{" "}
          {auctionSchedule.adjustAutomatically ? "Yes" : "No"}
        </Typography>
        {auctionSchedule.adjustAutomatically && (
          <Box>
            <Typography variant="subtitle1">
              Adjustment Interval:{" "}
              {auctionSchedule.adjustmentDetails.intervalDays} days{" "}
              {auctionSchedule.adjustmentDetails.intervalHours} hours
            </Typography>
            <Typography variant="subtitle1">
              Amount to Lower Price:{" "}
              {formatNumberWithCommas(auctionSchedule.adjustmentDetails.amount)}
            </Typography>
            <Typography variant="subtitle1">
              Rate Adjustment: {auctionSchedule.adjustmentDetails.rate}%
            </Typography>
          </Box>
        )}
        <Typography variant="subtitle1">
          Bond Duration: {bondRepayment.bondDuration.years} years{" "}
          {bondRepayment.bondDuration.months} months{" "}
          {bondRepayment.bondDuration.days} days
        </Typography>
        <Typography variant="subtitle1">
          Repayment Type: {auctionSchedule.repaymentType}
        </Typography>
        <Typography variant="subtitle1">
          Payment Schedule: {auctionSchedule.paymentSchedule}
        </Typography>
        {bondRepayment.fixedPaymentInterval === "fixed" && (
          <Typography variant="subtitle1">
            Fixed Payment Interval:{" "}
            {bondRepayment.fixedPaymentInterval.days} days{" "}
            {bondRepayment.fixedPaymentInterval.months} months{" "}
            {bondRepayment.fixedPaymentInterval.years} years
          </Typography>
        )}
        {auctionSchedule.paymentSchedule === "custom" &&
          paymentSchedule.map((schedule, index) => (
            <Typography key={index} variant="subtitle1">
              Payment {index + 1}: {formatNumberWithCommas(schedule.amount)} after{" "}
              {schedule.days} days {schedule.months} months{" "}
              {schedule.years} years
            </Typography>
          ))}
        <Typography variant="subtitle1">
          Start Auction Automatically:{" "}
          {auctionSchedule.startAutomatically ? "Yes" : "No"}
        </Typography>
        {auctionSchedule.startAutomatically && (
          <Typography variant="subtitle1">
            Start Date and Time:{" "}
            {dayjs(auctionSchedule.startDate).format("YYYY-MM-DD HH:mm")}{" "}
            ({auctionSchedule.timezone === "current" ? "Current Timezone" : "UTC"})
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SummaryStep;
