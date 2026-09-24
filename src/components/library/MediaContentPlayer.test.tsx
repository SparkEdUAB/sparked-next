import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaContentPlayer } from './MediaContentPlayer';

const { fetcherMock, fetchRelatedMock } = vi.hoisted(() => ({
  fetcherMock: vi.fn(),
  fetchRelatedMock: vi.fn(),
}));

vi.mock('@hooks/use-swr/fetcher', () => ({ fetcher: fetcherMock }));
vi.mock('fetchers/library/fetchRelatedMedia', () => ({ fetchRelatedMediaClient: fetchRelatedMock }));
vi.mock('./MediaViewer', () => ({ MediaViewer: ({ mediaContent }: any) => <div>Viewing {mediaContent.name}</div> }));
vi.mock('./MediaDetails', () => ({ MediaDetails: () => null }));
vi.mock('./RelatedMediaContentList', () => ({
  RelatedMediaContentList: ({ relatedMediaContent, onSelect }: any) => (
    <div>
      {relatedMediaContent?.map((item: any) => (
        <button key={item._id} onClick={() => onSelect(item)}>{item.name}</button>
      ))}
    </div>
  ),
}));

describe('MediaContentPlayer', () => {
  beforeEach(() => {
    fetcherMock.mockReset();
    fetchRelatedMock.mockReset();
  });

  it('switches related media in place while updating the URL', async () => {
    const initial = { _id: '1', name: 'First media' };
    const next = { _id: '2', name: 'Second media' };
    fetcherMock.mockResolvedValue({ mediaContent: next });
    fetchRelatedMock.mockResolvedValue([]);
    const replaceState = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

    render(<MediaContentPlayer initialMediaContent={initial as any} initialRelatedMedia={[next] as any} />);
    fireEvent.click(screen.getByRole('button', { name: 'Second media' }));

    expect(screen.getByText('Viewing Second media')).toBeInTheDocument();
    expect(replaceState).toHaveBeenCalledWith(null, '', '/library/media/2');
    await waitFor(() => expect(fetchRelatedMock).toHaveBeenCalledWith(next));
    replaceState.mockRestore();
  });

  it('ignores a stale response after a newer selection', async () => {
    const initial = { _id: '1', name: 'First media' };
    const second = { _id: '2', name: 'Second media' };
    const third = { _id: '3', name: 'Third media' };
    let finishSecond!: (value: { mediaContent: typeof second }) => void;
    fetcherMock.mockImplementation((url: string) =>
      url.includes('mediaContentId=2')
        ? new Promise((resolve) => { finishSecond = resolve; })
        : Promise.resolve({ mediaContent: third }),
    );
    fetchRelatedMock.mockResolvedValue([]);
    const replaceState = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

    render(<MediaContentPlayer initialMediaContent={initial as any} initialRelatedMedia={[second, third] as any} />);
    fireEvent.click(screen.getByRole('button', { name: 'Second media' }));
    fireEvent.click(screen.getByRole('button', { name: 'Third media' }));
    await waitFor(() => expect(fetchRelatedMock).toHaveBeenCalledWith(third));

    await act(async () => finishSecond({ mediaContent: second }));
    expect(screen.getByText('Viewing Third media')).toBeInTheDocument();
    replaceState.mockRestore();
  });
});
