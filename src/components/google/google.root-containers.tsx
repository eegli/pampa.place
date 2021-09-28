import { HTMLAttributes } from 'react';

interface RenderProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  display?: boolean;
}

export const GoogleMapRootContainer = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div
      id="__ROOT_GMAP__"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export const GoogleMapDiv = ({ display = false }: RenderProps) => (
  <div
    id="__GMAP__"
    style={{
      width: '100%',
      height: '100%',
      display: display ? 'none' : 'block',
    }}
  />
);

export const GoogleSVRootContainer = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div
      id="__ROOT_GSTV__"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export const GoogleSVDiv = ({ display = false }: RenderProps) => (
  <div
    id="__GSTV__"
    style={{
      width: '100%',
      height: '100%',
      display: display ? 'none' : 'block',
    }}
  />
);

export const InitWrapper = () => (
  <>
    <GoogleMapRootContainer>
      <GoogleMapDiv display />
    </GoogleMapRootContainer>
    <GoogleSVRootContainer>
      <GoogleSVDiv display />
    </GoogleSVRootContainer>
  </>
);
