import Box, {BoxProps} from '@mui/material/Box';
import Typography, {TypographyProps} from '@mui/material/Typography';
import NextLink from 'next/link';
import {ReactNode} from 'react';

interface LinkSectionProps extends BoxProps {
  href: string;
  title: string;
  children: ReactNode;
  isLast?: boolean;
  titleProps?: TypographyProps<'h2'>;
}

export const LinkSection = ({
  href,
  title,
  children,
  isLast,
  titleProps,
  ...rest
}: LinkSectionProps) => {
  const {sx} = rest;
  return (
    <>
      <Box
        {...rest}
        sx={{
          ...sx,
          marginBottom: isLast ? 5 : 7,
          '& > p': {
            my: 2,
          },
        }}
      >
        <NextLink href={href} passHref>
          <Typography
            gutterBottom
            id={href.slice(1)}
            variant="h4"
            component="h2"
            sx={{
              scrollMarginTop: '80px',
            }}
            {...titleProps}
          >
            {title}
          </Typography>
        </NextLink>
        {children}
      </Box>
    </>
  );
};
