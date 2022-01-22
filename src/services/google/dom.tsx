export enum GoogleDOMIds {
  MAP_CONTAINER = '__GMAP__CONTAINER__',
  MAP_DIV = '__GMAP__',
  STV_CONTAINER = '__GSTV__CONTAINER__',
  STV_DIV = '__GSTV__',
}

export const GmapContainer = () => {
  return (
    <div
      id={GoogleDOMIds.MAP_CONTAINER}
      data-testid={GoogleDOMIds.MAP_CONTAINER}
    >
      <div
        id={GoogleDOMIds.MAP_DIV}
        data-testid={GoogleDOMIds.MAP_DIV}
        style={{height: '100%'}}
      />
    </div>
  );
};

export const GstvContainer = () => {
  return (
    <div
      id={GoogleDOMIds.STV_CONTAINER}
      data-testid={GoogleDOMIds.STV_CONTAINER}
    >
      <div
        id={GoogleDOMIds.STV_DIV}
        data-testid={GoogleDOMIds.STV_DIV}
        style={{height: '100%'}}
      />
    </div>
  );
};
