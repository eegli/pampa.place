import { Link, LinkProps, Paper, Typography } from '@mui/material';
import { TypographyProps } from '@mui/system';
import { GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import fetch from 'node-fetch';
import React, { ReactNode } from 'react';
import { SlimContainer } from '../styles/containers';

const components: Record<string, ReactNode> = {
  h1: (props: TypographyProps) => {
    console.log(props);
    return <Typography variant="h1" {...props} />;
  },
  p: (props: TypographyProps) => <Typography variant="body1" {...props} />,
  a: (props: LinkProps) => <Link target="_blank" {...props} />,
};

const MarkdownTest = ({ md }: { md: MDXRemoteSerializeResult }) => {
  return (
    <SlimContainer height="auto">
      <Paper elevation={2} sx={{ p: 3, m: 2, width: '100%' }}>
        <MDXRemote {...md} components={components} />
      </Paper>
    </SlimContainer>
  );
};

export default MarkdownTest;

export const getStaticProps: GetStaticProps = async ctx => {
  const response = await fetch(
    'https://raw.githubusercontent.com/kulshekhar/ts-jest/main/CONTRIBUTING.md'
  );
  const md = await response.text();

  const mdxSource = await serialize(md);
  return {
    props: { md: mdxSource },
  };
};
