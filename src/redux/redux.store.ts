import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import app from './app/app.slice';
import game from './game/game.slice';
import position from './position/position.slice';

export const rootReducer = combineReducers({
  position,
  game,
  app,
});

/* const persistConfig = {
  key: 'root',
  storage,
};
 */

/* const persistedReducer = persistReducer(persistConfig, rootReducer); */

const devMiddleware = [logger];

const isDev = process.env.NODE_ENV !== 'production';

// Export for tests

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefault =>
    isDev
      ? getDefault({ serializableCheck: false }).concat(devMiddleware)
      : getDefault({ serializableCheck: false }),
});

/* const persistor = persistStore(store); */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;