import {Constants} from '@/config/constants';
import {setTheme} from '@/redux/app';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {CacheProvider, EmotionCache} from '@emotion/react';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {ReactNode, useEffect} from 'react';

type ThemeWrapperProps = {
  emotionCache: EmotionCache;
  children: ReactNode;
};

export const ThemeWrapper = ({children, emotionCache}: ThemeWrapperProps) => {
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
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};
