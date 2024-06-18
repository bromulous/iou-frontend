import React from "react";
import { Box, Grid, TextField, FormControlLabel, Checkbox, Button, Typography, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import AuctionSummary from "./AuctionSummary";

const AuctionScheduleStep = ({ bondDetails, auctionSchedule, setAuctionSchedule, handleSaveDraft, bondRepayment }) => {
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateAdjustedPrice = () => {
    let basePrice = bondDetails.infiniteTokens
      ? bondDetails.tokenPrice
      : bondDetails.totalAmount / bondDetails.tokens;

    if (auctionSchedule.adjustmentType === "percentage") {
      return basePrice - (basePrice * auctionSchedule.adjustmentDetails.rate / 100);
    } else {
      return basePrice - auctionSchedule.adjustmentDetails.amount;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Auction Schedule</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Auction Type"
            select
            fullWidth
            value={auctionSchedule.auctionType}
            onChange={(e) =>
              setAuctionSchedule({
                ...auctionSchedule,
                auctionType: e.target.value,
              })
            }
          >
            <MenuItem value="automatic">Automatic</MenuItem>
            <MenuItem value="manual">Manual</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={auctionSchedule.startAutomatically}
                onChange={(e) =>
                  setAuctionSchedule({
                    ...auctionSchedule,
                    startAutomatically: e.target.checked,
                  })
                }
              />
            }
            label="Start Auction Automatically"
          />
        </Grid>
        {auctionSchedule.startAutomatically && (
          <Grid item xs={12}>
            <TextField
              label="Start Date and Time"
              type="datetime-local"
              fullWidth
              value={dayjs(auctionSchedule.startDate).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) =>
                setAuctionSchedule({
                  ...auctionSchedule,
                  startDate: e.target.value,
                })
              }
            />
          </Grid>
        )}
        {auctionSchedule.auctionType === "automatic" && (
          <>
          <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label="Auction Duration (Days)"
                    type="number"
                    fullWidth
                    value={auctionSchedule.auctionDuration.days}
                    onChange={(e) =>
                      setAuctionSchedule({
                        ...auctionSchedule,
                        auctionDuration: {
                          ...auctionSchedule.auctionDuration,
                          days: Math.max(0, Number(e.target.value)), // Ensure non-negative
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Auction Duration (Hours"
                    type="number"
                    fullWidth
                    value={auctionSchedule.auctionDuration.hours}
                    onChange={(e) =>
                      setAuctionSchedule({
                        ...auctionSchedule,
                        auctionDuration: {
                          ...auctionSchedule.auctionDuration,
                          hours: Math.max(0, Number(e.target.value)), // Ensure non-negative
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Auction End Condition"
                select
                fullWidth
                value={auctionSchedule.auctionEndCondition}
                onChange={(e) =>
                  setAuctionSchedule({
                    ...auctionSchedule,
                    auctionEndCondition: e.target.value,
                  })
                }
              >
                <MenuItem value="full-sale">Full Sale of Bond</MenuItem>
                <MenuItem value="hard-end">Hard End Date</MenuItem>
                <MenuItem value="manual">Manual</MenuItem>
              </TextField>
              <Typography>
                {auctionSchedule.auctionEndCondition === "full-sale" && "Full Sale of Bond: The auction ends when the entire bond is sold."}
                {auctionSchedule.auctionEndCondition === "hard-end" && "Hard End Date: The auction ends after the specified duration."}
                {auctionSchedule.auctionEndCondition === "manual" && "Manual: The auction continues until manually stopped."}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Adjustment Details</Typography>
              <Typography>
                How much should we lower the price to purchase the bond at the interval you specified above?
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSchedule.adjustmentType === "percentage"}
                    onChange={() =>
                      setAuctionSchedule({
                        ...auctionSchedule,
                        adjustmentType: "percentage",
                        adjustmentDetails: { ...auctionSchedule.adjustmentDetails, amount: 0 }
                      })
                    }
                  />
                }
                label="Drop by Percentage"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSchedule.adjustmentType === "fixed"}
                    onChange={() =>
                      setAuctionSchedule({
                        ...auctionSchedule,
                        adjustmentType: "fixed",
                        adjustmentDetails: { ...auctionSchedule.adjustmentDetails, rate: 0 }
                      })
                    }
                  />
                }
                label="Drop by Fixed Price"
              />
            </Grid>
            {auctionSchedule.adjustmentType === "percentage" && (
              <Grid item xs={12}>
                <TextField
                  label="Rate Adjustment at Each Interval (%)"
                  type="number"
                  fullWidth
                  value={auctionSchedule.adjustmentDetails.rate}
                  onChange={(e) =>
                    setAuctionSchedule({
                      ...auctionSchedule,
                      adjustmentDetails: {
                        ...auctionSchedule.adjustmentDetails,
                        rate: Math.max(0, Number(e.target.value)), // Ensure non-negative
                      },
                    })
                  }
                />
              </Grid>
            )}
            {auctionSchedule.adjustmentType === "fixed" && (
              <Grid item xs={12}>
                <TextField
                  label="Amount to Lower Price at Each Adjustment"
                  type="number"
                  fullWidth
                  value={auctionSchedule.adjustmentDetails.amount}
                  onChange={(e) =>
                    setAuctionSchedule({
                      ...auctionSchedule,
                      adjustmentDetails: {
                        ...auctionSchedule.adjustmentDetails,
                        amount: Math.max(0, Number(e.target.value)), // Ensure non-negative
                      },
                    })
                  }
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    label="Adjustment Interval (Days)"
                    type="number"
                    fullWidth
                    value={auctionSchedule.adjustmentDetails.intervalDays}
                    onChange={(e) =>
                      setAuctionSchedule({
                        ...auctionSchedule,
                        adjustmentDetails: {
                          ...auctionSchedule.adjustmentDetails,
                          intervalDays: Math.max(0, Number(e.target.value)), // Ensure non-negative
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Adjustment Interval (Hours)"
                    type="number"
                    fullWidth
                    value={auctionSchedule.adjustmentDetails.intervalHours}
                    onChange={(e) =>
                      setAuctionSchedule({
                        ...auctionSchedule,
                        adjustmentDetails: {
                          ...auctionSchedule.adjustmentDetails,
                          intervalHours: Math.max(0, Number(e.target.value)), // Ensure non-negative
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Minimum Price"
                type="number"
                fullWidth
                value={auctionSchedule.minPrice}
                onChange={(e) =>
                  setAuctionSchedule({
                    ...auctionSchedule,
                    minPrice: Math.max(0, Number(e.target.value)), // Ensure non-negative
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={auctionSchedule.requiresFullSale}
                    onChange={(e) =>
                      setAuctionSchedule({
                        ...auctionSchedule,
                        requiresFullSale: e.target.checked,
                      })
                    }
                  />
                }
                label="Requires Full Sale"
              />
            </Grid>
          </>
        )}
        {auctionSchedule.auctionType === "manual" && (
          <Grid item xs={12}>
            <Typography variant="h6">Auction Summary</Typography>
            <Typography>
              Your auction will start {auctionSchedule.startAutomatically ? `automatically on ${dayjs(auctionSchedule.startDate).format("YYYY-MM-DD HH:mm")}` : "manually when you start it"} at the token price with an interest rate of {bondDetails.interestRate}%. You can adjust the auction manually to lower the purchase price of the bond tokens and end the auction whenever you want.
            </Typography>
          </Grid>
        )}
      </Grid>
      {auctionSchedule.auctionType === "automatic" && (
        <AuctionSummary bondDetails={bondDetails} auctionSchedule={auctionSchedule} bondRepayment={bondRepayment} />
      )}
    </Box>
  );
};

export default AuctionScheduleStep;
