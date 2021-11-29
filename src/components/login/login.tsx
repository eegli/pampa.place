import {setApiKey} from '@/redux/app';
import {useAppDispatch} from '@/redux/hooks';
import {Box, Button, TextField, Tooltip, Typography} from '@mui/material';
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import {useSessionStorage} from 'react-use';
import {AuthReq, AuthRes} from '../../pages/api/auth.page';
import {PageContentWrapper} from '../../styles/containers';

export const Login = () => {
  const [inputError, setInputError] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [inputApiKey, setInputApiKey] = useState<string>('');

  const [sessionApiKey, setSessionApiKey] =
    useSessionStorage<string>('gapikey');

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (sessionApiKey !== undefined) {
      dispatch(setApiKey(sessionApiKey));
    }
  }, [sessionApiKey, dispatch]);

  /*   useEffect(() => {
    if (
      router.query.hasOwnProperty('apikey') &&
      typeof router.query.apikey === 'string'
    ) {
      dispatch(setApiKey(router.query.apikey));
    }
  }, [router.query]); */

  async function handleSubmit() {
    if (!inputPassword && !inputApiKey) {
      setInputError('Either a password or API key must be provided');
    } else if (inputApiKey) {
      setSessionApiKey(inputApiKey);
    } else if (inputPassword) {
      const params: AuthReq = {
        pw: inputPassword,
      };
      try {
        const res: AuthRes = await (
          await fetch('api/auth?' + new URLSearchParams(params))
        ).json();
        setSessionApiKey(res.apikey);
      } catch (e) {
        setInputError('Invalid password');
      }
    }
  }

  function handleDevMode() {
    setSessionApiKey('');
  }

  function handlePasswordInput(e: ChangeEvent<HTMLInputElement>) {
    setInputPassword(e.target.value);
  }

  function handleApiKeyInput(e: ChangeEvent<HTMLInputElement>) {
    setInputApiKey(e.target.value);
  }

  function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <PageContentWrapper id="login">
      <Box
        onSubmit={handleFormSubmit}
        height="100%"
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-end"
        width="80%"
        maxWidth={400}
      >
        <TextField
          fullWidth
          error={!!inputError}
          helperText={inputError}
          label="Enter password"
          placeholder="gugelhupf..."
          id="password"
          type="password"
          onChange={handlePasswordInput}
          onKeyUp={handleKeyUp}
        />
        <Typography component="p" alignSelf="flex-start" my={2} ml={1}>
          or
        </Typography>
        <TextField
          fullWidth
          label="Enter Maps API key"
          placeholder="AIzaSyBXR..."
          id="apikey"
          type="password"
          onChange={handleApiKeyInput}
          onKeyUp={handleKeyUp}
        />
        <Box>
          <Tooltip title="No maps API key required - play in development mode">
            <Button
              sx={{
                my: 2,
                mr: 2,
              }}
              variant="outlined"
              color="primary"
              onClick={handleDevMode}
            >
              Dev mode
            </Button>
          </Tooltip>

          <Button
            sx={{
              my: 2,
            }}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Enter
          </Button>
        </Box>
      </Box>
    </PageContentWrapper>
  );
};
