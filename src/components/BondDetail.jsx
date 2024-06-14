import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { bonds } from "../utils/dummyData";

const BondDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bond = bonds.find((b) => b.id === parseInt(id, 10));

  return (
    <Box mt={5}>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
        Back to Bonds
      </Button>
      {bond ? (
        <>
          <Typography variant="h4" gutterBottom>
            {bond.issuer}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Type: {bond.type}
          </Typography>
          <Typography variant="body1" paragraph>
            Face Value: {bond.faceValue}
            <br />
            Maturity Date: {bond.maturityDate}
            <br />
            Interest Rate: {bond.interestRate}%
            <br />
            APR: {bond.apr}%
            <br />
            Purpose: {bond.purpose}
            <br />
            <Button
              variant="contained"
              color="primary"
              href={bond.website}
              target="_blank"
              sx={{ mt: 2 }}
            >
              View Project
            </Button>
          </Typography>
        </>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Bond not found.
        </Typography>
      )}
    </Box>
  );
};

export default BondDetail;
