import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';


function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = { id: Date.now(), name: username, email, image: 'https://via.placeholder.com/150' };
    fetch('http://localhost:3500/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    .then(response => response.json())
    .then(user => {
      alert(`Пользователь ${username} зарегистрирован с почтой ${email}`);
      console.log('User added:', user);
    });
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
          Регистрация
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Юзернейм"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Регистрация
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Register;