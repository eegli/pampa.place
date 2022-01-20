import {Header} from '@/components/nav/header/header';
import {FancyRetroTitle} from '@/components/typography/headings/retro-title';
import {LinkSection} from '@/components/typography/paragraph';
import {InfoBox} from '@/components/typography/paragraph/info-box';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {NextPage} from 'next';
import NextLink from 'next/link';
import {PageContent, SlimContainer} from '../../styles/containers';

const DocsPage: NextPage = () => {
  return (
    <>
      <Header />
      <PageContent headerGutter id="docs-page">
        <SlimContainer>
          <FancyRetroTitle primary="PAMPA" secondary="DOCS" />
          <LinkSection href="#how-to-play" title="how to play 📖">
            <Typography component="p">
              you will be abandoned in a random place on a map that you choose.
              check your surroundings for clues and find out where you are.
            </Typography>

            <Typography component="p">
              the gameplay is simple. first, enter your name and prefered game
              settings and select a map. if you&apos;re unsure about the
              location, you can preview it by clicking the icon next to the map
              dropdown.
            </Typography>

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

            <Divider sx={{mb: 1}} light variant="middle" />

            <InfoBox>
              you can preview all available maps by clicking &quot;preview
              maps&quot; in the menu
            </InfoBox>

            <InfoBox>
              pampa.place is great for exploring new places. just disable the
              time limit and enjoy
            </InfoBox>
          </LinkSection>
          <LinkSection
            href="#customization-guide"
            title="customization guide 🖊️"
          >
            <Typography component="p">
              if you want to play on this server and add your own map, go to the
              👉{' '}
              <NextLink href="/my-maps" passHref>
                <MuiLink variant="body1">My Maps</MuiLink>
              </NextLink>{' '}
              Page
            </Typography>

            <Divider sx={{mb: 1}} light variant="middle" />

            <InfoBox>
              you can preview all available maps by clicking &quot;preview
              maps&quot; in the menu
            </InfoBox>

            <InfoBox>
              pampa.place is great for exploring new places. just disable the
              time limit and enjoy
            </InfoBox>
          </LinkSection>

          <LinkSection
            href="#about-privacy"
            title="about &amp; privacy🕵️"
            isLast
          >
            <Typography component="p">sds</Typography>
            <Divider sx={{mb: 1}} light variant="middle" />

            <InfoBox>
              you can preview all available maps by clicking &quot;preview
              maps&quot; in the menu
            </InfoBox>

            <InfoBox>
              pampa.place is great for exploring new places. just disable the
              time limit and enjoy
            </InfoBox>
          </LinkSection>
        </SlimContainer>
      </PageContent>
    </>
  );
};

export default DocsPage;
