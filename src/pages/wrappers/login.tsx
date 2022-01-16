import {Constants} from '@/config/constants';
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
import {PageContentWrapper} from '../../styles/containers';
import {AuthReq, AuthRes} from '../api/auth.page';

export const Login = () => {
  const [inputError, setInputError] = useState<string>('');
  const [serverPassword, setServerPassword] = useState<string>('');
  const [userApiKey, setUserApiKey] = useState<string>('');

  const dispatch = useAppDispatch();

  // Check if an api key is already present in local storage
  useEffect(() => {
    const apiKey = window.sessionStorage.getItem(Constants.SESSION_APIKEY_KEY);
    if (typeof apiKey === 'string') {
      dispatch(setApiKey(apiKey));
    }
  }, [dispatch]);

  async function handleSubmit() {
    if (!serverPassword && !userApiKey) {
      setInputError('Either a password or API key must be provided');
    } else if (userApiKey) {
      dispatch(setApiKey(userApiKey));
    } else if (serverPassword) {
      const params: AuthReq = {
        pw: serverPassword,
      };
      try {
        const res: AuthRes = await (
          await fetch('api/auth?' + new URLSearchParams(params))
        ).json();
        dispatch(setApiKey(res.apikey));
      } catch (e) {
        console.error(e);
        setInputError('Invalid password');
      }
    }
  }

  function handleDevMode() {
    dispatch(setApiKey(''));
  }

  function handlePasswordInput(e: ChangeEvent<HTMLInputElement>) {
    setServerPassword(e.target.value);
  }

  function handleApiKeyInput(e: ChangeEvent<HTMLInputElement>) {
    setUserApiKey(e.target.value);
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
          name="password-input"
          id="password-input"
          label="Enter password"
          placeholder="gugelhupf..."
          type="password"
          onChange={handlePasswordInput}
          onKeyUp={handleKeyUp}
        />
        <Typography component="p" alignSelf="flex-start" my={2} ml={1}>
          or
        </Typography>
        <TextField
          fullWidth
          name="apikey-input"
          id="apikey-input"
          label="Enter Maps API key"
          placeholder="AIzaSyBXR..."
          type="text"
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
