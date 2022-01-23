import * as PreviewDialog from '@/components/feedback/dialog-preview';
import {testMap} from '@/tests/fixtures/map';
import {act, fireEvent, render, screen} from '@/tests/utils';
import {FormMapSelect} from './select-map';

describe('Form, map selection with category subheaders', () => {
  const previewSpy = jest.spyOn(PreviewDialog, 'PreviewDialog');
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
    expect(previewSpy).toHaveBeenCalledTimes(1);
    expect(previewSpy.mock.calls[0][0].text).toBe(
      'Rough bounds of the map "my test map"'
    );
    expect(previewSpy.mock.calls[0][0].title).toBe('my test map');
    act(() => {
      previewSpy.mock.calls[0][0].onCloseCallback();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
