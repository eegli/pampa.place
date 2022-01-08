type RetroTitleProps = {
  primary: string;
  secondary?: string;
  margin?: string;
};

export const FancyRetroTitle = ({
  primary,
  secondary,
  margin,
}: RetroTitleProps) => (
  <div
    style={{
      display: 'flex',
      margin: margin || '2rem auto',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontSize: 'clamp(10px, 2vw, 15px)',
    }}
  >
    <h1
      style={{
        position: 'relative',
        fontFamily: 'Exo',
        fontSize: '7em',
        margin: 0,
        transform: 'skew(-15deg)',
        letterSpacing: '0.03em',
      }}
    >
      <span
        style={{
          textShadow: '0 0 0.1em #8ba2d0, 0 0 0.2em black, 0 0 5em #165ff3',
        }}
      >
        {primary}
      </span>
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          backgroundImage:
            'linear-gradient(#032d50 25%, #00a1ef 35%, white 50%,   #20125f 50%,#8313e7 55%, #ff61af 75%  )',
          WebkitTextStroke: '0.01em #94a0b9',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {primary}
      </span>
    </h1>
    <h2
      style={{
        fontFamily: 'Mr Dafoe',
        fontWeight: 400,
        margin: 0,
        fontSize: '4.5em',
        marginTop: '-1.1em',
        color: 'white',
        textShadow: '0 0 0.05em #fff, 0 0 0.2em #fe05e1, 0 0 0.3em #fe05e1',
        transform: 'rotate(-7deg)',
      }}
    >
      {secondary}
    </h2>
  </div>
);
