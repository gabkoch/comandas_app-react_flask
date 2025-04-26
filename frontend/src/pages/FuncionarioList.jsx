import React, { useState } from "react";
import { Box, Typography, Paper, AppBar, Toolbar, Button, Modal, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Dados de exemplo com jogadores famosos (Lewandowski e Modrić como cargos de loja)
const funcionariosData = [
  { id: 1, nome: 'Gabriela Koch', cpf: '013.962.129-65', telefone: '(49) 99803-9192', cargo: 'Supervisor' },
  { id: 2, nome: 'Cristiano Ronaldo', cpf: '070.707.070-77', telefone: '(49) 07070-7070', cargo: 'Gerente'},
  { id: 6, nome: 'Robert Lewandowski', cpf: '567.890.123-44', telefone: '(49) 95555-5555', cargo: 'Vendedor' },
  { id: 8, nome: 'Luka Modrić', cpf: '456.789.012-33', telefone: '(49) 98888-8888', cargo: 'Supervisor' }
];

const FuncionarioList = () => {
  const [funcionarios, setFuncionarios] = useState(funcionariosData);
  const [openModal, setOpenModal] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    cpf: '',
    matricula: '',
    telefone: '',
    senha: '',
    cargo: ''
  });

  // Função para abrir o modal
  const abrirModal = () => setOpenModal(true);

  // Função para fechar o modal
  const fecharModal = () => setOpenModal(false);

  // Função para adicionar um novo funcionário
  const adicionarFuncionario = () => {
    setFuncionarios([
      ...funcionarios,
      { id: funcionarios.length + 1, ...novoFuncionario }
    ]);
    fecharModal();
  };

  // Função para excluir um funcionário
  const excluirFuncionario = (id) => {
    setFuncionarios(funcionarios.filter(f => f.id !== id));
  };

  // Função para editar um funcionário
  const editarFuncionario = (id) => {
    // Aqui você pode abrir um modal ou redirecionar para outra página para edição
    console.log("Editar Funcionário com ID:", id);
  };

  // Função para visualizar um funcionário
  const visualizarFuncionario = (id) => {
    // Aqui você pode abrir um modal ou uma página para visualizar os detalhes do funcionário
    console.log("Visualizar Funcionário com ID:", id);
  };

  // Função para lidar com os inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoFuncionario({ ...novoFuncionario, [name]: value });
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

      {/* Botão para adicionar um novo funcionário */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#8e7cc3' }}>
          Lista de Funcionários
        </Typography>
        <Button
          variant="contained"
          color="primary" // Ajuste a cor para o lilás claro que você quer
          sx={{ fontFamily: 'Poppins', backgroundColor: '#c1a5db' }} // Cor lilás claro
          onClick={abrirModal}
        >
          Novo Funcionário
        </Button>
      </Box>

      {/* Modal para adicionar novo funcionário */}
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
            Dados Funcionário
          </Typography>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={novoFuncionario.nome}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={novoFuncionario.cpf}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Matrícula"
            name="matricula"
            value={novoFuncionario.matricula}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Telefone"
            name="telefone"
            value={novoFuncionario.telefone}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Senha"
            name="senha"
            value={novoFuncionario.senha}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Cargo</InputLabel>
            <Select
              label="Cargo"
              name="cargo"
              value={novoFuncionario.cargo}
              onChange={handleChange}
            >
              <MenuItem value="Supervisor">Supervisor</MenuItem>
              <MenuItem value="Vendedor">Vendedor</MenuItem>
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
              onClick={adicionarFuncionario}
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
                  <TableCell sx={{ color: '#fff' }}><strong>CPF</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Telefone</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Cargo</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {funcionarios.map((f) => (
                  <TableRow key={f.id} sx={{ backgroundColor: f.id % 2 === 0 ? '#f3f0f9' : '#fff' }}>
                    <TableCell>{f.id}</TableCell>
                    <TableCell>{f.nome}</TableCell>
                    <TableCell>{f.cpf}</TableCell>
                    <TableCell>{f.telefone}</TableCell>
                    <TableCell>{f.cargo}</TableCell>
                    <TableCell>
                      <VisibilityIcon sx={{ marginRight: 1, cursor: 'pointer' }} onClick={() => visualizarFuncionario(f.id)} />
                      <EditIcon sx={{ marginRight: 1, cursor: 'pointer' }} onClick={() => editarFuncionario(f.id)} />
                      <DeleteIcon sx={{ cursor: 'pointer' }} onClick={() => excluirFuncionario(f.id)} />
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

export default FuncionarioList;
