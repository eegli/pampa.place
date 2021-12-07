import {ApiTextHandler} from '../utils';

const ascii = `
,---------------------------,
|  /---------------------\  |
| |                       | |
| |     pampa.place       | |
| |       maps API        | |
| |        v1             | |
| |                       | |
|  \_____________________/  |
|___________________________|
,---\_____     []     _______/------,
/         /______________\           /|
/___________________________________ /  | ___
|                                   |   |    )
|  _ _ _                 [-------]  |   |   (
|  o o o                 [-------]  |  /    _)_
|__________________________________ |/     /  /
/-------------------------------------/|      ( )/
/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /
/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

https://www.asciiart.eu/computers/computers
`;

const handler: ApiTextHandler = (_, res) => {
  return res.status(200).send(`
  ----------------

  Available endpoints:

    /categories - map categories lookup
    /ids - map id lookup
    /data - GeoJSON map data
    /meta - Map metadata 

    /health

    https://google.com

  ----------------

  ${ascii}
  `);
};

export default handler;
