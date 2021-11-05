import { setApiKey } from '@/redux/app/app.slice';
import { useAppDispatch } from '@/redux/redux.hooks';
import { Box, Button, TextField, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { AuthReq, AuthRes } from '../pages/api/auth.page';
import { PageContentContainer } from '../styles';

const Login = () => {
  const [inputError, setInputError] = useState<string>('');
  const [inputPassword, inputSetPassword] = useState<string>('');
  const [inputApiKey, inputSetApiKey] = useState<string>('');

  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleSubmit() {
    if (!inputPassword && !inputApiKey) {
      setInputError('Either a password or API key must be provided');
    } else if (inputApiKey) {
      dispatch(setApiKey(inputApiKey));
    } else if (inputPassword) {
      const params: AuthReq = {
        pw: inputPassword,
      };
      try {
        const res: AuthRes = await (
          await fetch('api/auth?' + new URLSearchParams(params))
        ).json();
        dispatch(setApiKey(res.apikey));
      } catch (e) {
        setInputError('Invalid password');
      }
    }
    router.push('/');
  }

  function handleDevMode() {
    dispatch(setApiKey(''));
  }

  function handlePasswordInput(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    inputSetPassword(e.target.value);
  }

  function handleApiKeyInput(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    inputSetApiKey(e.target.value);
  }

  function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <PageContentContainer height="100%">
      <Box
        onSubmit={(e: any) => e.preventDefault()}
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
        sx={{ mt: 2 }}
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
    </PageContentContainer>
  );
};

export default Login;
