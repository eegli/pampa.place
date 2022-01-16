import {fireEvent, render, screen} from '@/tests/utils';
import {PreviewDialog} from './dialog-preview';

const mockCloseCallback = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Preview dialog', () => {
  it('renders with all props', () => {
    render(
      <PreviewDialog
        title="title of a preview dialog"
        text="Blabla body text"
        onCloseCallback={mockCloseCallback}
      >
        <div data-testid="child-elem">some text</div>
      </PreviewDialog>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('Close');
    fireEvent.click(buttons[0]);
    expect(mockCloseCallback).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading')).toHaveTextContent(
      'title of a preview dialog'
    );
    expect(screen.getByTestId('child-elem')).toBeInTheDocument();
    expect(screen.getByText('Blabla body text')).toBeInTheDocument();
  });
});
