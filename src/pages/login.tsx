import { Box, Button, TextField, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { AuthReq, AuthRes } from 'src/pages/api/auth';
import { setApiKey } from 'src/redux/app';
import { useAppDispatch } from 'src/redux/hooks';
import { PageContentContainer } from 'src/styles';

const Login: NextPage = () => {
  const [inputError, setInputError] = useState<string>('');
  const [inputPassword, inputSetPassword] = useState<string>('');
  const [inputApiKey, inputSetApiKey] = useState<string>('');

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Speed up things in development
  /*   useEffect(() => {
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_KEY) {
      dispatch(setApiKey(process.env.NEXT_PUBLIC_KEY));
    }
  }, [dispatch]); */

  async function handleSubmit() {
    if (!inputPassword && !inputApiKey) {
      setInputError('Either a password or API key must be provided');
      // User provided their own api key
    } else if (inputApiKey) {
      dispatch(setApiKey(inputApiKey));
      // User provided password, use it to get api key from env
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
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
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
    </PageContentContainer>
  );
};

export default Login;
