import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const NotFound = () => {
  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f0fb' }}>
      <Paper elevation={3} sx={{ p: 4, width: 500, backgroundColor: '#fff' }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ textAlign: 'center', fontFamily: 'Poppins', color: '#8e7cc3' }}
        >
          404 - Página não encontrada {' '}
          <span role="img" aria-label="sad face">:(</span>
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ textAlign: 'center', fontFamily: 'Poppins', color: '#8e7cc3' }}
        >
          Verifique a URL ou retorne à página inicial.
        </Typography>
      </Paper>
    </Box>
  );
};

export default NotFound;
