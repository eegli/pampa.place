// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';

export type AuthReq = {
  pw: string;
};

export type AuthRes = {
  apikey: string;
};

const accessPW = env.APP_ACCESS_PW;
const envApiKey = env.MAPS_API_KEY;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthRes>
) {
  if (!envApiKey) {
    throw new Error('Missing API keys');
  }

  if (!accessPW) {
    throw new Error('No password defined');
  }

  if (!req.query.pw) {
    res.status(400).end('Resource not found');
  }
  if (req.query.pw === accessPW) {
    res.status(200).json({ apikey: envApiKey });
  } else {
    res.status(401).end('Invalid password');
  }
}
