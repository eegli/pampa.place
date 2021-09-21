// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';

export type AuthReq = {
  pw: string;
};

export type AuthRes = {
  apikey: string;
};

const accessPW = env.APP_ACCESS_PW || '';

function getApiKeyFromEnv() {
  switch (env.NODE_ENV) {
    case 'development':
      return env.MAPS_LOCAL_API_KEY || '';
    case 'production':
      return env.MAPS_PROD_API_KEY || '';
    default:
      return '';
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthRes>
) {
  const envApiKey = getApiKeyFromEnv();
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
