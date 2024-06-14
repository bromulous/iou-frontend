import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import backend from "../api";
import { UserContext } from "../contexts/UserContext";
import dayjs from 'dayjs';

const BondIssuanceFlow = () => {
  const location = useLocation();
  const { bond } = location.state || {};
  const { currentUserId } = useContext(UserContext);
  const steps = ["Project Info", "Bond Details", "Auction Schedule", "Summary"];
  const [activeStep, setActiveStep] = useState(0);
  const [projectInfo, setProjectInfo] = useState( bond?.project_info || {
    name: "",
    description: "",
    website: "",
    imageUrl: "",
    coinGeckoUrl: "",
  });
  const [bondDetails, setBondDetails] = useState( bond?.bond_details || {
    title: "",
    totalAmount: "",
    infiniteTokens: false,
    tokens: "",
    tokenPrice: "",
    interestRate: "",
    maxInterestRate: "",
    minPrice: "",
    requiresFullSale: false,
    latePenalty: "",
    earlyRepayment: false,
    collateral: false,
  });
  const [auctionSchedule, setAuctionSchedule] = useState(bond?.auction_schedule ||{
    auctionType: "automatic",
    auctionDuration: { days: 0, hours: 0 },
    auctionEndCondition: "full",
    adjustAutomatically: false,
    adjustmentDetails: { intervalDays: 0, intervalHours: 0, amount: 0, rate: 0 },
    bondDuration: { years: 0, months: 0, days: 0 },
    repaymentType: "interest-only",
    paymentSchedule: "fixed",
    fixedPaymentInterval: { days: 0, months: 0, years: 0 },
    startAutomatically: false,
    startDate: new Date().toISOString(),
    timezone: "current"
  });
  const [paymentSchedule, setPaymentSchedule] = useState(bond?.payment_schedule || []);
  const [userBonds, setUserBonds] = useState([]);

  useEffect(() => {
    // Fetch user bonds when the component mounts
    fetchUserBonds();
  }, []);

  const fetchUserBonds = async () => {
    try {
      const response = await backend.get(`/users/${currentUserId}/bonds`); // Adjust user ID as necessary
      setUserBonds(response.data);
    } catch (error) {
      console.error("Error fetching user bonds:", error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (index) => {
    setActiveStep(index);
  };

  const handleAddPaymentSchedule = () => {
    setPaymentSchedule([
      ...paymentSchedule,
      { days: 0, months: 0, years: 0, amount: 0 },
    ]);
  };

  const handleRemovePaymentSchedule = (index) => {
    setPaymentSchedule(
      paymentSchedule.filter((_, scheduleIndex) => scheduleIndex !== index)
    );
  };

  const handlePaymentScheduleChange = (index, field, value) => {
    const newSchedule = [...paymentSchedule];
    newSchedule[index][field] = value;
    setPaymentSchedule(newSchedule);
  };

  const handleSaveDraft = async () => {
    let draft = {
      project_info: projectInfo,
      bond_details: bondDetails,
      auction_schedule: auctionSchedule,
      payment_schedule: paymentSchedule,
    };
    if (bond?.draft_id) {
        draft.draft_id = bond.draft_id
        }
    try {
      await backend.post(`/users/${currentUserId}/save_draft`, draft); // Adjust user ID as necessary
      alert("Draft saved!");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handlePublishBond = async () => {
    const bond = {
      name: bondDetails.title,
      symbol: "BOND",
      total_supply: parseFloat(bondDetails.totalAmount),
      interest_rate: parseFloat(bondDetails.interestRate),
      maturity_date: new Date(),
      payment_schedule: paymentSchedule,
      is_callable: bondDetails.earlyRepayment,
      is_convertible: bondDetails.collateral,
      penalty_rate: parseFloat(bondDetails.latePenalty),
      requires_full_sale: bondDetails.requiresFullSale,
      early_withdrawal: bondDetails.earlyRepayment,
    };
    try {
      await backend.post(`/users/${currentUserId}/issue_bond`, bond); // Adjust user ID as necessary
      alert("Bond published!");
      fetchUserBonds(); // Refresh the list of user bonds
    } catch (error) {
      console.error("Error publishing bond:", error);
    }
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Project Name"
                  fullWidth
                  value={projectInfo.name}
                  onChange={(e) =>
                    setProjectInfo({ ...projectInfo, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={projectInfo.description}
                  onChange={(e) =>
                    setProjectInfo({
                      ...projectInfo,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Website"
                  fullWidth
                  value={projectInfo.website}
                  onChange={(e) =>
                    setProjectInfo({ ...projectInfo, website: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Coin Gecko URL"
                  fullWidth
                  value={projectInfo.coinGeckoUrl}
                  onChange={(e) =>
                    setProjectInfo({
                      ...projectInfo,
                      coinGeckoUrl: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Image URL"
                  fullWidth
                  value={projectInfo.imageUrl}
                  onChange={(e) =>
                    setProjectInfo({ ...projectInfo, imageUrl: e.target.value })
                  }
                />
                {projectInfo.imageUrl && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={projectInfo.imageUrl}
                      alt="Project"
                      style={{ maxWidth: "200px" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveDraft}
              sx={{ mt: 2 }}
            >
              Save Draft
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Bond Title"
                  fullWidth
                  value={bondDetails.title}
                  onChange={(e) =>
                    setBondDetails({ ...bondDetails, title: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Total Amount"
                  type="number"
                  fullWidth
                  value={bondDetails.totalAmount}
                  onChange={(e) =>
                    setBondDetails({
                      ...bondDetails,
                      totalAmount: e.target.value,
                    })
                  }
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={bondDetails.infiniteTokens}
                      onChange={(e) =>
                        setBondDetails({
                          ...bondDetails,
                          infiniteTokens: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Infinite Tokens"
                />
              </Grid>
              {bondDetails.infiniteTokens ? (
                <Grid item xs={12}>
                  <TextField
                    label="Price per Token"
                    type="number"
                    fullWidth
                    value={bondDetails.tokenPrice}
                    onChange={(e) =>
                      setBondDetails({
                        ...bondDetails,
                        tokenPrice: e.target.value,
                      })
                    }
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    label="Number of Tokens"
                    type="number"
                    fullWidth
                    value={bondDetails.tokens}
                    onChange={(e) =>
                      setBondDetails({ ...bondDetails, tokens: e.target.value })
                    }
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  label="Starting Interest Rate (%)"
                  type="number"
                  fullWidth
                  value={bondDetails.interestRate}
                  onChange={(e) =>
                    setBondDetails({
                      ...bondDetails,
                      interestRate: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={bondDetails.requiresFullSale}
                      onChange={(e) =>
                        setBondDetails({
                          ...bondDetails,
                          requiresFullSale: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Requires Full Sale"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Late Payment Penalty (%)"
                  type="number"
                  fullWidth
                  value={bondDetails.latePenalty}
                  onChange={(e) =>
                    setBondDetails({
                      ...bondDetails,
                      latePenalty: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={bondDetails.earlyRepayment}
                      onChange={(e) =>
                        setBondDetails({
                          ...bondDetails,
                          earlyRepayment: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Allow Early Repayment"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={bondDetails.collateral}
                      onChange={(e) =>
                        setBondDetails({
                          ...bondDetails,
                          collateral: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Offer Collateral"
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveDraft}
              sx={{ mt: 2 }}
            >
              Save Draft
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box>
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
                            days: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Auction Duration (Hours)"
                      type="number"
                      fullWidth
                      value={auctionSchedule.auctionDuration.hours}
                      onChange={(e) =>
                        setAuctionSchedule({
                          ...auctionSchedule,
                          auctionDuration: {
                            ...auctionSchedule.auctionDuration,
                            hours: Number(e.target.value),
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
                  <MenuItem value="full">Full</MenuItem>
                  <MenuItem value="hardEnd">Hard End Date</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={auctionSchedule.adjustAutomatically}
                      onChange={(e) =>
                        setAuctionSchedule({
                          ...auctionSchedule,
                          adjustAutomatically: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Adjust Price Automatically"
                />
              </Grid>
              {auctionSchedule.adjustAutomatically && (
                <>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
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
                                intervalDays: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
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
                                intervalHours: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
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
                            amount: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
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
                            rate: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <TextField
                      label="Bond Duration (Years)"
                      type="number"
                      fullWidth
                      value={auctionSchedule.bondDuration.years}
                      onChange={(e) =>
                        setAuctionSchedule({
                          ...auctionSchedule,
                          bondDuration: {
                            ...auctionSchedule.bondDuration,
                            years: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Bond Duration (Months)"
                      type="number"
                      fullWidth
                      value={auctionSchedule.bondDuration.months}
                      onChange={(e) =>
                        setAuctionSchedule({
                          ...auctionSchedule,
                          bondDuration: {
                            ...auctionSchedule.bondDuration,
                            months: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Bond Duration (Days)"
                      type="number"
                      fullWidth
                      value={auctionSchedule.bondDuration.days}
                      onChange={(e) =>
                        setAuctionSchedule({
                          ...auctionSchedule,
                          bondDuration: {
                            ...auctionSchedule.bondDuration,
                            days: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Repayment Type"
                  select
                  fullWidth
                  value={auctionSchedule.repaymentType}
                  onChange={(e) =>
                    setAuctionSchedule({
                      ...auctionSchedule,
                      repaymentType: e.target.value,
                    })
                  }
                >
                  <MenuItem value="interest-only">Interest Only</MenuItem>
                  <MenuItem value="principal-interest">
                    Principal + Interest
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Payment Schedule"
                  select
                  fullWidth
                  value={auctionSchedule.paymentSchedule}
                  onChange={(e) =>
                    setAuctionSchedule({
                      ...auctionSchedule,
                      paymentSchedule: e.target.value,
                    })
                  }
                >
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </TextField>
              </Grid>
              {auctionSchedule.paymentSchedule === "fixed" && (
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <TextField
                        label="Interval (Days)"
                        type="number"
                        fullWidth
                        value={auctionSchedule.fixedPaymentInterval.days}
                        onChange={(e) =>
                          setAuctionSchedule({
                            ...auctionSchedule,
                            fixedPaymentInterval: {
                              ...auctionSchedule.fixedPaymentInterval,
                              days: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Interval (Months)"
                        type="number"
                        fullWidth
                        value={auctionSchedule.fixedPaymentInterval.months}
                        onChange={(e) =>
                          setAuctionSchedule({
                            ...auctionSchedule,
                            fixedPaymentInterval: {
                              ...auctionSchedule.fixedPaymentInterval,
                              months: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Interval (Years)"
                        type="number"
                        fullWidth
                        value={auctionSchedule.fixedPaymentInterval.years}
                        onChange={(e) =>
                          setAuctionSchedule({
                            ...auctionSchedule,
                            fixedPaymentInterval: {
                              ...auctionSchedule.fixedPaymentInterval,
                              years: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {auctionSchedule.paymentSchedule === "custom" && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleAddPaymentSchedule}
                    sx={{ mb: 2 }}
                  >
                    Add Payment Schedule
                  </Button>
                  {paymentSchedule.map((schedule, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <TextField
                            label="Days"
                            type="number"
                            fullWidth
                            value={schedule.days}
                            onChange={(e) =>
                              handlePaymentScheduleChange(
                                index,
                                "days",
                                Number(e.target.value)
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label="Months"
                            type="number"
                            fullWidth
                            value={schedule.months}
                            onChange={(e) =>
                              handlePaymentScheduleChange(
                                index,
                                "months",
                                Number(e.target.value)
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label="Years"
                            type="number"
                            fullWidth
                            value={schedule.years}
                            onChange={(e) =>
                              handlePaymentScheduleChange(
                                index,
                                "years",
                                Number(e.target.value)
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Amount"
                            type="number"
                            fullWidth
                            value={schedule.amount}
                            onChange={(e) =>
                              handlePaymentScheduleChange(
                                index,
                                "amount",
                                Number(e.target.value)
                              )
                            }
                          />
                        </Grid>
                      </Grid>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemovePaymentSchedule(index)}
                        sx={{ mt: 2 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                </Grid>
              )}
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
                <>
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
                  <Grid item xs={12}>
                    <TextField
                      label="Timezone"
                      select
                      fullWidth
                      value={auctionSchedule.timezone}
                      onChange={(e) =>
                        setAuctionSchedule({
                          ...auctionSchedule,
                          timezone: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="current">Current Timezone</MenuItem>
                      <MenuItem value="utc">UTC</MenuItem>
                    </TextField>
                  </Grid>
                </>
              )}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveDraft}
              sx={{ mt: 2 }}
            >
              Save Draft
            </Button>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6">Bond Preview</Typography>
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
                Min Price: {formatNumberWithCommas(bondDetails.minPrice)}
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
                Bond Duration: {auctionSchedule.bondDuration.years} years{" "}
                {auctionSchedule.bondDuration.months} months{" "}
                {auctionSchedule.bondDuration.days} days
              </Typography>
              <Typography variant="subtitle1">
                Repayment Type: {auctionSchedule.repaymentType}
              </Typography>
              <Typography variant="subtitle1">
                Payment Schedule: {auctionSchedule.paymentSchedule}
              </Typography>
              {auctionSchedule.paymentSchedule === "fixed" && (
                <Typography variant="subtitle1">
                  Fixed Payment Interval:{" "}
                  {auctionSchedule.fixedPaymentInterval.days} days{" "}
                  {auctionSchedule.fixedPaymentInterval.months} months{" "}
                  {auctionSchedule.fixedPaymentInterval.years} years
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
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Summary</Typography>
              <Typography variant="body1">
                The bond titled <strong>{bondDetails.title}</strong> will be
                issued for a total amount of <strong>{formatNumberWithCommas(bondDetails.totalAmount)}</strong> Frax.
                {bondDetails.infiniteTokens
                  ? ` Tokens will be priced at ${formatNumberWithCommas(bondDetails.tokenPrice)} Frax each.`
                  : ` There will be ${formatNumberWithCommas(bondDetails.tokens)} tokens representing the bond.`}
              </Typography>
              <Typography variant="body1">
                The auction will be {auctionSchedule.auctionType === "automatic"
                  ? "automatically adjusted"
                  : "manually adjusted"} starting from {auctionSchedule.auctionType === "automatic" && `with an interest rate of ${bondDetails.interestRate}%`}
                {bondDetails.infiniteTokens
                  ? "."
                  : ` and a price of ${formatNumberWithCommas(bondDetails.totalAmount / bondDetails.tokens)} Frax per token.`}
              </Typography>
              <Typography variant="body1">
                The bond duration is
                {auctionSchedule.bondDuration.years > 0 &&
                  ` ${auctionSchedule.bondDuration.years} years`}
                {auctionSchedule.bondDuration.years > 0 &&
                  auctionSchedule.bondDuration.months > 0 &&
                  ", "}
                {auctionSchedule.bondDuration.months > 0 &&
                  ` ${auctionSchedule.bondDuration.months} months`}
                {(auctionSchedule.bondDuration.years > 0 ||
                  auctionSchedule.bondDuration.months > 0) &&
                  auctionSchedule.bondDuration.days > 0 &&
                  ", "}
                {auctionSchedule.bondDuration.days > 0 &&
                  ` ${auctionSchedule.bondDuration.days} days`}, with payments
                scheduled every{" "}
                {auctionSchedule.paymentSchedule === "fixed"
                  ? `${auctionSchedule.fixedPaymentInterval.days > 0 ? `${auctionSchedule.fixedPaymentInterval.days} days ` : ""}` +
                    `${auctionSchedule.fixedPaymentInterval.months > 0 ? `${auctionSchedule.fixedPaymentInterval.months} months ` : ""}` +
                    `${auctionSchedule.fixedPaymentInterval.years > 0 ? `${auctionSchedule.fixedPaymentInterval.years} years` : ""}`
                  : ""}.
              </Typography>
              {auctionSchedule.paymentSchedule === "custom" &&
                paymentSchedule.map((schedule, index) => (
                  <Typography key={index} variant="body1">
                    Payment {index + 1}: {formatNumberWithCommas(schedule.amount)} Frax after{" "}
                    {schedule.days} days, {schedule.months} months, and{" "}
                    {schedule.years} years.
                  </Typography>
                ))}
              <Typography variant="body1">
                The bond {bondDetails.requiresFullSale ? "requires" : "does not require"} full sale to be activated, and early repayment is {bondDetails.earlyRepayment ? "allowed" : "not allowed"}.
                Late payments will incur a penalty rate of {bondDetails.latePenalty}%.
              </Typography>
              <Typography variant="body1">
                Collateral is {bondDetails.collateral ? "provided" : "not provided"} for this bond.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePublishBond}
              sx={{ mt: 2 }}
            >
              Publish Bond
            </Button>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  const handleCardClick = (bond) => {
    if (bond.bond_sold) {
      // Navigate to the bond summary view
      alert("View Bond Summary");
    } else {
      // Navigate to the bond edit view
      alert("Edit Bond");
    }
  };

  return (
    <Container>
      <Box sx={{ pt: 10 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} onClick={() => handleStepChange(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box sx={{ mt: 4 }}>
        {renderStepContent(activeStep)}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Your Bonds</Typography>
        <Grid container spacing={2}>
          {userBonds.map((bond) => (
            <Grid item key={bond.id} xs={12} sm={6} md={4}>
              <Card onClick={() => handleCardClick(bond)}>
                <CardContent>
                  <Typography variant="h6">{bond.name}</Typography>
                  <Typography>Interest Rate: {bond.interest_rate}%</Typography>
                  <Typography>
                    Maturity Date: {new Date(bond.maturity_date).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleCardClick(bond)}>
                    {bond.bond_sold ? "View" : "Edit"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default BondIssuanceFlow;
