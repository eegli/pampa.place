import {setApiKey} from '@/redux/app';
import {useAppDispatch} from '@/redux/hooks';
import {PageContent} from '@/styles/containers';
import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {ChangeEvent, FormEvent, KeyboardEvent, useState} from 'react';
import {AuthReq, AuthRes} from '../../pages/api/auth.page';

export const Login = () => {
  const [inputError, setInputError] = useState<string>('');
  const [serverPassword, setServerPassword] = useState<string>('');
  const [userApiKey, setUserApiKey] = useState<string>('');

  const dispatch = useAppDispatch();

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
          await fetch(
            `${window.location.origin}/api/auth?` + new URLSearchParams(params)
          )
        ).json();
        dispatch(setApiKey(res.apikey));
      } catch (e) {
        setInputError('Invalid password');
      }
    }
  }

  function handleDevMode() {
    dispatch(setApiKey(''));
  }

  function handlePasswordInput(e: ChangeEvent<HTMLInputElement>) {
    if (inputError) {
      setInputError('');
    }
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
    <PageContent id="login">
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
        width="100%"
        maxWidth={500}
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
        <Box my={2}>
          <Typography color="text.secondary" variant="body2">
            Unsure? Choose <b>dev mode</b> mode and explore.
          </Typography>
        </Box>
        <Box>
          <Tooltip title="No maps API key required - play in development mode">
            <Button
              sx={{
                my: 1,
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
      <Box position="absolute" margin="auto" bottom={30} color="text.secondary">
        <Link
          aria-label="github-link"
          color="inherit"
          underline="none"
          target="_blank"
          href="https://github.com/eegli/pampa.place"
        >
          I`&apos;m open source
          <IconButton disableRipple color="inherit">
            <GitHubIcon />
          </IconButton>
        </Link>
      </Box>
    </PageContent>
  );
};
