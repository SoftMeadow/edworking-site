import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'example' && password === 'example') {
      alert('Успешный вход!');
    } else {
      alert('Неверный email или пароль');
    }
  };

  return (
    <Container 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 16vh)',
        textAlign: 'center',
        px: { xs: 2, sm: 0 }
      }}
    >
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
          sx={{ alignSelf: 'flex-start', mb: 2, fontFamily: 'Rubik, sans-serif' }}
        >
          Назад
        </Button>
        <Typography variant="h4" gutterBottom>
          Вход
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Юзернейм"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Пароль"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Вход
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;