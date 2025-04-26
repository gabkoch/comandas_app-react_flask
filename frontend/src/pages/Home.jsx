import React from "react";
import { Box, Typography, Paper, AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff' }}>
      {/* Barra de Navegação */}
      <AppBar position="sticky" sx={{ backgroundColor: '#8e7cc3' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontSize: '1.5rem', color: '#fff' }}>Comandas</Typography>
          <Box>
            <Button 
              color="inherit" 
              component={Link} 
              to="/home" 
              sx={{ fontFamily: 'Poppins', fontSize: '1rem' }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/funcionarios" 
              sx={{ fontFamily: 'Poppins', fontSize: '1rem' }}
            >
              Funcionários
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/clientes" 
              sx={{ fontFamily: 'Poppins', fontSize: '1rem' }}
            >
              Clientes
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/produtos" 
              sx={{ fontFamily: 'Poppins', fontSize: '1rem' }}
            >
              Produtos
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login" 
              sx={{ fontFamily: 'Poppins', fontSize: '1rem' }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo da Página */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <Paper elevation={6} sx={{ p: 4, width: 600, backgroundColor: '#f5f0fb' }}>
          <Typography variant="h5" sx={{ textAlign: 'center', fontFamily: 'Poppins', color: '#8e7cc3' }} gutterBottom>
            Home
          </Typography>

          <Typography variant="body1" sx={{ mb: 1, fontFamily: 'Poppins', textAlign: 'center', color: '#8e7cc3' }}>
            Bem-vindo ao aplicativo Comandas!
          </Typography>

          <Typography variant="body2" sx={{ mb: 1, fontFamily: 'Poppins', textAlign: 'center', color: '#8e7cc3' }}>
            Explore as funcionalidades e aproveite sua experiência.
          </Typography>

          <Typography variant="body2" sx={{ fontFamily: 'Poppins', textAlign: 'center', color: '#8e7cc3' }}>
            {`Data atual: ${new Date().toLocaleDateString()}`}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;
