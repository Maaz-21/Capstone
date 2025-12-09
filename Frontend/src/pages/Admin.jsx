import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Admin() {
  return (
    <Container className="py-8">
      <Typography variant="h4" className="mb-4">Admin</Typography>
      <Typography>Model monitoring, performance metrics and admin tools go here.</Typography>
    </Container>
  );
}
