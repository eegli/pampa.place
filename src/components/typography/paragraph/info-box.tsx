import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {ReactNode} from 'react';

export const InfoBox = ({
  children,
  type = 'info',
}: {
  children: ReactNode;
  type?: 'info' | 'warning';
}) => {
  const IconComp = type == 'info' ? InfoIcon : WarningIcon;
  const iconColor = type == 'info' ? 'success' : 'warning';
  return (
    <Box display="flex" mb={2}>
      <IconComp
        color={iconColor}
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
};
