import React from 'react';
import { Box, Typography, AppBar, Toolbar, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';

const produtos = [
  { id: 1, nome: 'Camisa do Internacional', preco: 'R$ 159,90', categoria: 'Camisas' },
  { id: 2, nome: 'Camisa do Flamengo', preco: 'R$ 159,90', categoria: 'Camisas' },
  { id: 3, nome: 'Camisa do Palmeiras', preco: 'R$ 149,90', categoria: 'Camisas' },
  { id: 4, nome: 'Camisa do São Paulo', preco: 'R$ 159,90', categoria: 'Camisas' },
  { id: 5, nome: 'Pano de Chão Grêmio', preco: 'R$ 0,00', categoria: 'Acessórios' },
  { id: 6, nome: 'Camisa do Barcelona', preco: 'R$ 179,90', categoria: 'Camisas' },
  { id: 7, nome: 'Camisa do Real Madrid', preco: 'R$ 179,90', categoria: 'Camisas' }
];

const ProdutoList = () => {
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
              to="/"
              sx={{ fontFamily: 'Poppins', fontSize: '1rem' }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Título e Botão de Adicionar Produto */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#8e7cc3' }}>
          Lista de Produtos
        </Typography>
      </Box>

      {/* Conteúdo da Página */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
        <Paper elevation={6} sx={{ p: 4, width: 800, backgroundColor: '#f5f0fb' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#8e7cc3' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}><strong>ID</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Nome</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Categoria</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Preço</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id} sx={{ backgroundColor: produto.id % 2 === 0 ? '#f3f0f9' : '#fff' }}>
                    <TableCell>{produto.id}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell>{produto.preco}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProdutoList;
