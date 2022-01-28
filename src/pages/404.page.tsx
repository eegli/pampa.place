import {Error} from '@/components/feedback/error';
import {NextPage} from 'next';
import {CustomHead} from '../components/head/custom-head';
import {Header} from '../components/header/header';
import {PageContent} from '../styles/containers';

const Error404Page: NextPage = () => {
  return (
    <>
      <CustomHead title="404 :(" />
      <Header />
      <PageContent headerGutter id="index-page">
        <Error
          severity="error"
          title="404 - Welcome to the V̸̰̥͆O̶̺̪͘͝İ̵̡̼̦͉̥̍͑͒̒̾͝Ḓ̵̥͓̯̳͑̒"
          error={`Whops, ${window.location.pathname} does not exist. Sorry.`}
        ></Error>
      </PageContent>
    </>
  );
};
export default Error404Page;
