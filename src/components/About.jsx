import React from "react";
import { Box, Typography } from "@mui/material";

const About = () => (
  <Box mt={5}>
    <Typography variant="h4" gutterBottom>
      About IOU Finance
    </Typography>
    <Typography variant="body1" paragraph>
      IOU Finance is a decentralized platform that allows users to issue and
      trade bonds on the blockchain. Our mission is to provide a transparent and
      secure way for projects to raise funds and for investors to earn returns.
    </Typography>
    <Typography variant="body1" paragraph>
      On our platform, you can:
      <ul>
        <li>Issue bonds for your project</li>
        <li>Invest in bonds and earn interest</li>
        <li>Trade bonds in the secondary market</li>
        <li>Monitor your investments and payments</li>
      </ul>
    </Typography>
    <Typography variant="body1" paragraph>
      Whether you are a project looking for funding or an investor seeking
      opportunities, IOU Finance provides a comprehensive and user-friendly
      platform to meet your needs.
    </Typography>
  </Box>
);

export default About;
