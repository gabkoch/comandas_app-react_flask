import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Importações para PDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ProdutoList = () => {
  // Dados iniciais dos produtos, AGORA COM CAMINHOS ASSUMINDO public/ DIRETAMENTE
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Camisa do Internacional', preco: 'R$ 159,90', categoria: 'Camisas', foto: '/intertop.png' }, // Caminho ajustado
    { id: 2, nome: 'Pano de Chão Grêmio', preco: 'R$ 0,00', categoria: 'Acessórios', foto: '/gremioruim.png' }, // Caminho ajustado
    // Adicione mais produtos conforme necessário
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(''); // 'visualizar' | 'editar' | 'excluir' | 'novo'
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({ nome: '', preco: '', categoria: '', foto: '' });

  // useEffect para depuração (pode remover após confirmar que funciona)
  useEffect(() => {
    if (openDialog && selectedProduto) {
      console.log("Dados do produto no modal:", selectedProduto);
    }
  }, [openDialog, selectedProduto]);


  const openDialogAction = (mode, produto = null) => {
    setDialogMode(mode);
    setSelectedProduto(produto);
    if (mode === 'editar' && produto) {
      setFormData({ ...produto });
    } else if (mode === 'novo') {
      setFormData({ nome: '', preco: '', categoria: '', foto: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ nome: '', preco: '', categoria: '', foto: '' }); // Limpa formData ao fechar
  };

  const handleSaveProduct = () => {
    // Validação de campos obrigatórios antes de salvar
    if (!formData.nome || !formData.preco || !formData.categoria) {
      setSnackbar({ open: true, message: 'Por favor, preencha todos os campos obrigatórios (Nome, Preço, Categoria).', severity: 'error' });
      return; // Impede que a função continue se os campos não estiverem preenchidos
    }

    if (dialogMode === 'editar') {
      setProdutos((prev) =>
        prev.map((p) => (p.id === selectedProduto.id ? { ...formData, id: p.id } : p))
      );
      setSnackbar({ open: true, message: 'Produto editado com sucesso!', severity: 'success' });
    } else if (dialogMode === 'novo') {
      const newId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
      setProdutos((prev) => [...prev, { ...formData, id: newId }]);
      setSnackbar({ open: true, message: 'Produto adicionado com sucesso!', severity: 'success' });
    }
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    setProdutos((prev) => prev.filter((p) => p.id !== selectedProduto.id));
    setOpenDialog(false);
    setSnackbar({ open: true, message: 'Produto excluído com sucesso!', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto' && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // Armazena a imagem em Base64 para exibição e exportação de PDF
        setFormData((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file); // Lê o arquivo como Data URL (Base64)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Função para exportar PDF
  const exportPdf = () => {
    const doc = new jsPDF();
    doc.text("Lista de Produtos", 14, 16);

    const tableColumn = ["ID", "Nome", "Categoria", "Preço", "Foto"];
    const tableRows = [];

    const rowHeight = 20; // Aumentar a altura da linha para caber a imagem
    const imgSize = 15; // Tamanho da imagem no PDF
    const imgOffset = (rowHeight - imgSize) / 2; // Offset para centralizar a imagem verticalmente

    // Preparar os dados para a tabela do PDF
    produtos.forEach(produto => {
      tableRows.push([
        produto.id,
        produto.nome,
        produto.categoria,
        produto.preco,
        '' // Espaço reservado para a imagem
      ]);
    });

    doc.autoTable({
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [142, 124, 195] },
      alternateRowStyles: { fillColor: [245, 240, 251] },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak',
        valign: 'middle'
      },
      columnStyles: {
        4: { cellWidth: 20, halign: 'center' } // Aumentar a largura da coluna da foto
      },
      bodyStyles: { minCellHeight: rowHeight },
      didDrawCell: (data) => {
        // Verifica se é a coluna da foto e se há uma foto
        if (data.column.index === 4 && data.cell.section === 'body' && produtos[data.row.index].foto) {
          try {
            const imgSource = produtos[data.row.index].foto;
            // jsPDF pode ter problemas com URLs relativas em alguns ambientes.
            // Para imagens locais (public/), é melhor convertê-las para Base64 antes de adicioná-las aos dados iniciais,
            // ou garantir que o servidor de desenvolvimento as sirva corretamente.
            // No caso de upload, elas já vêm em Base64, o que é ideal.

            // Se for uma URL local (ex: /intertop.png), jsPDF precisa que seja carregada primeiro ou ser um Base64.
            // Para simplificar, vamos tentar adicionar como está, mas se falhar no PDF para imagens estáticas,
            // a solução mais robusta é ter todas as imagens (estáticas e upload) como Base64 no estado.

            const imgType = imgSource.startsWith('data:image/png') ? 'PNG' : imgSource.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG'; // Tenta inferir, fallback para PNG

            // Para depurar o PDF: verifique se imgSource é uma URL válida (Base64 ou HTTP)
            // e se imgType está correto.
            doc.addImage(
              imgSource,
              imgType,
              data.cell.x + imgOffset,
              data.cell.y + imgOffset,
              imgSize,
              imgSize
            );
          } catch (e) {
            console.error("Erro ao adicionar imagem ao PDF:", e);
            // Mostrar um texto de erro no PDF se a imagem não carregar
            doc.text("Erro na img", data.cell.x + 2, data.cell.y + data.cell.height / 2);
          }
        }
      },
    });

    doc.save('lista_produtos.pdf');
    setSnackbar({ open: true, message: 'PDF de produtos exportado com sucesso!', severity: 'success' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: '#8e7cc3' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Poppins', color: '#fff' }}>Comandas</Typography>
          <Box>
            <Button color="inherit" component={Link} to="/home">Home</Button>
            <Button color="inherit" component={Link} to="/funcionarios">Funcionários</Button>
            <Button color="inherit" component={Link} to="/clientes">Clientes</Button>
            <Button color="inherit" component={Link} to="/produtos">Produtos</Button>
            <Button color="inherit" component={Link} to="/">Sair</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Título + Botão Novo Produto + Botão Exportar PDF */}
      <Box sx={{ mt: 4, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#8e7cc3' }}>Lista de Produtos</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            sx={{ backgroundColor: '#8e7cc3', mr: 2 }}
            onClick={exportPdf}
          >
            Exportar PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#8e7cc3' }}
            onClick={() => openDialogAction('novo')}
          >
            Novo Produto
          </Button>
        </Box>
      </Box>

      {/* Tabela */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper elevation={6} sx={{ p: 2, width: 900, backgroundColor: '#f5f0fb' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#8e7cc3' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}><strong>ID</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Nome</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Categoria</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Preço</strong></TableCell>
                  <TableCell sx={{ color: '#fff' }}><strong>Foto</strong></TableCell>
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
                      {produto.foto ? (
                        <img src={produto.foto} alt={`Foto de ${produto.nome}`} width={50} height={50} style={{ objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ width: 50, height: 50, backgroundColor: '#ccc', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.7rem' }}>Sem Foto</Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => openDialogAction('visualizar', produto)}><VisibilityIcon /></Button>
                      <Button size="small" onClick={() => openDialogAction('editar', produto)}><EditIcon /></Button>
                      <Button size="small" color="error" onClick={() => openDialogAction('excluir', produto)}><DeleteIcon /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogMode === 'visualizar' && 'Detalhes do Produto'}
          {dialogMode === 'editar' && 'Editar Produto'}
          {dialogMode === 'excluir' && 'Excluir Produto'}
          {dialogMode === 'novo' && 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'visualizar' && selectedProduto && (
            <>
              <Typography sx={{ color: '#333' }}>Nome: {selectedProduto.nome}</Typography>
              <Typography sx={{ color: '#333' }}>Categoria: {selectedProduto.categoria}</Typography>
              <Typography sx={{ color: '#333' }}>Preço: {selectedProduto.preco}</Typography>
              {selectedProduto.foto && <img src={selectedProduto.foto} alt="Produto" width={100} style={{ marginTop: '10px' }} />}
            </>
          )}

          {(dialogMode === 'editar' || dialogMode === 'novo') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                fullWidth
                required // Campo obrigatório
              />
              <TextField
                label="Categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                fullWidth
                required // Campo obrigatório
              />
              <TextField
                label="Preço"
                name="preco"
                value={formData.preco}
                onChange={handleInputChange}
                fullWidth
                required // Campo obrigatório
              />
              <Button variant="outlined" component="label" fullWidth>
                Upload Foto
                <input type="file" hidden name="foto" accept="image/*" onChange={handleInputChange} />
              </Button>
              {formData.foto && <img src={formData.foto} alt="Preview" width={100} style={{ marginTop: '10px' }} />}
            </Box>
          )}

          {dialogMode === 'excluir' && selectedProduto && (
            <Typography sx={{ color: '#333' }}>Tem certeza que deseja excluir **{selectedProduto.nome}**?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          {(dialogMode === 'editar' || dialogMode === 'novo') && (
            <Button onClick={handleSaveProduct} variant="contained" sx={{ backgroundColor: '#8e7cc3' }}>Salvar</Button>
          )}
          {dialogMode === 'excluir' && (
            <Button onClick={handleConfirmDelete} color="error" variant="contained">Confirmar Exclusão</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProdutoList;