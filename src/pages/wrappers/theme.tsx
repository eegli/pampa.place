import {RootState} from '@/redux/store';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import {ReactNode} from 'react';
import {useAppSelector} from '../../redux/hooks';
import GlobalStyles from '../../styles/global';

export const ThemeWrapper = ({children}: {children: ReactNode}) => {
  const activeTheme = useAppSelector((s: RootState) => s.app.theme);
  const theme = createTheme({palette: {mode: activeTheme}});

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
        }}
      >
        {children}
      </Container>
    </ThemeProvider>
  );
};
