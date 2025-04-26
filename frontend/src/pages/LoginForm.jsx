import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        if (data.usuario === 'abc' && data.senha === 'bolinhas') {
            localStorage.setItem('loginRealizado', data.usuario);
            navigate('/home');
        } else {
            alert("Usuário ou senha inválidos!");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#fff', // fundo branco
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
                                backgroundColor: '#f7f7f7', // cor de fundo do campo
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
                                backgroundColor: '#f7f7f7', // cor de fundo do campo
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
                            backgroundColor: '#B39DDB', // botão lilás mais suave
                            '&:hover': {
                                backgroundColor: '#9E87C3', // hover em lilás mais suave
                            },
                            color: '#fff',
                        }}
                    >
                        Entrar
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginForm;
