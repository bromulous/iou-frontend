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
import dayjs from "dayjs";

const BondIssuanceFlow = () => {
  const location = useLocation();
  const { bond } = location.state || {};
  const { currentUserId } = useContext(UserContext);
  const steps = ["Project Info", "Bond Details", "Auction Schedule", "Repayment Details", "Summary"];
  const [activeStep, setActiveStep] = useState(0);
  const [projectInfo, setProjectInfo] = useState(bond?.project_info || {
    name: "",
    description: "",
    website: "",
    imageUrl: "",
    coinGeckoUrl: "",
  });
  const [bondDetails, setBondDetails] = useState(bond?.bond_details || {
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
  const [auctionSchedule, setAuctionSchedule] = useState(bond?.auction_schedule || {
    auctionType: "automatic",
    auctionDuration: { days: 0, hours: 0 },
    auctionEndCondition: "full-sale",
    adjustAutomatically: false,
    adjustmentType: "percentage",
    adjustmentDetails: { intervalDays: 0, intervalHours: 0, amount: 0, rate: 0 },
    startAutomatically: false,
    startDate: new Date().toISOString(),
    timezone: "current"
  });
  const [paymentSchedule, setPaymentSchedule] = useState(bond?.payment_schedule || []);
  const [userBonds, setUserBonds] = useState([]);

  useEffect(() => {
    fetchUserBonds();
  }, []);

  const fetchUserBonds = async () => {
    try {
      const response = await backend.get(`/users/${currentUserId}/bonds`);
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
      draft.draft_id = bond.draft_id;
    }
    try {
      await backend.post(`/users/${currentUserId}/save_draft`, draft);
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
      await backend.post(`/users/${currentUserId}/issue_bond`, bond);
      alert("Bond published!");
      fetchUserBonds();
    } catch (error) {
      console.error("Error publishing bond:", error);
    }
  };

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

  const calculateEffectiveApr = (price) => {
    const bondDuration = 1; // Assuming 1 year for APR calculation
    const interestRate = bondDetails.interestRate / 100;
    return ((interestRate * bondDetails.totalAmount) / price) * 100;
  };

  const renderAuctionSummary = () => {
    const basePrice = bondDetails.infiniteTokens
      ? bondDetails.tokenPrice
      : bondDetails.totalAmount / bondDetails.tokens;

    const steps = [];
    const adjustmentInterval = auctionSchedule.adjustmentDetails.intervalDays + auctionSchedule.adjustmentDetails.intervalHours / 24;
    const auctionDuration = auctionSchedule.auctionDuration.days + auctionSchedule.auctionDuration.hours / 24;
    const iterations = Math.floor(auctionDuration / adjustmentInterval);

    for (let i = 0; i <= iterations; i++) {
      const adjustedPrice = auctionSchedule.adjustmentType === "percentage"
        ? basePrice - (basePrice * auctionSchedule.adjustmentDetails.rate / 100) * i
        : basePrice - auctionSchedule.adjustmentDetails.amount * i;

      steps.push(
        <Typography key={i} variant="body1">
          Auction after {i * adjustmentInterval} days: the price will be reduced to {formatNumberWithCommas(adjustedPrice)} giving an effective APR of {calculateEffectiveApr(adjustedPrice).toFixed(2)}%
        </Typography>
      );

      if (adjustedPrice <= bondDetails.minPrice) {
        break;
      }
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          Auction starts at {formatNumberWithCommas(basePrice)} and a {bondDetails.interestRate}% interest rate, giving an effective APR of {calculateEffectiveApr(basePrice).toFixed(2)}%
        </Typography>
        {steps}
        <Typography variant="body1">
          After {auctionDuration} days the auction will end when {auctionSchedule.auctionEndCondition === "full-sale" ? "all tokens are sold" : auctionSchedule.auctionEndCondition === "hard-end" ? "the hard end date is reached" : "manually stopped"}.
        </Typography>
      </Box>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Project Info</Typography>
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
                    setProjectInfo({
                        ...projectInfo,
                        imageUrl: e.target.value,
                      })
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
              <Typography variant="h6" sx={{ mb: 2 }}>Bond Details</Typography>
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
                  <TextField
                    label="Min Price"
                    type="number"
                    fullWidth
                    value={bondDetails.minPrice}
                    onChange={(e) =>
                      setBondDetails({
                        ...bondDetails,
                        minPrice: e.target.value,
                      })
                    }
                  />
                  <Typography>
                    Current price per token: {bondDetails.infiniteTokens ? bondDetails.tokenPrice : (bondDetails.totalAmount / bondDetails.tokens)}
                  </Typography>
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
                {auctionSchedule.auctionType === "automatic" && (
                  <>
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
                                rate: Number(e.target.value),
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
                                amount: Number(e.target.value),
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
                                  intervalDays: Number(e.target.value),
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
                                  intervalHours: Number(e.target.value),
                                },
                              })
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>
                        Adjusted Price: {formatNumberWithCommas(calculateAdjustedPrice())}
                      </Typography>
                    </Grid>
                  </>
                )}
                {auctionSchedule.auctionType === "manual" && (
                  <Grid item xs={12}>
                    <Typography>
                      Your auction will start {auctionSchedule.startAutomatically ? `automatically on ${dayjs(auctionSchedule.startDate).format("YYYY-MM-DD HH:mm")}` : "manually when you start it"} at the token price with an interest rate of {bondDetails.interestRate}%. You can adjust the auction manually to lower the purchase price of the bond tokens and end the auction whenever you want.
                    </Typography>
                  </Grid>
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
              <Typography variant="h6" sx={{ mb: 2 }}>Bond Repayment Details</Typography>
              <Grid container spacing={2}>
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
                    <MenuItem value="principal-interest">Principal + Interest</MenuItem>
                  </TextField>
                  <Typography>
                    {auctionSchedule.repaymentType === "interest-only"
                      ? "Interest Only: Regular interest payments based on the payment schedule, principal due at the end."
                      : "Principal + Interest: Interest payments and a portion of the principal due at the same time, distributed over the payment schedule."}
                  </Typography>
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
                  <Typography>
                    {auctionSchedule.paymentSchedule === "fixed"
                      ? "Fixed: Regular payments at the specified interval."
                      : "Custom: Payments at the specified interval."}
                  </Typography>
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
        case 4:
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
                {auctionSchedule.auctionType === "manual" && (
                  <Typography variant="subtitle1">
                    Your auction will start {auctionSchedule.startAutomatically ? `automatically on ${dayjs(auctionSchedule.startDate).format("YYYY-MM-DD HH:mm")}` : "manually when you start it"} at the token price with an interest rate of {bondDetails.interestRate}%. You can adjust the auction manually to lower the purchase price of the bond tokens and end the auction whenever you want.
                  </Typography>
                )}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Auction Summary</Typography>
                {renderAuctionSummary()}
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
        alert("View Bond Summary");
      } else {
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
  
