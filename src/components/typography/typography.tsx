import { Box, styled } from '@mui/system';

const H1 = styled('h1')`
  position: relative;
  font-family: 'Exo';
  font-size: 7em;
  margin: 0;
  transform: skew(-15deg);
  letter-spacing: 0.03em;

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

  span:first-of-type {
    display: block;
    text-shadow: 0 0 0.1em #8ba2d0, 0 0 0.2em black, 0 0 5em #165ff3;
    -webkit-text-stroke: 0.06em rgba(black, 0.5);
  }

  span:last-of-type {
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

const H2 = styled('h2')`
  font-family: 'Mr Dafoe';
  font-weight: 400;
  margin: 0;
  font-size: 4.5em;
  margin-top: -1.1em;
  color: white;
  text-shadow: 0 0 0.05em #fff, 0 0 0.2em #fe05e1, 0 0 0.3em #fe05e1;
  transform: rotate(-7deg);
`;

const StyledBox = styled(Box)`
  display: flex;
  margin: 2rem auto;

  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: radial-gradient(rgba(#7600bf, 0.5) 0%, transparent 70%),
    linear-gradient(#0b161e 40%, #202076 70%);
  perspective: 700px;
  font-size: clamp(10px, 2vw, 15px);
`;

type RetroTitleProps = {
  primary: string;
  secondary: string;
};

const FancyRetroTitle = ({ primary, secondary }: RetroTitleProps) => (
  <StyledBox>
    <H1>
      <span>{primary}</span>
      <span>{primary}</span>
    </H1>
    <H2>{secondary}</H2>
  </StyledBox>
);

export default FancyRetroTitle;
