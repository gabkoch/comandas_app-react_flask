import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const loginRealizado = localStorage.getItem('loginRealizado');

  const handleLogout = () => {
    localStorage.removeItem('loginRealizado');
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Comandas</Typography>
          {loginRealizado && (
            <>
              <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
              <Button color="inherit" onClick={() => navigate('/funcionarios')}>Funcionários</Button>
              <Button color="inherit" onClick={() => navigate('/funcionarioform')}>Cadastrar Funcionários</Button>
              <Button color="inherit" onClick={() => navigate('/clientes')}>Clientes</Button>
              <Button color="inherit" onClick={() => navigate('/clienteform')}>Cadastrar Clientes</Button>
              <Button color="inherit" onClick={() => navigate('/produtos')}>Produtos</Button>
              <Button color="inherit" onClick={() => navigate('/produtoform')}>Cadastrar Produtos</Button>             
              <Button color="inherit" onClick={handleLogout}>Sair</Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
