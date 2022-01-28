import Head from 'next/head';

type HeadProps = {
  title: string;
};

export const CustomHead = ({title}: HeadProps) => {
  return (
    <Head>
      <title>pampa.place | {title.toLowerCase()}</title>
    </Head>
  );
};
