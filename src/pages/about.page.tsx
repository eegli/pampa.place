import {Header} from '@/components/header/header';
import {FancyRetroTitle} from '@/components/typography/headings/retro-title';
import {LinkSection} from '@/components/typography/paragraph';
import {InfoBox} from '@/components/typography/paragraph/info-box';
import {amber} from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {NextPage} from 'next';
import NextLink from 'next/link';
import {CustomHead} from '../components/head/custom-head';
import {useAppSelector} from '../redux/hooks';
import {PageContent, SlimContainer} from '../styles/containers';

export const AboutPage: NextPage = () => {
  const apiKey = useAppSelector(({app}) => app.apiKey);
  const isPreviewMode = apiKey === '';
  return (
    <>
      <CustomHead title="about" />
      <Header />
      <PageContent headerGutter id="docs-page">
        <SlimContainer>
          <FancyRetroTitle primary="PAMPA" secondary="DOCS" />
          {isPreviewMode && (
            <LinkSection
              href=""
              title="google maps can't load correctly"
              titleProps={{variant: 'h5', color: amber[500]}}
              sx={{
                border: 1,
                p: 2,
                borderColor: amber[500],
                borderStyle: 'double',
                borderWidth: 2,
              }}
            >
              <Typography>hi! 👋🏽</Typography>{' '}
              <Typography>
                it looks like you&apos;re playing the game in preview mode. this
                means that google maps loads <em>without</em> api key and
                therefore can&apos;t display map data. you can still play the
                game and take a glance at how it works.
              </Typography>
              <Typography>
                for the full experience, ask whoever is hosting this game for
                the password or read the <em>about</em> section below to get
                your own google maps api key.
              </Typography>
            </LinkSection>
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
              <MuiLink href="/my-maps" component={NextLink} underline="none">
                {'my maps page '}
              </MuiLink>
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
              account gets{' '}
              <s>200$ per month for free to spend on the google maps</s>
              platform.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <Typography>
              instead of paying for a service, the idea behind pampa.place is
              that everyone brings their own api key associated with their
              account. the game is optimized to use very little data from google
              maps - <s>200$ per month</s> can last for thousands of games.
            </Typography>
            <Divider sx={{mb: 1}} light variant="middle" />
            <InfoBox type="warning">
              <b>
                Update as of 2025: Google will introduce a new{' '}
                <MuiLink
                  href="https://mapsplatform.google.com/resources/blog/build-more-for-free-and-access-more-discounts-online-with-google-maps-platform-updates/"
                  target="_blank"
                  variant="body1"
                  underline="none"
                >
                  Maps pricing structure as of March 2025
                </MuiLink>{' '}
              </b>
              . They frame this as &quot;expanded usage limits&quot; but
              unfortunately, it reduces the number of free Street View renders
              by A LOT. You can still play many rounds of pampa.place for free
              but be cautious about billing. It is in your sole responsibility
              to make sure you understand your Maps API usage and billing.
            </InfoBox>
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

export default AboutPage;
