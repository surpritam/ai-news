import React from 'react';
import { AppBar, Toolbar, Typography, IconButton} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #1e3a8a, #3b82f6, #1e3a8a)',
        animation: 'gradient 6s ease infinite',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        backgroundSize: '200% 200%',
        boxShadow: 4,
      }}
    >
      <Toolbar>
        {/* Icon */}
        <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
          <InsightsIcon fontSize="large" />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}
        >
          AI Daily Digest
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
