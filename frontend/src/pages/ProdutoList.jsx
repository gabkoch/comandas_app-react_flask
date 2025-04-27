import React, { useState } from "react";
import { Box, Typography, Paper, AppBar, Toolbar, Button, Modal, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const produtosData = [
  { id: 1, nome: 'Camisa do Internacional', preco: 'R$ 159,90', categoria: 'Camisas' },
  { id: 2, nome: 'Camisa do Flamengo', preco: 'R$ 159,90', categoria: 'Camisas' },
  { id: 3, nome: 'Camisa do Palmeiras', preco: 'R$ 149,90', categoria: 'Camisas' },
  { id: 4, nome: 'Camisa do São Paulo', preco: 'R$ 159,90', categoria: 'Camisas' },
  { id: 5, nome: 'Pano de Chão Grêmio', preco: 'R$ 0,00', categoria: 'Acessórios' },
  { id: 6, nome: 'Camisa do Barcelona', preco: 'R$ 179,90', categoria: 'Camisas' },
  { id: 7, nome: 'Camisa do Real Madrid', preco: 'R$ 179,90', categoria: 'Camisas' }
];

const ProdutoList = () => {
  const [produtos, setProdutos] = useState(produtosData);
  const [openModal, setOpenModal] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    preco: '',
    categoria: ''
  });

  // Função para abrir o modal
  const abrirModal = () => setOpenModal(true);

  // Função para fechar o modal
  const fecharModal = () => setOpenModal(false);

  // Função para adicionar um novo produto
  const adicionarProduto = () => {
    setProdutos([
      ...produtos,
      { id: produtos.length + 1, ...novoProduto }
    ]);
    fecharModal();
  };

  // Função para lidar com os inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto({ ...novoProduto, [name]: value });
  };

  // Funções de ação para os botões
  const visualizarProduto = (id) => {
    console.log("Visualizar Produto com ID:", id);
  };

  const editarProduto = (id) => {
    console.log("Editar Produto com ID:", id);
  };

  const excluirProduto = (id) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

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

      {/* Botão para adicionar um novo produto */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#8e7cc3' }}>
          Lista de Produtos
        </Typography>
        <Button
          variant="contained"
          color="primary" // Ajuste a cor para o lilás claro que você quer
          sx={{ fontFamily: 'Poppins', backgroundColor: '#c1a5db' }} // Cor lilás claro
          onClick={abrirModal}
        >
          Novo Produto
        </Button>
      </Box>

      {/* Modal para adicionar novo produto */}
      <Modal open={openModal} onClose={fecharModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: 4,
          borderRadius: 2,
          width: 400,
          boxShadow: 24
        }}>
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontFamily: 'Poppins', color: '#8e7cc3' }}>
            Dados Produto
          </Typography>
          <TextField
            fullWidth
            label="ID"
            name="id"
            value={novoProduto.id}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={novoProduto.nome}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Preço"
            name="preco"
            value={novoProduto.preco}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              label="Categoria"
              name="categoria"
              value={novoProduto.categoria}
              onChange={handleChange}
            >
              <MenuItem value="Camisas">Camisas</MenuItem>
              <MenuItem value="Acessórios">Acessórios</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={fecharModal}
              sx={{ fontFamily: 'Poppins', borderColor: '#8e7cc3', color: '#8e7cc3' }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={adicionarProduto}
              sx={{ fontFamily: 'Poppins', backgroundColor: '#8e7cc3' }}
            >
              Adicionar
            </Button>
          </Box>
        </Box>
      </Modal>

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
                  <TableCell sx={{ color: '#fff' }}><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id} sx={{ backgroundColor: produto.id % 2 === 0 ? '#f3f0f9' : '#fff' }}>
                    <TableCell>{produto.id}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell>{produto.preco}</TableCell>
                    <TableCell>
                      <VisibilityIcon sx={{ marginRight: 1, cursor: 'pointer' }} onClick={() => visualizarProduto(produto.id)} />
                      <EditIcon sx={{ marginRight: 1, cursor: 'pointer' }} onClick={() => editarProduto(produto.id)} />
                      <DeleteIcon sx={{ cursor: 'pointer' }} onClick={() => excluirProduto(produto.id)} />
                    </TableCell>
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
