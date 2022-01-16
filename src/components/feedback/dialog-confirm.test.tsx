import {fireEvent, render, screen} from '@/tests/utils';
import {ConfirmationDialog, ConfirmationDialogProps} from './dialog-confirm';

const mockConfirmCallback = jest.fn();
const mockCancelCallback = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Confirmation dialog', () => {
  it('renders with all props', () => {
    const props: ConfirmationDialogProps = {
      title: 'title of a confirmation dialog',
      infoMessage: 'Blabla info',
      confirmMessage: 'Proceed?',
      cancelMessage: 'Abort',
      onCancelCallback: mockCancelCallback,
      onConfirmCallback: mockConfirmCallback,
    };

    render(<ConfirmationDialog {...props} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Abort');
    fireEvent.click(buttons[0]);
    expect(mockCancelCallback).toHaveBeenCalledTimes(1);
    fireEvent.click(buttons[1]);
    expect(mockConfirmCallback).toHaveBeenCalledTimes(1);
    expect(buttons[1]).toHaveTextContent('Proceed');
    expect(screen.getByRole('heading')).toHaveTextContent(
      'title of a confirmation dialog'
    );
    expect(screen.getByText('Blabla info')).toBeInTheDocument();
  });
  it('has default values', () => {
    const props: ConfirmationDialogProps = {
      title: 'a title is required',
      infoMessage: 'body text',
      onCancelCallback: mockCancelCallback,
      onConfirmCallback: mockConfirmCallback,
    };
    render(<ConfirmationDialog {...props} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Cancel');
    fireEvent.click(buttons[0]);
    expect(mockCancelCallback).toHaveBeenCalledTimes(1);
    fireEvent.click(buttons[1]);
    expect(mockConfirmCallback).toHaveBeenCalledTimes(1);
    expect(buttons[1]).toHaveTextContent('Confirm');
    expect(screen.getByRole('heading')).toHaveTextContent(
      'a title is required'
    );
    expect(screen.getByText('body text')).toBeInTheDocument();
  });
});
