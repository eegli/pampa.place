import {ApiTextHandler} from '../../common';

const handler: ApiTextHandler = (_, res) => {
  return res.status(200).send('ok');
};

export default handler;
