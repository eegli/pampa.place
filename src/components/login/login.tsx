import {setApiKey} from '@/redux/app';
import {useAppDispatch} from '@/redux/hooks';
import {PageContent} from '@/styles/containers';
import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {ChangeEvent, FormEvent, KeyboardEvent, useState} from 'react';
import {gaevent, LoginEvent} from '../../lib/analytics-events';
import {AuthReq, AuthRes} from '../../pages/api/auth.page';

export const Login = () => {
  const [inputError, setInputError] = useState<string>('');
  const [serverPassword, setServerPassword] = useState<string>('');
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  async function handleSubmit() {
    setIsLoading(true);
    if (!serverPassword && !userApiKey) {
      setInputError('Either a password or API key must be provided');
      setIsLoading(false);
    } else if (userApiKey) {
      dispatch(setApiKey(userApiKey));
      setIsLoading(false);
    } else if (serverPassword) {
      const params: AuthReq = {
        pw: serverPassword,
      };
      try {
        // Throttle requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        const request = fetch(
          `${window.location.origin}/api/auth?` + new URLSearchParams(params)
        );
        const res: AuthRes = await (await request).json();
        gaevent<LoginEvent>({
          eventName: 'login_password',
          category: 'login',
        });
        dispatch(setApiKey(res.apikey));
      } catch (e) {
        setInputError('Invalid password');
        gaevent<LoginEvent>({
          eventName: 'login_password_failed',
          category: 'login',
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handlePrevMode() {
    dispatch(setApiKey(''));
    gaevent<LoginEvent>({
      eventName: 'login_prev_mode',
      category: 'login',
    });
  }

  function handlePasswordInput(e: ChangeEvent<HTMLInputElement>) {
    if (inputError) {
      setInputError('');
    }
    setServerPassword(e.target.value);
  }

  function handleApiKeyInput(e: ChangeEvent<HTMLInputElement>) {
    setUserApiKey(e.target.value);
    gaevent<LoginEvent>({
      eventName: 'login_apikey',
      category: 'login',
    });
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
        padding={4}
        maxWidth={500}
      >
        <Box my={2} alignSelf="flex-start">
          <Typography mb={2} variant="h4" color="text.primary">
            Login
          </Typography>
          <Typography variant="body1" color="text.secondary">
            For the best experience, either login with the password that the
            host of this server gave you&nbsp;<b>or</b>&nbsp;provide your own
            Google Maps API key.
          </Typography>
        </Box>
        <TextField
          sx={{mb: 2}}
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
            Unsure? Choose <b>preview mode</b> and explore.
          </Typography>
        </Box>
        <Box>
          {isLoading ? (
            <Box display="flex" alignItems="center">
              <Typography
                component="span"
                color="primary"
                variant="body1"
                mr={1}
              >
                Logging in...
              </Typography>
              <CircularProgress aria-busy={true} size={30} />
            </Box>
          ) : (
            <>
              <Tooltip title="No maps API key required - play in preview mode">
                <Button
                  sx={{
                    my: 1,
                    mr: 2,
                  }}
                  variant="outlined"
                  color="primary"
                  onClick={handlePrevMode}
                >
                  Preview mode
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
            </>
          )}
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
          I&apos;m open source
          <IconButton disableRipple color="inherit">
            <GitHubIcon />
          </IconButton>
        </Link>
      </Box>
    </PageContent>
  );
};
