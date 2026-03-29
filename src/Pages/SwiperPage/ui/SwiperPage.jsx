import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Paper, IconButton, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Autocomplete, TextField } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';

function SwiperPage() {
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/src/data/db.json')
      .then((res) => res.json())
      .then((data) => setProfiles(data.profiles));
  }, []);

  const filteredProfiles = profiles.filter(profile => {
    const matchCity = selectedCities.length > 0 ? selectedCities.includes(profile.city) : true;
    const matchProfession = selectedProfessions.length > 0 ? selectedProfessions.includes(profile.profession) : true;
    return matchCity && matchProfession;
  });

  const profile = filteredProfiles[index];

  const handleSwipe = async (direction) => {
    if (direction === 'left') {
      await controls.start({ x: -1000, opacity: 0 });
    } else {
      await controls.start({ x: 1000, opacity: 0 });
    }
  
    setIndex((prev) => prev + 1); // всегда увеличиваем индекс на 1
  
    controls.set({ x: 0, opacity: 1 });
  };  

  return (
    <Box
      sx={{
        mt: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Rubik, sans-serif',
        minHeight: '100vh',
        justifyContent: 'flex-start',
        pt: 6
      }}
    >
      {/* Верхний бар */}
      <AppBar position="fixed" sx={{ top: 0, height: '8vh', bgcolor: 'white', color: 'black' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={() => navigate('/')} color="inherit">
            <LogoutIcon />
          </IconButton>
          <IconButton onClick={() => setFilterOpen(true)} color="inherit">
            <FilterListIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Отступ под AppBar */}

      <Typography variant="h4" mb={3}>Найди свою команду</Typography>

      {/* Вывод карточки или сообщений */}
      {filteredProfiles.length > 0 ? (
        index < filteredProfiles.length ? (
          <motion.div
            animate={controls}
            whileDrag={{ scale: 1.05 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.x < -100) handleSwipe('left');
              else if (info.offset.x > 100) handleSwipe('right');
            }}
          >
            <Paper
              elevation={6}
              sx={{
                width: 350,
                height: 460,
                p: 4,
                textAlign: 'center',
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Avatar
                src={profile.image}
                alt={profile.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Box>
                <Typography variant="h5">{profile.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.city} — {profile.profession}
                </Typography>
                {profile.bio && (
                  <Typography variant="body1" mt={2}>
                    {profile.bio}
                  </Typography>
                )}
              </Box>
              <Box mt={3} display="flex" justifyContent="space-between" width="100%">
                <IconButton onClick={() => handleSwipe('left')}>
                  <CloseIcon fontSize="large" />
                </IconButton>
                <IconButton onClick={() => handleSwipe('right')} color="error">
                  <FavoriteIcon fontSize="large" />
                </IconButton>
              </Box>
            </Paper>
          </motion.div>
        ) : (
          <Typography variant="h6" mt={4}>
            Больше анкет нет.
          </Typography>
        )
      ) : (
        <Typography variant="body1" mt={4}>
          Нет анкет по текущему фильтру.
        </Typography>
      )}

      {/* Диалог фильтрации */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Фильтрация</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Autocomplete
            multiple
            options={[...new Set(profiles.map((p) => p.city))]}
            value={selectedCities}
            onChange={(e, newValue) => {
              setSelectedCities(newValue);
              setIndex(0); // сбрасываем свайп на начало
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Города" placeholder="Выберите города" margin="normal" />
            )}
          />

          <Autocomplete
            multiple
            options={[...new Set(profiles.map((p) => p.profession))]}
            value={selectedProfessions}
            onChange={(e, newValue) => {
              setSelectedProfessions(newValue);
              setIndex(0); // сбрасываем свайп на начало
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Профессии" placeholder="Выберите профессии" margin="normal" />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => {
            setSelectedCities([]);
            setSelectedProfessions([]);
            setFilterOpen(false);
            setIndex(0);
          }}>
            Сбросить фильтры
          </Button>
          <Button onClick={() => setFilterOpen(false)}>Готово</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default SwiperPage;