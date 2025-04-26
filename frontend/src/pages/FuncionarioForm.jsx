import React from 'react';
import { Box, TextField, Button, Typography, Toolbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FuncionarioForm = () => {
  const onSubmit = (data) => {
    console.log("Dados do Funcionário:", data);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
              to="/"
              sx={{ fontFamily: 'Poppins', fontSize: '1rem' }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo da Página */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
        <Box sx={{ backgroundColor: '#f5f0fb', padding: 4, width: 600 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: 'Poppins', color: '#8e7cc3' }}>
            Cadastro de Funcionário
          </Typography>

          <form onSubmit={onSubmit}>
            <TextField label="Nome" fullWidth sx={{ marginBottom: 2 }} />
            <TextField label="CPF" fullWidth sx={{ marginBottom: 2 }} />
            <TextField label="Telefone" fullWidth sx={{ marginBottom: 2 }} />

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="cargo-label">Cargo</InputLabel>
              <Select labelId="cargo-label" label="Cargo">
                <MenuItem value="gerente">Gerente</MenuItem>
                <MenuItem value="atendente">Atendente</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#8e7cc3', color: '#fff' }}>
              Cadastrar
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default FuncionarioForm;
