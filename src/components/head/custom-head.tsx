import Head from 'next/head';

type HeadProps = {
  title: string;
};

/* https://github.com/vercel/next.js/discussions/38256 */
export const CustomHead = ({title}: HeadProps) => {
  title = `pampa.place | ${title.toLowerCase()}`;
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};
