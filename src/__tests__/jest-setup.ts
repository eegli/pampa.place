import '@testing-library/jest-dom/extend-expect';

jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'info').mockImplementation(() => jest.fn());

jest.mock('../config/maps');
