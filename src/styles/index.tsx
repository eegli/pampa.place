import {
  Box,
  BoxProps,
  Breakpoint,
  Container,
  ContainerProps,
  styled,
} from '@mui/material';

interface SlimContainerProps extends BoxProps {
  breakpoint?: Breakpoint;
}

// Shared container that can be applied to all "info" screens -
// intermissions, round ends and final result. Accepts an optional
// prop to make it go full height - this is necessary for when there
// is no other content on the page (currently needed for
// "intermission" and "final result")
export const SlimContainer = styled(Box)<SlimContainerProps>(
  ({ theme, breakpoint, ...rest }) => ({
    maxWidth: breakpoint
      ? theme.breakpoints.values[breakpoint]
      : theme.breakpoints.values['sm'],
    padding: theme.spacing(2),
    flexWrap: 'wrap',
    width: '100%',
    color: theme.palette.primary.light,
    display: 'flex',
    margin: `${theme.spacing(1)} auto ${theme.spacing(1)} auto`,
  })
);

interface PageContentContainerProps extends ContainerProps {
  height: string;
}

// A default container that should be used to wrap all pages. It is
// especially useful when a header is used - a height calc can be
// passed so that the container takes the remaining height, see
// /pages/game.
export const PageContentContainer = ({
  children,
  height: customHeight,
  ...rest
}: PageContentContainerProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
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
          height: customHeight,
          flexFlow: 'column',
        }}
        {...rest}
      >
        {children}
      </Container>
    </Box>
  );
};
