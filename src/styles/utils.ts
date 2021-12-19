import {keyframes} from '@mui/material/styles';

type KeyedColorFadeProps = [number, string][];

export const keyedColorFade =
  (prop: string) =>
  (...steps: KeyedColorFadeProps) => {
    const gradient = steps
      .map(([perc, color]) => `${perc}% {${prop}: ${color}}`)
      .join(' ');
    return keyframes(gradient);
  };
