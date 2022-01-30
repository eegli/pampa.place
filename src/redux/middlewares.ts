import {Constants} from '@/config/constants';
import {Middleware} from '@reduxjs/toolkit';
import {gaevent, GameEvent} from '../lib/analytics-events';
import {MAPS} from '../maps';
import {RootState} from './store';

export const windowStorage: Middleware<unknown, RootState> =
  () => next => action => {
    if (action.type === 'app/setApiKey') {
      window.sessionStorage.setItem(Constants.SESSION_API_KEY, action.payload);
    }
    if (action.type === 'app/setTheme') {
      window.localStorage.setItem(Constants.THEME_KEY, action.payload);
    }
    return next(action);
  };

export const eventLogger: Middleware<unknown, RootState> =
  state => next => action => {
    if (action.type === 'game/initGame') {
      const {game} = state.getState();
      gaevent<GameEvent>({
        eventName: 'game_start',
        category: 'game',
        payload: {
          map_name: game.mapName,
          map_category: MAPS.get(game.mapId)?.properties.category || 'custom',
          total_players: game.players.length || 1,
          total_rounds: game.rounds.total,
        },
      });
    } else if (action.type === 'game/endRound') {
      const {game} = state.getState();
      if (game.rounds.total === game.rounds.current) {
        gaevent<GameEvent>({
          eventName: 'game_end',
          category: 'game',
          payload: {
            map_name: game.mapName,
            map_category: MAPS.get(game.mapId)?.properties.category || 'custom',
            total_players: game.players.length || 1,
            total_rounds: game.rounds.total,
          },
        });
      }
    }

    return next(action);
  };
