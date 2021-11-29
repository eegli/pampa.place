import {configureStore, StateFromReducersMapObject} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import app from './app/app.slice';
import game from './game/game.slice';
import position from './position/position.slice';

const reducer = {
  position: position.reducer,
  app: app.reducer,
  game: game.reducer,
};

export const initialStates = {
  position: position.reducer(undefined, {type: '@@INIT'}),
  app: app.reducer(undefined, {type: '@@INIT'}),
  game: game.reducer(undefined, {type: '@@INIT'}),
};

const isDev = process.env.NODE_ENV === 'development';
const devMiddleware = [logger];

export function createStore(preloadedState?: RootState) {
  return configureStore({
    reducer,
    preloadedState,
    devTools: false,
    middleware: getDefault =>
      isDev
        ? getDefault({serializableCheck: false}).concat(devMiddleware)
        : getDefault({serializableCheck: false}),
  });
}

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = StateFromReducersMapObject<typeof reducer>;
