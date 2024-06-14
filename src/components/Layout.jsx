import React from 'react';
import { Container, Box } from '@mui/material';

const Layout = ({ children }) => (
  <Container maxWidth="lg">
    <Box sx={{ my: 4 }}>
      {children}
    </Box>
  </Container>
);

export default Layout;
