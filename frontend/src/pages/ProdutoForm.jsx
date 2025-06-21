import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import {
  TextField,
  Button,
  Box,
  Typography,
  Toolbar,
  Grid,
  styled
} from '@mui/material';
import { useEffect, useRef, useState } from 'react'; // Importado useState

// Campo customizado com destaque no foco
const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    transition: '0.3s',
  },
  '& .Mui-focused .MuiInputBase-root': {
    borderColor: theme.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.palette.secondary.light}`,
  }
}));

// O componente agora recebe 'onSubmitForm' e 'initialData' como props
const ProdutoForm = ({ onSubmitForm, initialData = {} }) => {
  const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm({
    defaultValues: initialData // Define os valores iniciais para edição
  });
  const nomeRef = useRef(null);

  // Estados para lidar com a pré-visualização e a Base64 da imagem
  const [imagePreview, setImagePreview] = useState(initialData.foto || '');
  const [imageBase64, setImageBase64] = useState(initialData.fotoBase64 || '');

  useEffect(() => {
    nomeRef.current?.focus();
    // Preenche o campo de preço formatado corretamente ao editar
    if (initialData.preco) {
      // Remove o "R$ " e substitui vírgula por ponto para NumericFormat
      const priceValue = parseFloat(initialData.preco.replace('R$ ', '').replace(',', '.'));
      setValue('preco', priceValue);
    }
  }, [initialData, setValue]);

  // Função para lidar com o upload da imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Para exibir a imagem no navegador (URL de objeto temporário)
      setImagePreview(URL.createObjectURL(file));

      // Para converter a imagem para Base64 para envio/persistência
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Armazena a Base64
      };
      reader.readAsDataURL(file); // Lê o arquivo como Data URL (Base64)
    } else {
      setImagePreview('');
      setImageBase64('');
    }
  };

  const onSubmit = (data) => {
    // Adiciona a Base64 da imagem aos dados antes de enviar
    const productData = { ...data, foto: imagePreview, fotoBase64: imageBase64 };
    onSubmitForm(productData); // Chama a função onSubmitForm passada via prop
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Toolbar sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#8e7cc3' }}>
          {initialData.id ? 'Editar Produto' : 'Cadastro de Produto'}
        </Typography>
      </Toolbar>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomTextField
            inputRef={nomeRef}
            label="Nome do Produto"
            fullWidth
            {...register('nome', {
              required: 'Nome é obrigatório',
              maxLength: { value: 100, message: 'Máximo 100 caracteres' }
            })}
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomTextField
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            {...register('descricao', {
              maxLength: { value: 200, message: 'Máximo 200 caracteres' }
            })}
            error={!!errors.descricao}
            helperText={errors.descricao?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <NumericFormat
            customInput={CustomTextField}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            label="Preço"
            fullWidth
            allowNegative={false}
            // onValueChange deve ser a única forma de definir o valor para 'preco' do hook form
            onValueChange={(values) => {
              setValue('preco', values.value);
              // Dispara a validação do campo 'preco' ao perder o foco ou ao mudar o valor
              trigger('preco'); 
            }}
            // O register aqui serve apenas para validação, o setValue é quem controla o valor
            {...register('preco', {
              required: 'Preço é obrigatório',
              validate: value => parseFloat(value) > 0 || 'Preço deve ser maior que zero'
            })}
            error={!!errors.preco}
            helperText={errors.preco?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomTextField
            label="Categoria"
            fullWidth
            {...register('categoria', {
              required: 'Categoria é obrigatória',
              maxLength: { value: 50, message: 'Máximo 50 caracteres' }
            })}
            error={!!errors.categoria}
            helperText={errors.categoria?.message}
          />
        </Grid>

        {/* Campo de Upload de Foto */}
        <Grid item xs={12}>
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 1, p: 1.5 }}>
            Upload Foto
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleImageChange} 
              // Você pode usar register aqui se quiser validar o campo de arquivo
              // {...register('fotoFile', { required: 'Foto é obrigatória' })}
            />
          </Button>
          {/* Exibe a pré-visualização da imagem */}
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img src={imagePreview} alt="Preview do Produto" style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }} />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>Pré-visualização da imagem</Typography>
            </Box>
          )}
          {/* Você pode exibir um erro aqui se o campo 'fotoFile' for registrado com validação */}
          {/* {errors.fotoFile && <Typography color="error" variant="caption">{errors.fotoFile.message}</Typography>} */}
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" sx={{ backgroundColor: '#8e7cc3', fontFamily: 'Poppins', fontSize: '1rem' }} type="submit">Salvar</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProdutoForm;