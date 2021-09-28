const GlobalStyles = () => {
  return (
    <style jsx global>{`
      html,
      body,
      div#__next {
        height: 100%;
      }

      /* Classname for the Google Maps player icons  */
      .map-marker {
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
          1px 1px 0 #000;
      }
    `}</style>
  );
};

export default GlobalStyles;
