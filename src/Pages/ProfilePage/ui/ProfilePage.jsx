import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Paper, Avatar, IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkIcon from '@mui/icons-material/Work';
import NotesIcon from '@mui/icons-material/Notes';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newType, setNewType] = useState('пост');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('profile');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      fetch('/src/data/dCurrProfile.json')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.profile) && data.profile.length > 0) {
            setUser(data.profile[0]);
            localStorage.setItem('profile', JSON.stringify(data.profile[0]));
          } else {
            console.warn('⚠️ dCurrProfile.json пуст или повреждён:', data);
          }
        })
        .catch(err => console.error('Ошибка загрузки профиля:', err));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem('posts') || '[]');
    const mine = all.filter(p => p.authorId === user.id);
    setPosts(mine);
  }, [user]);

  const handlePost = () => {
    if (!newPost.trim() || !user) return;
    const newEntry = {
      id: Date.now(),
      author: user.name,
      authorId: user.id,
      content: newPost,
      timestamp: new Date().toISOString(),
      type: newType
    };
    const all = JSON.parse(localStorage.getItem('posts') || '[]');
    const updated = [newEntry, ...all];
    localStorage.setItem('posts', JSON.stringify(updated));
    setPosts([newEntry, ...posts]);
    setNewPost('');
  };

  const renderTypeIcon = (type) =>
    type === 'работа' ? <WorkIcon fontSize="small" /> : <NotesIcon fontSize="small" />;

  if (!user) return <Typography>Загрузка профиля...</Typography>;

  const jobPosts = posts.filter(p => p.type === 'работа');
  const regularPosts = posts.filter(p => p.type === 'пост');

  return (
    <Container sx={{ mt: 4, fontFamily: 'Rubik, sans-serif' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Мой профиль</Typography>
        <IconButton onClick={() => navigate('/profile/settings')}>
          <SettingsIcon />
        </IconButton>
      </Box>

      <Paper sx={{ p: 3, my: 3 }}>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
          <Avatar src={user.pic || user.image} sx={{ width: 80, height: 80 }} />
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            {user.bio && <Typography mt={1}>{user.bio}</Typography>}
            {user.city && <Typography>Город: {user.city}</Typography>}
            {user.profession && <Typography>Профессия: {user.profession}</Typography>}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Что у вас нового?"
          multiline
          rows={3}
          fullWidth
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <Box
          mt={1}
          display="flex"
          gap={1}
          flexDirection={{ xs: 'column', sm: 'row' }}
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <Button
            onClick={() => setNewType('пост')}
            variant={newType === 'пост' ? 'contained' : 'outlined'}
            startIcon={<NotesIcon />}
            fullWidth
          >
            Пост
          </Button>
          <Button
            onClick={() => setNewType('работа')}
            variant={newType === 'работа' ? 'contained' : 'outlined'}
            startIcon={<WorkIcon />}
            fullWidth
          >
            Работа
          </Button>
          <Button
            onClick={handlePost}
            variant="contained"
            fullWidth
          >
            Опубликовать
          </Button>
        </Box>
      </Paper>

      {jobPosts.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>💼 Мои проекты / предложения</Typography>
          {jobPosts.map((post) => (
            <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" gap={1} alignItems="center" mb={1}>
                {renderTypeIcon(post.type)}
                <Typography variant="subtitle1" fontWeight="bold">{post.author}</Typography>
              </Box>
              <Typography>{post.content}</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="caption">
                  {new Date(post.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          ))}
        </>
      )}

      {regularPosts.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>📝 Обычные посты</Typography>
          {regularPosts.map((post) => (
            <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" gap={1} alignItems="center" mb={1}>
                {renderTypeIcon(post.type)}
                <Typography variant="subtitle1" fontWeight="bold">{post.author}</Typography>
              </Box>
              <Typography>{post.content}</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="caption">
                  {new Date(post.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          ))}
        </>
      )}
    </Container>
  );
}

export default ProfilePage;






