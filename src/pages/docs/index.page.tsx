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
            <Typography>
              you will be abandoned in a random place on a map that you choose.
              check your surroundings for clues and find out where you are.
            </Typography>

            <Typography>
              the gameplay is simple. first, enter your name and prefered game
              settings and select a map. if you&apos;re unsure about the
              location, you can preview it by clicking the icon next to the map
              dropdown.
            </Typography>

            <Typography>
              once you start the game, it will find a random street view
              panorama somewhere on the map. click &quot;start round&quot; and,
              if you set a time limit, hurry up! if you think you know where you
              are, click the map icon in the bottom right corner and set your
              position.
            </Typography>

            <Typography>
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
            <Typography>
              you can easily add new maps to this server on the{' '}
              <NextLink href="/my-maps" passHref>
                <MuiLink variant="body1">my maps page</MuiLink>
              </NextLink>{' '}
              - as many as you like, one at a time. maps that you add there are
              only available in your current browser.
            </Typography>
            <Typography>
              if, for some reason, adding your own maps is not working, refer to
              the readme (link below) - it may be possible that your map input
              is not in the right format.
            </Typography>
            <Typography>
              if you want to customize everything and have persistent maps,
              you&apos;ll likely need to host your own server. refer to the docs
              on{' '}
              <MuiLink
                href="https://github.com/eegli/pampa.place"
                target="_blank"
                variant="body1"
              >
                github
              </MuiLink>
              .
            </Typography>
          </LinkSection>

          <LinkSection
            href="#about-privacy"
            title="about &amp; privacy🕵️"
            isLast
          >
            <Typography>
              why does this project exist? a while ago, a geo game i loved
              removed my favorite feature - local multiplayer. and there was no
              way to play on custom maps. since competing against your friends
              in a place you know is way more fun, i decided to make my own geo
              game.
            </Typography>
            <Typography>
              working on pampa.place turned out to be a lot of fun and i quickly
              grew attached to my new favorite pet project. i&apos;m by no means
              a professional web developer and many things could possibly be
              improved. my main goal of somehow making this work has been
              achieved - all thanks to valuable feedback from my friends and
              family.
            </Typography>
            everything on this website is{' '}
            <MuiLink
              href="https://github.com/eegli/pampa.place"
              target="_blank"
              variant="body1"
            >
              open-source
            </MuiLink>{' '}
            and contributions are very welcome. in terms of privacy, this game
            uses a very minimal google analytics integration. no personal data
            is collected.
          </LinkSection>
        </SlimContainer>
      </PageContent>
    </>
  );
};

export default DocsPage;
