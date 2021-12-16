import {Box, BoxProps, Breakpoint} from '@mui/material';

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

interface PageContainerWrapperProps extends BoxProps {
  headerGutter?: boolean;
  id: string;
}

export const PageContentWrapper = ({
  children,
  headerGutter,
  id,
  ...rest
}: PageContainerWrapperProps) => {
  return (
    <Box
      width="100%"
      height={headerGutter ? 'calc(100%-64px)' : '100%'}
      margin={`${headerGutter ? '64px' : 0} auto 0 auto`}
      display="flex"
      flexDirection="column"
      alignItems="center"
      id={id}
      {...rest}
    >
      {children}
    </Box>
  );
};

type FullSizeBoxProps = Omit<BoxProps, 'width' | 'height'>;

export const FullSizeBox = ({id, children, ...rest}: FullSizeBoxProps) => (
  <Box id={id} width="100%" height="100%" {...rest}>
    {children}
  </Box>
);
