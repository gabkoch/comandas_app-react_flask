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
import { useEffect, useRef } from 'react';

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

const ProdutoForm = () => {
  const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm();
  const nomeRef = useRef(null);

  useEffect(() => {
    nomeRef.current?.focus();
  }, []);

  const onSubmit = (data) => {
    console.log("Produto cadastrado:", data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Toolbar sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#8e7cc3' }}>Cadastro de Produto</Typography>
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
            onValueChange={(values) => setValue('preco', values.value)}
            onBlur={() => trigger('preco')}
            {...register('preco', {
              required: 'Preço é obrigatório'
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

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" sx={{ backgroundColor: '#8e7cc3', fontFamily: 'Poppins', fontSize: '1rem' }} type="submit">Salvar</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProdutoForm;
