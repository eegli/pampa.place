import {
  Box,
  BoxProps,
  Breakpoint,
  Container,
  ContainerProps,
} from '@mui/material';

// Shared container that can be applied to all "info" screens -
// intermissions, round ends and final result. Accepts an optional
// prop to make it go full height - this is necessary for when there
// is no other content on the page (currently needed for
// "intermission" and "final result")

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

// A default container that should be used to wrap all pages. It is
// especially useful when a header is used - a height calc can be
// passed so that the container takes the remaining height, see
// /pages/game
interface PageContentContainerProps extends ContainerProps {
  height?: string;
}

export const PageContentContainer = ({
  children,
  height: customHeight,
}: PageContentContainerProps) => {
  return (
    <Box
      width="100%"
      height="100%"
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Container
        maxWidth={false} // "xl"
        sx={{
          // Required for darkmode to work, see example:
          // https://next.material-ui.com/customization/palette/#toggling-color-mode
          bgcolor: 'background.default',
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          height: customHeight || '100%',
          flexFlow: 'column',
        }}
      >
        {children}
      </Container>
    </Box>
  );
};
