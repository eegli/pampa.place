import { RootState } from '../store';

export const getPositionError = (s: RootState) => s.position.error;

export const getInitialPosition = (s: RootState) => s.position.initialPosition;
export const getSelectedPosition = (s: RootState) =>
  s.position.selectedPosition;
