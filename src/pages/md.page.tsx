import {Link, LinkProps, Paper, Typography} from '@mui/material';
import {TypographyProps} from '@mui/system';
import {GetStaticProps} from 'next';
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote';
import {serialize} from 'next-mdx-remote/serialize';
import fetch from 'node-fetch';
import React, {ReactNode} from 'react';
import {SlimContainer} from '../styles/containers';

const components: Record<string, ReactNode> = {
  h1: (props: TypographyProps) => (
    <Typography variant="h3" {...props} gutterBottom />
  ),
  h2: (props: TypographyProps) => (
    <Typography variant="h4" {...props} gutterBottom />
  ),
  p: (props: TypographyProps) => (
    <Typography variant="body1" {...props} gutterBottom />
  ),
  code: (props: TypographyProps) => (
    <Typography variant="body1" {...props} gutterBottom />
  ),
  a: (props: LinkProps) => <Link target="_blank" {...props} />,
};

const MarkdownTest = ({md}: {md: MDXRemoteSerializeResult}) => {
  return (
    <SlimContainer height="auto">
      <Paper elevation={2} sx={{p: 3, m: 2, width: '100%'}}>
        <Typography variant="overline" gutterBottom>
          This is a test page to render markdown content from a remote source
        </Typography>
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
    props: {md: mdxSource},
  };
};