import {RootState} from '@/redux/redux.store';
import {createTheme, ThemeProvider} from '@mui/material';
import React, {ReactNode} from 'react';
import {useAppSelector} from '../../redux/redux.hooks';

export const ThemeWrapper = ({children}: {children: ReactNode}) => {
  const activeTheme = useAppSelector((s: RootState) => s.app.theme);
  const theme = createTheme({palette: {mode: activeTheme}});

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
