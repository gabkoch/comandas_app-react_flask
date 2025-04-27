import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    
    // Estado para controlar os diálogos
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);

    const onSubmit = (data) => {
        if (data.usuario === 'abc' && data.senha === 'bolinhas') {
            localStorage.setItem('loginRealizado', data.usuario);
            setOpenSuccess(true);
            setTimeout(() => navigate('/home'), 2000); // Redireciona após 2 segundos
        } else {
            setOpenError(true);
        }
    };

    const handleCloseSuccess = () => {
        setOpenSuccess(false);
    };

    const handleCloseError = () => {
        setOpenError(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh', // Garante que ocupe toda a altura da página
                width: '100vw', // Garante que ocupe toda a largura da página
                backgroundColor: '#fff',
            }}
        >
            <Paper elevation={6} sx={{ padding: 4, width: 300, backgroundColor: '#fff', borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ fontFamily: 'Poppins', color: '#B39DDB' }}>
                    Login
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Usuário"
                        fullWidth
                        margin="normal"
                        {...register('usuario', { required: 'Usuário é obrigatório' })}
                        error={!!errors.usuario}
                        helperText={errors.usuario?.message}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f7f7f7',
                            },
                            marginBottom: 2,
                        }}
                    />

                    <TextField
                        label="Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register('senha', {
                            required: 'Senha é obrigatória',
                            minLength: {
                                value: 6,
                                message: 'Senha deve ter pelo menos 6 caracteres',
                            },
                        })}
                        error={!!errors.senha}
                        helperText={errors.senha?.message}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f7f7f7',
                            },
                            marginBottom: 2,
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            backgroundColor: '#B39DDB',
                            '&:hover': {
                                backgroundColor: '#9E87C3',
                            },
                            color: '#fff',
                        }}
                    >
                        Entrar
                    </Button>
                </form>
            </Paper>

            {/* Caixa de diálogo para Login realizado com sucesso */}
            <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                <DialogTitle>Login realizado com sucesso</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">Redirecionando...</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccess} color="primary">Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* Caixa de diálogo para erro de usuário ou senha inválidos */}
            <Dialog open={openError} onClose={handleCloseError}>
                <DialogTitle>Erro</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">Usuário ou senha inválidos!</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError} color="primary">Fechar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LoginForm;
