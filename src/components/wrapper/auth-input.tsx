import { Box, Button, TextField, Typography } from '@mui/material';
import { NextPage } from 'next';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { AuthReq, AuthRes } from 'src/pages/api/auth';

type InputProps = {
  callback: (key: string) => void;
};

const AuthInput: NextPage<InputProps> = ({ callback }) => {
  const [inputError, setInputError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

  async function handleSubmit() {
    if (!password && !apiKey) {
      setInputError('Either a password or API key must be provided');
      // User provided their own api key
    } else if (apiKey) {
      callback(apiKey);
      // User provided password, use it to get api key from env
    } else if (password) {
      const params: AuthReq = {
        pw: password,
      };
      try {
        const res: AuthRes = await (
          await fetch('api/auth?' + new URLSearchParams(params))
        ).json();
        callback(res.apikey);
      } catch (e) {
        setInputError('Invalid password');
      }
    }
  }

  function handlePasswordInput(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setPassword(e.target.value);
  }

  function handleApiKeyInput(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setApiKey(e.target.value);
  }

  function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
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
  );
};

export default AuthInput;
