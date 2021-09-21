import { Box, Button, TextField } from '@mui/material';
import { NextPage } from 'next';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

type InputProps = {
  callback: (pw: string) => void;
};

const GoogleWrapperInput: NextPage<InputProps> = ({ callback }) => {
  const [password, setPassword] = useState<string>('');

  function handleSubmit() {
    callback(password);
  }

  function handleChange(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setPassword(e.target.value);
  }

  function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <Box
      onSubmit={(e: any) => e.preventDefault()}
      component='form'
      noValidate
      autoComplete='off'
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='80%'
      sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label='Google Maps API key'
        id='key'
        type='password'
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
      <Button
        sx={{
          my: 1,
          flexGrow: 0,
        }}
        variant='contained'
        color='primary'
        onClick={handleSubmit}>
        Start
      </Button>
    </Box>
  );
};

export default GoogleWrapperInput;
