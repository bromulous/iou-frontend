import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PostBondForSale = () => {
  const [formData, setFormData] = useState({
    bondId: "",
    salePrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Bond Posted for Sale:", formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Post Your Bond for Sale
      </Typography>
      <TextField
        name="bondId"
        label="Bond ID"
        value={formData.bondId}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="salePrice"
        label="Sale Price"
        value={formData.salePrice}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <Button variant="contained" color="primary" type="submit">
        Post Bond for Sale
      </Button>
    </Box>
  );
};

export default PostBondForSale;
