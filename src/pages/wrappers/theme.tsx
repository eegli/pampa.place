import {Constants} from '@/config/constants';
import {setTheme} from '@/redux/app';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import {ReactNode, useEffect} from 'react';
import {GlobalStyles} from '../../styles/global';

export const ThemeWrapper = ({children}: {children: ReactNode}) => {
  const activeTheme = useAppSelector(s => s.app.theme);
  const theme = createTheme({palette: {mode: activeTheme}});
  const dispatch = useAppDispatch();

  useEffect(() => {
    const localTheme = window.localStorage.getItem(Constants.THEME_KEY);
    if (localTheme === 'dark') {
      setTheme('dark');
    } else if (localTheme === 'light') {
      dispatch(setTheme('light'));
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CssBaseline />
      <Container
        id="mother"
        maxWidth={false} // "xl"
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </Container>
    </ThemeProvider>
  );
};
