import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, AppBar, Toolbar, Button, Modal, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Alert, Snackbar } from "@mui/material";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from "jspdf";
import "jspdf-autotable";

// Dados de exemplo com jogadores famosos (Lewandowski e Modrić como cargos de loja)
const funcionariosData = [
  { id: 1, nome: 'Gabriela Koch', cpf: '013.962.129-65', telefone: '(49) 99803-9192', cargo: 'Supervisor', matricula: 'F001', senha: '123' },
  { id: 2, nome: 'Cristiano Ronaldo', cpf: '070.707.070-77', telefone: '(49) 07070-7070', cargo: 'Gerente', matricula: 'F002', senha: 'abc' },
  { id: 6, nome: 'Robert Lewandowski', cpf: '567.890.123-44', telefone: '(49) 95555-5555', cargo: 'Vendedor', matricula: 'F003', senha: '456' },
  { id: 8, nome: 'Luka Modrić', cpf: '456.789.012-33', telefone: '(49) 98888-8888', cargo: 'Supervisor', matricula: 'F004', senha: 'def' }
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

const FuncionarioList = () => {
  const [funcionarios, setFuncionarios] = useState(funcionariosData);
  const [openModal, setOpenModal] = useState(false); // Modal de adição
  const [openEditModal, setOpenEditModal] = useState(false); // Modal de edição
  const [openViewModal, setOpenViewModal] = useState(false); // Modal de visualização
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); // Modal de confirmação de exclusão
  const [currentFuncionario, setCurrentFuncionario] = useState(null); // Estado para o funcionário sendo editado/visualizado/excluído
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    cpf: '',
    matricula: '',
    telefone: '',
    senha: '',
    cargo: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // useEffect para depuração (pode remover após confirmar que funciona)
  useEffect(() => {
    if (openViewModal && currentFuncionario) {
      console.log("Dados do funcionário no modal de visualização:", currentFuncionario);
    }
    if (openDeleteConfirm && currentFuncionario) {
      console.log("Dados do funcionário no modal de exclusão:", currentFuncionario);
    }
  }, [openViewModal, openDeleteConfirm, currentFuncionario]);


  // Função para abrir o modal de adição
  const abrirModal = () => {
    setNovoFuncionario({
      nome: '',
      cpf: '',
      matricula: '',
      telefone: '',
      senha: '',
      cargo: ''
    });
    setOpenModal(true);
  };

  // Função para fechar o modal de adição
  const fecharModal = () => setOpenModal(false);

  // Função para abrir o modal de edição
  const abrirEditModal = (funcionario) => {
    setCurrentFuncionario({ ...funcionario });
    setOpenEditModal(true);
  };

  // Função para fechar o modal de edição
  const fecharEditModal = () => setOpenEditModal(false);

  // Função para abrir o modal de visualização
  const abrirViewModal = (funcionario) => {
    setCurrentFuncionario(funcionario);
    setOpenViewModal(true);
  };

  // Função para fechar o modal de visualização
  const fecharViewModal = () => setOpenViewModal(false);

  // Função para abrir o modal de confirmação de exclusão
  const abrirDeleteConfirm = (funcionario) => {
    setCurrentFuncionario(funcionario);
    setOpenDeleteConfirm(true);
  };

  // Função para fechar o modal de confirmação de exclusão
  const fecharDeleteConfirm = () => setOpenDeleteConfirm(false);

  // Função para adicionar um novo funcionário
  const adicionarFuncionario = () => {
    if (!novoFuncionario.nome || !novoFuncionario.cpf || !novoFuncionario.telefone || !novoFuncionario.cargo) {
      setSnackbar({ open: true, message: 'Por favor, preencha os campos obrigatórios (Nome, CPF, Telefone, Cargo).', severity: 'error' });
      return;
    }

    setFuncionarios((prevFuncionarios) => [
      ...prevFuncionarios,
      { id: prevFuncionarios.length > 0 ? Math.max(...prevFuncionarios.map(f => f.id)) + 1 : 1, ...novoFuncionario }
    ]);
    fecharModal();
    setSnackbar({ open: true, message: 'Funcionário adicionado com sucesso!', severity: 'success' });
  };

  // Função para salvar a edição do funcionário
  const salvarEdicaoFuncionario = () => {
    if (!currentFuncionario.nome || !currentFuncionario.cpf || !currentFuncionario.telefone || !currentFuncionario.cargo) {
        setSnackbar({ open: true, message: 'Por favor, preencha os campos obrigatórios para edição (Nome, CPF, Telefone, Cargo).', severity: 'error' });
        return;
    }

    setFuncionarios((prevFuncionarios) =>
      prevFuncionarios.map(f => f.id === currentFuncionario.id ? currentFuncionario : f)
    );
    fecharEditModal();
    setSnackbar({ open: true, message: 'Funcionário editado com sucesso!', severity: 'success' });
  };

  // Função para excluir um funcionário
  const excluirFuncionario = () => {
    setFuncionarios((prevFuncionarios) =>
      prevFuncionarios.filter(f => f.id !== currentFuncionario.id)
    );
    fecharDeleteConfirm();
    setSnackbar({ open: true, message: 'Funcionário excluído com sucesso!', severity: 'success' });
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
    setNovoFuncionario({ ...novoFuncionario, [name]: formattedValue });
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
    setCurrentFuncionario({ ...currentFuncionario, [name]: formattedValue });
  };

  // Função para exportar a lista de funcionários para PDF
  const exportarFuncionariosPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Nome', 'CPF', 'Telefone', 'Cargo']],
      body: funcionarios.map(f => [f.id, f.nome, f.cpf, f.telefone, f.cargo]),
      headStyles: { fillColor: [142, 124, 195] },
      alternateRowStyles: { fillColor: [245, 240, 251] },
    });
    doc.save('lista_funcionarios.pdf');
    setSnackbar({ open: true, message: 'PDF de funcionários exportado com sucesso!', severity: 'success' });
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

      {/* Botão para adicionar um novo funcionário e exportar PDF */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#8e7cc3' }}>
          Lista de Funcionários
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ fontFamily: 'Poppins', backgroundColor: '#c1a5db', mr: 2 }}
            onClick={abrirModal}
          >
            Novo Funcionário
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontFamily: 'Poppins', backgroundColor: '#4CAF50' }}
            onClick={exportarFuncionariosPdf}
            startIcon={<PictureAsPdfIcon />}
          >
            Exportar PDF
          </Button>
        </Box>
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
            required
          />
          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={novoFuncionario.cpf}
            onChange={handleChange}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 14 }} // Limite para CPF formatado
            required
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
            inputProps={{ maxLength: 15 }} // Limite para telefone formatado
            required
          />
          <TextField
            fullWidth
            label="Senha"
            name="senha"
            value={novoFuncionario.senha}
            onChange={handleChange}
            sx={{ mb: 2 }}
            type="password" // Para ocultar a senha
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel required>Cargo</InputLabel>
            <Select
              label="Cargo"
              name="cargo"
              value={novoFuncionario.cargo}
              onChange={handleChange}
              required
            >
              <MenuItem value="Supervisor">Supervisor</MenuItem>
              <MenuItem value="Vendedor">Vendedor</MenuItem>
              <MenuItem value="Gerente">Gerente</MenuItem>
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

      {/* Modal para editar funcionário */}
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
            Editar Funcionário
          </Typography>
          {currentFuncionario && (
            <>
              <TextField
                fullWidth
                label="ID"
                name="id"
                value={currentFuncionario.id || ''}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={currentFuncionario.nome || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={currentFuncionario.cpf || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 14 }} // Limite para CPF formatado
                required
              />
              <TextField
                fullWidth
                label="Matrícula"
                name="matricula"
                value={currentFuncionario.matricula || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={currentFuncionario.telefone || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 15 }} // Limite para telefone formatado
                required
              />
              <TextField
                fullWidth
                label="Senha"
                name="senha"
                value={currentFuncionario.senha || ''}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
                type="password"
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel required>Cargo</InputLabel>
                <Select
                  label="Cargo"
                  name="cargo"
                  value={currentFuncionario.cargo || ''}
                  onChange={handleEditChange}
                  required
                >
                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                  <MenuItem value="Vendedor">Vendedor</MenuItem>
                  <MenuItem value="Gerente">Gerente</MenuItem>
                </Select>
              </FormControl>
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
                  onClick={salvarEdicaoFuncionario}
                  sx={{ fontFamily: 'Poppins', backgroundColor: '#8e7cc3' }}
                >
                  Salvar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal para visualizar funcionário (apenas cor de texto ajustada, máscaras são para input) */}
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
            Detalhes do Funcionário
          </Typography>
          {currentFuncionario ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>ID:</strong> {currentFuncionario?.id}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>Nome:</strong> {currentFuncionario?.nome}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>CPF:</strong> {currentFuncionario?.cpf}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>Matrícula:</strong> {currentFuncionario?.matricula || 'Não informada'}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>Telefone:</strong> {currentFuncionario?.telefone}</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#333' }}><strong>Cargo:</strong> {currentFuncionario?.cargo}</Typography>
              <Button
                variant="contained"
                onClick={fecharViewModal}
                sx={{ fontFamily: 'Poppins', backgroundColor: '#8e7cc3', mt: 2 }}
              >
                Fechar
              </Button>
            </Box>
          ) : (
            <Typography sx={{ color: '#333' }}>Nenhum funcionário selecionado para visualização.</Typography>
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
          {currentFuncionario ? (
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: '#333' }}>
              Tem certeza que deseja excluir o funcionário **{currentFuncionario.nome}** (ID: {currentFuncionario.id})?
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: '#333' }}>
              Tem certeza que deseja excluir este funcionário?
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
              onClick={excluirFuncionario}
              sx={{ fontFamily: 'Poppins', backgroundColor: '#d32f2f' }}
            >
              Excluir
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
                      <IconButton onClick={() => abrirViewModal(f)} color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => abrirEditModal(f)} color="secondary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => abrirDeleteConfirm(f)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Snackbar para mensagens de feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FuncionarioList;