import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

export enum DomNodeIds {
  GOOGLE_MAP = '__GMAP__',
  GOOGLE_STREET_VIEW = '__GSTV__',
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }
  render() {
    return (
      <Html lang="en">
        <Head />
        <title>Geoguesseric</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Geoguesseric - Play with friends" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@100;400&display=swap"
          rel="stylesheet"
        ></link>

        <body>
          <Main />
          <NextScript />
          <div
            id={DomNodeIds.GOOGLE_MAP}
            style={{ width: '100%', height: '100%', display: 'none' }}
          />
          <div
            id={DomNodeIds.GOOGLE_STREET_VIEW}
            style={{ width: '100%', height: '100%', display: 'none' }}
          />
        </body>
      </Html>
    );
  }
}
