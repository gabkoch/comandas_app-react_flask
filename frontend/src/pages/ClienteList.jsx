import React, { useState } from "react";
import { Box, Typography, Modal, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import InputMask from "react-input-mask"; // <- IMPORTANTE: importa o InputMask!

// Dados de exemplo com clientes
const clientesData = [
  { id: 'Neymar Jr', nome: 'Neymar Jr', cpf: '101.010.101-10', telefone: '(49) 99991-1111' },
  { id: 'Andrés D\'Alessandro', nome: 'Andrés D\'Alessandro', cpf: '010.101.010-10', telefone: '(49) 99990-1010' },
  { id: 'Kevin De Bruyne', nome: 'Kevin De Bruyne', cpf: '202.202.202-20', telefone: '(49) 99992-2222' },
  { id: 'Alisson Becker', nome: 'Alisson Becker', cpf: '303.303.303-30', telefone: '(49) 99993-3333' }
];

const ClienteList = () => {
  const [clientes, setClientes] = useState(clientesData);
  const [openModal, setOpenModal] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    cpf: '',
    telefone: ''
  });

  const abrirModal = () => setOpenModal(true);
  const fecharModal = () => setOpenModal(false);

  const adicionarCliente = () => {
    setClientes([...clientes, { id: novoCliente.nome, ...novoCliente }]);
    fecharModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoCliente({ ...novoCliente, [name]: value });
  };

  const editarCliente = (id) => {
    alert(`Editar cliente: ${id}`);
  };

  const visualizarCliente = (id) => {
    alert(`Visualizar cliente: ${id}`);
  };

  const excluirCliente = (id) => {
    setClientes(clientes.filter(cliente => cliente.id !== id));
  };

  return (
    <Box sx={styles.page}>
      <Typography variant="h5" color="text.primary" sx={styles.title}>Lista de Clientes</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2, backgroundColor: '#8e7cc3', fontFamily: 'Poppins' }}
        onClick={abrirModal}
      >
        Novo Cliente
      </Button>

      <Modal open={openModal} onClose={fecharModal}>
        <Box sx={styles.modal}>
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
          />

          {/* Campo de CPF com máscara */}
          <InputMask
            mask="999.999.999-99"
            value={novoCliente.cpf}
            onChange={handleChange}
          >
            {() => (
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                sx={{ mb: 2 }}
              />
            )}
          </InputMask>

          {/* Campo de Telefone com máscara */}
          <InputMask
            mask="(99) 99999-9999"
            value={novoCliente.telefone}
            onChange={handleChange}
          >
            {() => (
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                sx={{ mb: 2 }}
              />
            )}
          </InputMask>

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

      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table>
          <TableHead sx={styles.tableHead}>
            <TableRow>
              <TableCell sx={styles.tableCell}><strong>ID</strong></TableCell>
              <TableCell sx={styles.tableCell}><strong>Nome</strong></TableCell>
              <TableCell sx={styles.tableCell}><strong>CPF</strong></TableCell>
              <TableCell sx={styles.tableCell}><strong>Telefone</strong></TableCell>
              <TableCell sx={styles.tableCell}><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell sx={styles.tableCell}>{cliente.id}</TableCell>
                <TableCell sx={styles.tableCell}>{cliente.nome}</TableCell>
                <TableCell sx={styles.tableCell}>{cliente.cpf}</TableCell>
                <TableCell sx={styles.tableCell}>{cliente.telefone}</TableCell>
                <TableCell sx={styles.tableCell}>
                  <IconButton onClick={() => visualizarCliente(cliente.id)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => editarCliente(cliente.id)} color="secondary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => excluirCliente(cliente.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const styles = {
  page: {
    backgroundColor: '#f3e5f5',
    padding: 3,
    borderRadius: 3,
    maxWidth: 800,
    margin: 'auto',
    mt: 4
  },
  title: {
    color: '#8e24aa',
    fontWeight: 600
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    marginTop: 3
  },
  tableHead: {
    backgroundColor: '#e1bee7',
  },
  tableCell: {
    padding: '12px 16px',
    color: '#444',
    fontWeight: 500,
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 2,
    width: 400,
    boxShadow: 24
  }
};

export default ClienteList;
