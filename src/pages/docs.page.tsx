import {Header} from '@/components/nav/header/header';
import {FancyRetroTitle} from '@/components/typography/retro-title';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {NextPage} from 'next';
import Link from 'next/link';
import {PageContentWrapper, SlimContainer} from '../styles/containers';

const InfoIcon = () => (
  <LightbulbIcon
    color="warning"
    style={{
      position: 'relative',
      top: '8px',
      margin: '0 10px 0px 0',
    }}
  />
);

const DocsPage: NextPage = () => {
  return (
    <>
      <Header />
      <PageContentWrapper headerGutter id="docs-page">
        <SlimContainer>
          <FancyRetroTitle primary="PAMPA" secondary="DOCS" />
          <Box id="how-to-play">
            <Link href="#how-to-play" passHref>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  '::before': {
                    content: '""',
                    display: 'block',
                    marginTop: '80px',
                    visibility: 'hidden',
                  },
                }}
              >
                how to play 📖
              </Typography>
            </Link>
            <Divider sx={{my: 2}} />
            <Typography component="p">
              you will be abandoned in a random place on a map that you choose.
              check your surroundings for clues and find out where you are.
            </Typography>
            <Divider sx={{my: 1}} light variant="middle" />
            <Typography component="p">
              the gameplay is simple. first, enter your name and prefered game
              settings and select a map. if you&apos;re unsure about the
              location, you can preview it by clicking the icon next to the map
              dropdown.
            </Typography>
            <Divider sx={{my: 1}} light variant="middle" />
            <Typography component="p">
              once you start the game, it will find a random street view
              panorama somewhere on the map. click &quot;start round&quot; and,
              if you set a time limit, hurry up! if you think you know where you
              are, click the map icon in the bottom right corner and set your
              position.
            </Typography>
            <Typography component="p">
              after time has run out, your turn will end automatically and
              it&apos;s your opponent&apos;s turn.
            </Typography>
            <Divider sx={{my: 1}} light variant="middle" />
            <Box display="flex">
              <InfoIcon />
              <Typography component="p" color="text.secondary">
                you can preview all available maps by clicking &quot;preview
                maps&quot; in the menu
              </Typography>
            </Box>
            <Box display="flex">
              <InfoIcon />
              <Typography component="p" color="text.secondary">
                pampa.place is great for exploring new places. just disable the
                time limit and enjoy
              </Typography>
            </Box>
          </Box>
          <Box id="customization-guide">
            <Link href="#customization-guide" passHref>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  '::before': {
                    content: '""',
                    display: 'block',
                    marginTop: '80px',
                    visibility: 'hidden',
                  },
                }}
              >
                customization guide 🖊️
              </Typography>
            </Link>
            <Divider sx={{my: 2}} />
            <Typography component="p">docs will follow!</Typography>
            <Divider sx={{my: 1}} light variant="middle" />
            <Box display="flex">
              <InfoIcon />
              <Typography component="p" color="text.secondary">
                tipps will follow!
              </Typography>
            </Box>
          </Box>
          <Box id="about-privacy">
            <Link href="#about-privacy" passHref>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  '::before': {
                    content: '""',
                    display: 'block',
                    marginTop: '80px',
                    visibility: 'hidden',
                  },
                }}
              >
                about &amp; privacy 🕵️
              </Typography>
            </Link>
            <Divider sx={{my: 2}} />
            <Typography component="p">docs will follow!</Typography>
            <Divider sx={{my: 1}} light variant="middle" />
            <Box display="flex">
              <InfoIcon />
              <Typography component="p" color="text.secondary">
                tipps will follow!
              </Typography>
            </Box>
          </Box>
        </SlimContainer>
      </PageContentWrapper>
    </>
  );
};

export default DocsPage;
