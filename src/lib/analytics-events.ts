const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

type GenericEvent<
  C extends string = string,
  E extends string = string,
  P extends Record<string, unknown> = Record<string, unknown>
> = {
  category: C;
  eventName: E;
  payload?: P;
};

export type LoginEvent = GenericEvent<
  'login',
  'login_dev_mode' | 'login_apikey' | 'login_password' | 'login_password_failed'
>;

export type GameEvent = GenericEvent<
  'game',
  'game_start' | 'game_end',
  {
    map_name: string;
    map_category: string;
    total_rounds: number;
    total_players: number;
  }
>;

export function gaevent<T extends GenericEvent>({
  eventName,
  category,
  payload,
}: T) {
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: category,
      ...(payload && payload),
    });
  }
}

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
