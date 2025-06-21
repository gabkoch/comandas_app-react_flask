import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, Alert, Snackbar } from "@mui/material";

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'error' }); // Estado para o Snackbar

    const onSubmit = (data) => {
        let isAuthenticated = false;
        let userGroup = null;
        let actualUsername = data.usuario; // O nome de usuário que será armazenado/exibido

        // DEFINIÇÕES DOS LOGINS LOCAIS
        const localUser1 = 'abc';
        const localPass1 = 'bolinhas';
        const localGroup1 = 'usuario_comum'; // Exemplo de grupo para o login 'abc'

        const localUser2Prefix = '@';
        const localUser2 = 'admin'; // O nome de usuário sem o '@'
        const localPass2 = 'bolinhas';
        const localGroup2 = 'administrador'; // Grupo para o login '@admin' 

        // 1. Tenta Login Local com prefixo '@'
        if (data.usuario.startsWith(localUser2Prefix)) {
            const tempUsername = data.usuario.substring(localUser2Prefix.length); // Remove o '@'
            if (tempUsername === localUser2 && data.senha === localPass2) {
                isAuthenticated = true;
                userGroup = localGroup2;
                actualUsername = localUser2; // Armazena 'admin' sem o '@' 
            }
        }
        // 2. Se não foi autenticado pelo '@', tenta Login Local padrão (sem prefixo)
        else if (data.usuario === localUser1 && data.senha === localPass1) {
            isAuthenticated = true;
            userGroup = localGroup1;
            actualUsername = localUser1;
        }

        // 3. Processa o resultado da tentativa de login
        if (isAuthenticated) {
            localStorage.setItem('loginRealizado', actualUsername); // Armazena o nome de usuário (sem o @)
            localStorage.setItem('userGroup', userGroup); // Armazena o grupo
            navigate('/home');
        } else {
            // Se nenhuma das autenticações locais funcionou, assume que seria via API
            // E como a API não está funcionando, exibe erro.
            setSnackbar({ open: true, message: "Usuário ou senha inválidos. Tente '@admin' ou 'abc' com suas senhas.", severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
            {/* Snackbar para feedback de login */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginForm;