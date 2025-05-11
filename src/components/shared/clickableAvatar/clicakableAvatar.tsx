import React from 'react';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ClickableAvatar = ({ src, fallbackName, navigateTo, size = 56 }) => {
  const navigate = useNavigate();
  const imageSrc =
    src || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`;

  return (
    <Avatar
      src={imageSrc}
      sx={{ width: size, height: size, mx: 'auto', cursor: 'pointer' }}
      onClick={() => navigate(navigateTo)}
    />
  );
};

export default ClickableAvatar;
