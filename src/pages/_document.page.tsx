import createCache from '@emotion/cache/';
import createEmotionServer from '@emotion/server/create-instance';
import Document, {Head, Html, Main, NextScript} from 'next/document';
import {Children} from 'react';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <title>🗺️Pampa Place🚩</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Pampa.place - Where in the pampa am I?"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=optional"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@100;400&display=optional"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Exo:wght@900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Mr+Dafoe&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

/* Currently buggy: */
/* https://github.com/mui-org/material-ui/issues/29742 */
MyDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage;
  const cache = createCache({key: 'css'});
  const {extractCriticalToChunks} = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{__html: style.css}}
    />
  ));

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};
