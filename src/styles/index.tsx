import {
  Box,
  BoxProps,
  Breakpoint,
  Container,
  ContainerProps,
  styled,
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
      maxWidth: ({ breakpoints }) => breakpoints.values[breakpoint],
      margin: ({ spacing }) => `${spacing(1)} auto ${spacing(1)} auto`,
      padding: ({ spacing }) => spacing(2),
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

export const RetroTitle = styled('h3')`
  transform: skew(-15deg);
  letter-spacing: 0.03em;
  font-size: 8vw;
  position: 'relative';
  font-size: 3rem;
  &::after {
    content: '';
    position: absolute;
    top: -0.1em;
    right: 0.05em;
    width: 0.4em;
    height: 0.4em;
    background: radial-gradient(
        white 3%,
        rgba(white, 0.3) 15%,
        rgba(white, 0.05) 60%,
        transparent 80%
      ),
      radial-gradient(rgba(white, 0.2) 50%, transparent 60%) 50% 50% / 5% 100%,
      radial-gradient(rgba(white, 0.2) 50%, transparent 60%) 50% 50% / 70% 5%;
    background-repeat: no-repeat;
  }

  & > span:first-of-type {
    display: block;
    text-shadow: 0 0 0.1em #8ba2d0, 0 0 0.2em black, 0 0 0.5em #165ff3;
    -webkit-text-stroke: 0.06em rgba(black, 0.5);
  }

  & > span:last-of-type {
    position: absolute;
    left: 0;
    top: 0;
    background-image: linear-gradient(
      #032d50 25%,
      #00a1ef 35%,
      white 50%,
      #20125f 50%,
      #8313e7 55%,
      #ff61af 75%
    );
    -webkit-text-stroke: 0.01em #94a0b9;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
