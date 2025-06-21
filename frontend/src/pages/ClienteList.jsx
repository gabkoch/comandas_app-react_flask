import React, { useState, useEffect } from "react";
import { Box, Typography, Modal, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, AppBar, Toolbar, Alert, Snackbar } from "@mui/material";
import { Link } from "react-router-dom";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from "jspdf";
import "jspdf-autotable";

// Dados de exemplo com clientes mais completos
const clientesData = [
  { id: 'Neymar Jr', nome: 'Neymar Jr', cpf: '101.010.101-10', telefone: '(49) 99991-1111', email: 'neymar@example.com', endereco: 'Rua da Bola, 10, Paris' },
  { id: 'Andrés D\'Alessandro', nome: 'Andrés D\'Alessandro', cpf: '010.101.010-10', telefone: '(49) 99990-1010', email: 'dale10@example.com', endereco: 'Avenida Beira-Rio, 10, Porto Alegre' },
  { id: 'Kevin De Bruyne', nome: 'Kevin De Bruyne', cpf: '202.202.202-20', telefone: '(49) 99992-2222', email: 'kdb@example.com', endereco: 'City Ground, 17, Manchester' },
  { id: 'Alisson Becker', nome: 'Alisson Becker', cpf: '303.303.303-30', telefone: '(49) 99993-3333', email: 'alisson@example.com', endereco: 'Anfield Road, 1, Liverpool' }
];

// Funções de formatação de CPF e Telefone
const formatCPF = (value) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
    .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Adiciona o traço
    .slice(0, 14); // Limita a 14 caracteres (incluindo pontos e traço)
};

const formatPhone = (value) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/^(\d{2})(\d)/g, '($1) $2') // Adiciona parênteses no DDD
    .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona traço no número
    .slice(0, 15); // Limita a 15 caracteres (incluindo parênteses, espaço e traço)
};

const ClienteList = () => {
  const [clientes, setClientes] = useState(clientesData);
  const [openModal, setOpenModal] = useState(false); // Modal de adição
  const [openEditModal, setOpenEditModal] = useState(false); // Modal de edição
  const [openViewModal, setOpenViewModal] = useState(false); // Modal de visualização
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); // Modal de confirmação de exclusão
  const [currentCliente, setCurrentCliente] = useState(null); // Cliente sendo editado/visualizado/excluído
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // useEffect para depuração (opcional, remova após confirmar que funciona)
  useEffect(() => {
    if (openViewModal && currentCliente) {
      console.log("Dados do cliente no modal de visualização:", currentCliente);
    }
    if (openDeleteConfirm && currentCliente) {
      console.log("Dados do cliente no modal de exclusão:", currentCliente);
    }
  }, [openViewModal, openDeleteConfirm, currentCliente]);

  // Função para abrir o modal de adição
  const abrirModal = () => {
    setNovoCliente({
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      endereco: ''
    });
    setOpenModal(true);
  };

  // Função para fechar o modal de adição
  const fecharModal = () => setOpenModal(false);

  // Função para abrir o modal de edição
  const abrirEditModal = (cliente) => {
    setCurrentCliente({ ...cliente });
    setOpenEditModal(true);
  };

  // Função para fechar o modal de edição
  const fecharEditModal = () => setOpenEditModal(false);

  // Função para abrir o modal de visualização
  const abrirViewModal = (cliente) => {
    setCurrentCliente(cliente);
    setOpenViewModal(true);
  };

  // Função para fechar o modal de visualização
  const fecharViewModal = () => setOpenViewModal(false);

  // Função para abrir o modal de confirmação de exclusão
  const abrirDeleteConfirm = (cliente) => {
    setCurrentCliente(cliente);
    setOpenDeleteConfirm(true);
  };

  // Função para fechar o modal de confirmação de exclusão
  const fecharDeleteConfirm = () => setOpenDeleteConfirm(false);

  // Função para adicionar um novo cliente
  const adicionarCliente = () => {
    if (!novoCliente.nome || !novoCliente.cpf || !novoCliente.telefone || !novoCliente.email) {
      setSnackbar({ open: true, message: 'Por favor, preencha os campos obrigatórios (Nome, CPF, Telefone, Email).', severity: 'error' });
      return;
    }

    setClientes((prevClientes) => [
      ...prevClientes,
      { id: novoCliente.nome, ...novoCliente }
    ]);
    fecharModal();
    setSnackbar({ open: true, message: 'Cliente adicionado com sucesso!', severity: 'success' });
  };

  // Função para salvar a edição do cliente
  const salvarEdicaoCliente = () => {
    if (!currentCliente.nome || !currentCliente.cpf || !currentCliente.telefone || !currentCliente.email) {
      setSnackbar({ open: true, message: 'Por favor, preencha os campos obrigatórios para edição (Nome, CPF, Telefone, Email).', severity: 'error' });
      return;
    }

    setClientes((prevClientes) =>
      prevClientes.map(cliente => cliente.id === currentCliente.id ? currentCliente : cliente)
    );
    fecharEditModal();
    setSnackbar({ open: true, message: 'Cliente editado com sucesso!', severity: 'success' });
  };

  // Função para excluir um cliente
  const excluirCliente = () => {
    setClientes((prevClientes) => prevClientes.filter(cliente => cliente.id !== currentCliente.id));
    fecharDeleteConfirm();
    setSnackbar({ open: true, message: 'Cliente excluído com sucesso!', severity: 'success' });
  };

  // Função para lidar com os inputs do formulário de adição (inclui máscaras)
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }
    setNovoCliente({ ...novoCliente, [name]: formattedValue });
  };

  // Função para lidar com os inputs do formulário de edição (inclui máscaras)
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }
    setCurrentCliente({ ...currentCliente, [name]: formattedValue });
  };

  // Função para exportar a lista de clientes para PDF
  const exportarClientesPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Nome', 'CPF', 'Telefone', 'Email', 'Endereço']],
      body: clientes.map(cliente => [cliente.id, cliente.nome, cliente.cpf, cliente.telefone, cliente.email, cliente.endereco]),
      headStyles: { fillColor: [142, 124, 195] },
      alternateRowStyles: { fillColor: [245, 240, 251] },
    });
    doc.save('lista_clientes.pdf');
    setSnackbar({ open: true, message: 'PDF de clientes exportado com sucesso!', severity: 'success' });
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

      {/* Botão para adicionar um novo cliente e exportar PDF */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#8e7cc3' }}>
          Lista de Clientes
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ fontFamily: 'Poppins', backgroundColor: '#c1a5db', mr: 2 }}
            onClick={abrirModal}
          >
            Novo Cliente
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontFamily: 'Poppins', backgroundColor: '#4CAF50' }}
            onClick={exportarClientesPdf}
            startIcon={<PictureAsPdfIcon />}
          >
            Exportar PDF
          </Button>
        </Box>
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
                  <TableCell sx={{ color: '#fff' }}><strong>CPF</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Telefone</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id} sx={{ backgroundColor: cliente.id % 2 === 0 ? '#f3f0f9' : '#fff' }}>
                    <TableCell>{cliente.id}</TableCell>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{cliente.cpf}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => abrirViewModal(cliente)} color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => abrirEditModal(cliente)} color="secondary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => abrirDeleteConfirm(cliente)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Modal para adicionar novo cliente */}
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
            Dados Cliente
          </Typography>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={novoCliente.nome}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={novoCliente.cpf}
            onChange={handleChange}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 14 }} // Limite para CPF formatado
            required
          />
          <TextField
            fullWidth
            label="Telefone"
            name="telefone"
            value={novoCliente.telefone}
            onChange={handleChange}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 15 }} // Limite para telefone formatado
            required
          />
          <TextField
            fullWidth
            label="E-mail"
            name="email"
            value={novoCliente.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Endereço (opcional)"
            name="endereco"
            value={novoCliente.endereco}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
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
              onClick={adicionarCliente}
              sx={{ fontFamily: 'Poppins', backgroundColor: '#8e7cc3' }}
            >
              Adicionar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal para editar cliente */}
      <Modal open={openEditModal} onClose={fecharEditModal}>
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
            Editar Cliente
          </Typography>
          {currentCliente && (
            <>
              <TextField
                fullWidth
                label="ID"
                name="id"
                value={currentCliente.id || ''}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={currentCliente.nome || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={currentCliente.cpf || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 14 }} // Limite para CPF formatado
                required
              />
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={currentCliente.telefone || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 15 }} // Limite para telefone formatado
                required
              />
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                value={currentCliente.email || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Endereço (opcional)"
                name="endereco"
                value={currentCliente.endereco || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={fecharEditModal}
                  sx={{ fontFamily: 'Poppins', borderColor: '#8e7cc3', color: '#8e7cc3' }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={salvarEdicaoCliente}
                  sx={{ fontFamily: 'Poppins', backgroundColor: '#8e7cc3' }}
                >
                  Salvar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal para visualizar cliente (apenas cor de texto ajustada, máscaras são para input) */}
      <Modal open={openViewModal} onClose={fecharViewModal}>
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
            Detalhes do Cliente
          </Typography>
          {currentCliente ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>ID:</strong> {currentCliente?.id}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>Nome:</strong> {currentCliente?.nome}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>CPF:</strong> {currentCliente?.cpf}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>Telefone:</strong> {currentCliente?.telefone}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>E-mail:</strong> {currentCliente?.email || 'Não informado'}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>Endereço:</strong> {currentCliente?.endereco || 'Não informado'}</Typography>
              <Button
                variant="contained"
                onClick={fecharViewModal}
                sx={{ fontFamily: 'Poppins', backgroundColor: '#8e7cc3', mt: 2 }}
              >
                Fechar
              </Button>
            </Box>
          ) : (
            <Typography sx={{ color: '#333' }}>Nenhum cliente selecionado para visualização.</Typography>
          )}
        </Box>
      </Modal>

      {/* Modal de confirmação de exclusão (apenas cor de texto ajustada) */}
      <Modal open={openDeleteConfirm} onClose={fecharDeleteConfirm}>
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
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontFamily: 'Poppins', color: '#d32f2f' }}>
            Confirmar Exclusão
          </Typography>
          {currentCliente ? (
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: '#333' }}>
              Tem certeza que deseja excluir o cliente **{currentCliente.nome}** (ID: {currentCliente.id})?
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: '#333' }}>
              Tem certeza que deseja excluir este cliente?
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={fecharDeleteConfirm}
              sx={{ fontFamily: 'Poppins', borderColor: '#8e7cc3', color: '#8e7cc3' }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={excluirCliente}
              sx={{ fontFamily: 'Poppins', backgroundColor: '#d32f2f' }}
            >
              Excluir
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar para mensagens de feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Seus estilos originais da ClienteList, se houver
const styles = {
  page: {
    backgroundColor: '#f3e5f5', // lilás claro
    padding: 3,
    borderRadius: 3,
    maxWidth: 800,
    margin: 'auto',
    mt: 4
  },
  title: {
    color: '#8e24aa', // lilás forte
    fontWeight: 600
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    marginTop: 3
  },
  tableHead: {
    backgroundColor: '#e1bee7', // lilás suave
  },
  tableCell: {
    padding: '12px 16px',
    color: '#444',
    fontWeight: 500,
  },
};


export default ClienteList;