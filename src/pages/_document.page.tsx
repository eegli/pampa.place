import {createEmotionCache} from '@/styles/utils';
import createEmotionServer from '@emotion/server/create-instance';
import Document, {Head, Html, Main, NextScript} from 'next/document';

type DocumentProps = {
  emotionStyleTags: JSX.Element[];
};

export default class MyDocument extends Document<DocumentProps> {
  render() {
    return (
      <Html lang="en">
        <title>pampa.place</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Pampa.place - Where in the pampa am I?"
        />

        <meta property="og:url" content="https://www.pampa.place/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pampa Place 🚩" />
        <meta
          property="og:description"
          content="Pampa.place - Where in the pampa am I?"
        />
        <meta
          property="og:image"
          content="https://pampa.place/og_1200x630.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="pampa.place" />
        <meta property="twitter:url" content="https://www.pampa.place/" />
        <meta name="twitter:title" content="Pampa Place 🚩" />
        <meta
          name="twitter:description"
          content="Pampa.place - Where in the pampa am I?"
        />
        <meta
          name="twitter:image"
          content="https://pampa.place/og_1200x630.png"
        />

        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@100;400&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Exo:wght@900&display=optimal"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Mr+Dafoe&display=optimal"
            rel="stylesheet"
          />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

/* Currently buggy: */
/* https://github.com/mui-org/material-ui/issues/29742#issuecomment-982597676 */
MyDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const {extractCriticalToChunks} = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return {...initialProps, emotionStyleTags};
};
