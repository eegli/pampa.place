import Box, {BoxProps} from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Breakpoint} from '@mui/system';
import {ReactNode} from 'react';

// The root container, only used in _app.tsx
export const RootContainer = ({children}: {children: ReactNode}) => {
  return (
    <Container
      id="mother"
      disableGutters
      maxWidth={false}
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      {children}
    </Container>
  );
};

// A default container that should be used to wrap all pages. It is
// especially useful when a header is used - a height calc can be
// passed so that the container takes the remaining height, see
// /pages/game
interface PageContentProps {
  headerGutter?: boolean;
  id: string;
  children: ReactNode;
}

export const PageContent = ({children, headerGutter, id}: PageContentProps) => {
  return (
    <Box
      component="main"
      width="100%"
      height={headerGutter ? 'calc(100% - 64px)' : '100%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
      id={id}
    >
      {children}
    </Box>
  );
};

// Nice little container for simple pages with a small breakpoint. Can
// be used as a child of PageContainer
interface SlimContainerProps extends BoxProps {
  breakpoint?: Breakpoint;
}

export const SlimContainer = ({
  children,
  breakpoint = 'sm',
  ...rest
}: SlimContainerProps) => (
  <Box
    display="flex"
    flexDirection="column"
    flexWrap="wrap"
    width="100%"
    sx={{
      maxWidth: ({breakpoints}) => breakpoints.values[breakpoint],
      margin: ({spacing}) => `${spacing(1)} auto ${spacing(1)} auto`,
      padding: ({spacing}) => spacing(2),
    }}
    {...rest}
  >
    {children}
  </Box>
);
