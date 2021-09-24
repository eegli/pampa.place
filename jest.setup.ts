import '@testing-library/jest-dom/extend-expect';

jest.spyOn(global.console, 'count').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'info').mockImplementation(() => jest.fn());
