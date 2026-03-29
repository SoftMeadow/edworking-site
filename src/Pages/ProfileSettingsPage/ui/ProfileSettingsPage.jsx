import React, { useState, useEffect } from 'react';
import { Container, TextField, Select, MenuItem, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const cities = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Челябинск', 'Самара', 'Ростов-на-Дону', 'Уфа'
];

function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    pic: '',
    bio: '',
    city: '',
    profession: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('profile');

    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      fetch('/src/data/dCurrProfile.json')
        .then(res => res.json())
        .then(data => {
          const user = data.profile[0];
          setProfile({
            name: user.name || '',
            email: user.email || '',
            pic: user.image || '',
            bio: user.bio || '',
            city: user.city || '',
            profession: user.profession || ''
          });
        });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
    alert('Профиль сохранён!');
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 4, fontFamily: 'Rubik, sans-serif' }}>
      <Button onClick={() => navigate('/profile')} startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start', mb: 2, fontFamily: 'Rubik, sans-serif' }}>
        Назад
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Rubik, sans-serif' }}>
        Настройки профиля
      </Typography>

      <img
        src={profile.pic}
        alt="Profile pic"
        style={{ width: "20%", height: "20%", objectFit: "cover", borderRadius: "10px", marginBottom: 16 }}
      />

      <TextField
        label="Имя"
        name="name"
        value={profile.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        sx={{ fontFamily: 'Rubik, sans-serif' }}
      />

      <TextField
        label="Email"
        name="email"
        value={profile.email}
        disabled
        fullWidth
        margin="normal"
        sx={{ fontFamily: 'Rubik, sans-serif' }}
      />

      <TextField
        label="Биография"
        name="bio"
        value={profile.bio}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
        margin="normal"
        sx={{ fontFamily: 'Rubik, sans-serif' }}
      />

      <Select
        fullWidth
        displayEmpty
        value={profile.city}
        onChange={handleChange}
        name="city"
        sx={{ mt: 2, fontFamily: 'Rubik, sans-serif' }}
      >
        <MenuItem value="" disabled>Выберите город</MenuItem>
        {cities.map((city) => (
          <MenuItem key={city} value={city}>{city}</MenuItem>
        ))}
      </Select>

      <TextField
        label="Профессия"
        name="profession"
        value={profile.profession}
        onChange={handleChange}
        fullWidth
        margin="normal"
        sx={{ fontFamily: 'Rubik, sans-serif' }}
      />

      <Button variant="contained" color="primary" sx={{ mt: 3, fontFamily: 'Rubik, sans-serif' }} onClick={handleSave}>
        Сохранить
      </Button>
    </Container>
  );
}

export default ProfileSettingsPage;



