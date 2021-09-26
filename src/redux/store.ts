import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import app from './slices/app';
import game from './slices/game';
import position from './slices/position';

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
