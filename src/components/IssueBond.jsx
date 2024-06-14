import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

const IssueBond = () => {
  const [formData, setFormData] = useState({
    bondType: "non-convertible",
    faceValue: "",
    maturityDate: "",
    interestRate: "",
    paymentDates: "",
    paymentAmounts: "",
    startPrice: "",
    maxPrice: "",
    incrementSteps: "",
    latePaymentPenalty: "",
    fractionalizable: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Bond Issued:", formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Issue a New Bond
      </Typography>
      <TextField
        name="faceValue"
        label="Face Value"
        value={formData.faceValue}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="maturityDate"
        label="Maturity Date"
        value={formData.maturityDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="date"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        name="interestRate"
        label="Interest Rate"
        value={formData.interestRate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="paymentDates"
        label="Payment Dates (comma separated)"
        value={formData.paymentDates}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="paymentAmounts"
        label="Payment Amounts (comma separated)"
        value={formData.paymentAmounts}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="startPrice"
        label="Start Price"
        value={formData.startPrice}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="maxPrice"
        label="Max Price"
        value={formData.maxPrice}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="incrementSteps"
        label="Increment Steps"
        value={formData.incrementSteps}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="latePaymentPenalty"
        label="Late Payment Penalty"
        value={formData.latePaymentPenalty}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.fractionalizable}
            onChange={handleChange}
            name="fractionalizable"
          />
        }
        label="Fractionalizable"
      />
      <Button variant="contained" color="primary" type="submit">
        Create Bond
      </Button>
    </Box>
  );
};

export default IssueBond;
