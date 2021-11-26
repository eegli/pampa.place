// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {env} from 'process';

export type AuthReq = {
  pw: string;
};

export type AuthRes = {
  apikey: string;
};

const envAccessPW = env.APP_ACCESS_PW || '';
const envApiKey = env.MAPS_API_KEY || '';

if (!envApiKey) {
  throw new Error('Missing env API keys');
}

if (!envAccessPW) {
  throw new Error('No env password defined');
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthRes>
) {
  if (!req.query.pw) {
    res.status(400).end('Resource not found');
  }
  if (req.query.pw === envAccessPW) {
    res.status(200).json({apikey: envApiKey});
  } else {
    res.status(401).end('Invalid password');
  }
}
