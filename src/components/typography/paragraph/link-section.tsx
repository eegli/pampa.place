import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import {ReactNode} from 'react';

interface LinkSectionProps {
  href: string;
  title: string;
  children: ReactNode;
  isLast?: boolean;
}

export const LinkSection = ({
  href,
  title,
  children,
  isLast,
}: LinkSectionProps) => {
  return (
    <>
      <Box
        sx={{
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
          >
            {title}
          </Typography>
        </NextLink>
        {children}
      </Box>
    </>
  );
};
