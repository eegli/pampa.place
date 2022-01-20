import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, {ReactNode} from 'react';

export const InfoBox = ({children}: {children: ReactNode}) => (
  <Box display="flex">
    <LightbulbIcon
      color="warning"
      style={{
        position: 'relative',
        margin: '0 12px 0px 0',
      }}
    />
    <Typography component="p" color="text.secondary">
      {children}
    </Typography>
  </Box>
);
