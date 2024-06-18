import React, { useState } from "react";
import { Box, Grid, TextField, Button, Typography, MenuItem, FormControlLabel, Checkbox } from "@mui/material";

const RepaymentDetailsStep = ({ bondRepayment, setBondRepayment, handleAddPaymentSchedule, handleRemovePaymentSchedule, handlePaymentScheduleChange, handleSaveDraft }) => {
  const [showPenaltyField, setShowPenaltyField] = useState(false);

  const handleTogglePenalty = () => {
    setShowPenaltyField(!showPenaltyField);
    if (!showPenaltyField) {
      setBondRepayment({ ...bondRepayment, latePenalty: 0 });
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Bond Repayment Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Bond Duration</Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                label="Years"
                type="number"
                fullWidth
                value={bondRepayment.bondDuration.years}
                onChange={(e) =>
                  setBondRepayment({
                    ...bondRepayment,
                    bondDuration: {
                      ...bondRepayment.bondDuration,
                      years: Number(e.target.value),
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Months"
                type="number"
                fullWidth
                value={bondRepayment.bondDuration.months}
                onChange={(e) =>
                  setBondRepayment({
                    ...bondRepayment,
                    bondDuration: {
                      ...bondRepayment.bondDuration,
                      months: Number(e.target.value),
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Days"
                type="number"
                fullWidth
                value={bondRepayment.bondDuration.days}
                onChange={(e) =>
                  setBondRepayment({
                    ...bondRepayment,
                    bondDuration: {
                      ...bondRepayment.bondDuration,
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
            value={bondRepayment.repaymentType}
            onChange={(e) =>
              setBondRepayment({
                ...bondRepayment,
                repaymentType: e.target.value,
              })
            }
          >
            <MenuItem value="interest-only">Interest Only</MenuItem>
            <MenuItem value="principal-interest">Principal + Interest</MenuItem>
          </TextField>
          <Typography>
            {bondRepayment.repaymentType === "interest-only"
              ? "Interest Only: Regular interest payments based on the payment schedule, principal due at the end."
              : "Principal + Interest: Interest payments and a portion of the principal due at the same time, distributed over the payment schedule."}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Payment Schedule"
            select
            fullWidth
            value={bondRepayment.paymentSchedule}
            onChange={(e) =>
              setBondRepayment({
                ...bondRepayment,
                paymentSchedule: e.target.value,
              })
            }
          >
            <MenuItem value="fixed">Fixed</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </TextField>
          <Typography>
            {bondRepayment.paymentSchedule === "fixed"
              ? "Fixed: Regular payments at the specified interval."
              : "Custom: Payments at the specified interval."}
          </Typography>
        </Grid>
        {bondRepayment.paymentSchedule === "fixed" && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TextField
                  label="Interval (Days)"
                  type="number"
                  fullWidth
                  value={bondRepayment.fixedPaymentInterval.days}
                  onChange={(e) =>
                    setBondRepayment({
                      ...bondRepayment,
                      fixedPaymentInterval: {
                        ...bondRepayment.fixedPaymentInterval,
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
                  value={bondRepayment.fixedPaymentInterval.months}
                  onChange={(e) =>
                    setBondRepayment({
                      ...bondRepayment,
                      fixedPaymentInterval: {
                        ...bondRepayment.fixedPaymentInterval,
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
                  value={bondRepayment.fixedPaymentInterval.years}
                  onChange={(e) =>
                    setBondRepayment({
                      ...bondRepayment,
                      fixedPaymentInterval: {
                        ...bondRepayment.fixedPaymentInterval,
                        years: Number(e.target.value),
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {bondRepayment.paymentSchedule === "custom" && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleAddPaymentSchedule}
              sx={{ mb: 2 }}
            >
              Add Payment Schedule
            </Button>
            {bondRepayment.customRepaymentSchedule.map((schedule, index) => (
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
                  {bondRepayment.repaymentType === "interest-only" && (
                    <Grid item xs={12}>
                      <TextField
                        label="Interest Payment (%)"
                        type="number"
                        fullWidth
                        value={schedule.interestPayment}
                        onChange={(e) =>
                          handlePaymentScheduleChange(
                            index,
                            "interestPayment",
                            Number(e.target.value)
                          )
                        }
                      />
                    </Grid>
                  )}
                  {bondRepayment.repaymentType === "principal-interest" && (
                    <>
                      <Grid item xs={6}>
                        <TextField
                          label="Interest Payment (%)"
                          type="number"
                          fullWidth
                          value={schedule.interestPayment}
                          onChange={(e) =>
                            handlePaymentScheduleChange(
                              index,
                              "interestPayment",
                              Number(e.target.value)
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Principal Payment (%)"
                          type="number"
                          fullWidth
                          value={schedule.principalPayment}
                          onChange={(e) =>
                            handlePaymentScheduleChange(
                              index,
                              "principalPayment",
                              Number(e.target.value)
                            )
                          }
                        />
                      </Grid>
                    </>
                  )}
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
                checked={showPenaltyField}
                onChange={handleTogglePenalty}
              />
            }
            label="Penalty for late repayment"
          />
          {showPenaltyField && (
            <TextField
              label="Late Payment Penalty (%)"
              type="number"
              fullWidth
              value={bondRepayment.latePenalty}
              onChange={(e) =>
                setBondRepayment({
                  ...bondRepayment,
                  latePenalty: Math.max(0, Number(e.target.value)),
                })
              }
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={bondRepayment.earlyRepayment}
                onChange={(e) =>
                  setBondRepayment({
                    ...bondRepayment,
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
                checked={bondRepayment.collateral}
                onChange={(e) =>
                  setBondRepayment({
                    ...bondRepayment,
                    collateral: e.target.checked,
                  })
                }
              />
            }
            label="Offer Collateral"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RepaymentDetailsStep;
