import {testMap} from '@/tests/fixtures/map';
import {fireEvent, render, screen, within} from '@/tests/utils';
import {FormMapSelect} from './select-map';

describe('Form, map selection with category subheaders', () => {
  it('displays maps and categories', () => {
    render(<FormMapSelect />);
    const mapPreviewButtons = screen.getAllByRole('button', {
      name: testMap.properties.name,
    });
    expect(mapPreviewButtons).toHaveLength(1);
    fireEvent.mouseDown(mapPreviewButtons[0]);
    const fields = screen.getAllByRole('option');
    expect(fields).toHaveLength(2);
    // The category is capitalized in the dropdown
    expect(fields[0]).toHaveTextContent(
      new RegExp(testMap.properties.category, 'i')
    );
    expect(fields[1]).toHaveTextContent(testMap.properties.name);
  });
  it('displays map preview', () => {
    render(<FormMapSelect />);
    const previewMapButton = screen.getByRole('button', {
      name: 'preview-map-icon',
    });
    fireEvent.click(previewMapButton);
    const popup = screen.getByRole('dialog');

    within(popup).getByText('Rough bounds of the map "my test map"');
    fireEvent.click(within(popup).getByRole('button', {name: 'Close'}));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
