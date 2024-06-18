import React from "react";
import { Box, Grid, TextField, FormControlLabel, Checkbox, Typography, Button } from "@mui/material";

const BondDetailsStep = ({ bondDetails, setBondDetails, handleSaveDraft }) => {
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
            label="Token Symbol"
            fullWidth
            value={bondDetails.tokenSymbol}
            onChange={(e) =>
              setBondDetails({ ...bondDetails, tokenSymbol: e.target.value })
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BondDetailsStep;
