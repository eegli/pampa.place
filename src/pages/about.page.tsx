import {Header} from '@/components/header/header';
import {FancyRetroTitle} from '@/components/typography/headings/retro-title';
import {LinkSection} from '@/components/typography/paragraph';
import {InfoBox} from '@/components/typography/paragraph/info-box';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {NextPage} from 'next';
import NextLink from 'next/link';
import {useAppSelector} from '../redux/hooks';
import {PageContent, SlimContainer} from '../styles/containers';

const DocsPage: NextPage = () => {
  const apiKey = useAppSelector(({app}) => app.apiKey);
  const isDevMode = apiKey === '';
  return (
    <>
      <Header />
      <PageContent headerGutter id="docs-page">
        <SlimContainer>
          <FancyRetroTitle primary="PAMPA" secondary="DOCS" />
          {isDevMode && (
            <>
              <LinkSection
                titleProps={{color: 'primary.main'}}
                href="#"
                title="google maps can't load correctly!"
              >
                <Typography>
                  welcome! it looks like you&apos;re playing the game in
                  development mode. this means that google maps loads without
                  api key. if you want the full experience, ask whoever is
                  hosting this game for the password or read below to get your
                  own google maps api key.
                </Typography>
              </LinkSection>
            </>
          )}
          <LinkSection href="#how-to-play" title="how to play 📖">
            <Typography>
              you will be abandoned in a random place on a map that you choose.
              check your surroundings for clues and find out where you are.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              the gameplay is simple. first, enter your name and prefered game
              settings and select a map. if you&apos;re unsure about the
              location, you can preview it by clicking the icon next to the map
              dropdown.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              once you start the game, it will find a random street view
              panorama somewhere on the map. click &quot;start round&quot; and,
              if you set a time limit, hurry up! if you think you know where you
              are, click the map icon in the bottom right corner and set your
              position.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              after time has run out, your turn will end automatically and
              it&apos;s your opponent&apos;s turn.
            </Typography>

            <InfoBox>
              you can preview all available maps by clicking &quot;preview
              maps&quot; in the menu
            </InfoBox>

            <InfoBox>
              pampa.place is great for exploring new places. just disable the
              time limit and enjoy
            </InfoBox>
          </LinkSection>
          <LinkSection href="#how-to-customize" title="how to customize 🗺️">
            <Typography>
              you can easily add new maps to this server on the{' '}
              <NextLink href="/my-maps" passHref>
                <MuiLink variant="body1" underline="none">
                  my maps page
                </MuiLink>
              </NextLink>{' '}
              - as many as you like, one at a time. maps that you add there are
              only available in your current browser.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              if, for some reason, adding your own maps is not working, refer to
              the readme (link below) - it may be possible that your map input
              is not in the right format.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              if you want to customize everything and have persistent maps,
              you&apos;ll likely need to host your own server. refer to the docs
              on{' '}
              <MuiLink
                href="https://github.com/eegli/pampa.place"
                target="_blank"
                variant="body1"
                underline="none"
              >
                github
              </MuiLink>
              .
            </Typography>
          </LinkSection>

          <LinkSection href="#about" title="about 🎨">
            <Typography>
              why does this project exist? if you&apos;re a connoisseur of geo
              games, you probably know that few of them are free to play. and
              even fewer allow users to play wherever they want.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              pampa.place is an{' '}
              <MuiLink
                href="https://github.com/eegli/pampa.place"
                target="_blank"
                variant="body1"
                underline="none"
              >
                open-source
              </MuiLink>{' '}
              project that aims to make it possible for everyone to explore any
              place in the world, without any limitations. it&apos;s built using
              data from google maps. at the time of writing, every google
              account gets 200$ per month for free to spend on the google maps
              platform.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              instead of paying for a service, the idea behind pampa.place is
              that everyone brings their own api key associated with their
              account. the game is optimized to use very little data from google
              maps - 200$ per month can last for thousands of games.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              in the past months, i&apos;ve had a lot of fun working on
              pampa.place. i&apos;m by no means a professional web developer and
              many things could possibly be improved. that being said,
              contributions to this project are very welcome!
            </Typography>

            <InfoBox>
              you can get your own google maps api key here:{' '}
              <MuiLink
                href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                target="_blank"
                variant="body1"
                underline="none"
              >
                google maps platform
              </MuiLink>
              . note that you will need a key specifically for the{' '}
              <em>maps javascript api</em>
            </InfoBox>
            <InfoBox>
              for more information, go checkout the{' '}
              <MuiLink
                href="https://github.com/eegli/pampa.place#readme"
                target="_blank"
                variant="body1"
                underline="none"
              >
                readme on github
              </MuiLink>
            </InfoBox>
          </LinkSection>
          <LinkSection href="#privacy" title="privacy 🕵️" isLast>
            <Typography>
              this game uses a very minimal google analytics integration. no
              personal data is collected.
            </Typography>
          </LinkSection>
        </SlimContainer>
      </PageContent>
    </>
  );
};

export default DocsPage;
