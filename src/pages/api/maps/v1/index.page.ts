/* eslint-disable  no-useless-escape */
import {ApiTextHandler} from '../common';

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

    /data - Map GeoJSON data
    /meta -  Map metadata 
    /properties - Map property data
   
    /health


  ----------------

  ${ascii}
  `);
};

export default handler;
