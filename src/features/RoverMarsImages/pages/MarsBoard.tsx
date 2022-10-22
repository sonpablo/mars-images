import { useCallback, useEffect, useRef } from 'react';
import { Search, ListOfPhotos } from '../components';
import { Spinner } from '../../../ui-components';
import { useGetRoverPhotos, useNearScreen } from '../../../hooks';
import debounce from 'just-debounce-it';
import './MarsBoard.css';
import { FiltersType } from '../../../models/rovers';

const MarsBoard = (): JSX.Element => {
  const { photos, searching, nextPage, searchMarsPhotos } = useGetRoverPhotos();

  const externalRef = useRef<HTMLDivElement>(null);
  const { isNearScreen } = useNearScreen({
    externalRef: searching ? null : externalRef,
    once: false,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceHandleNextPage = useCallback(
    debounce(() => nextPage(), 200),
    [nextPage],
  );

  useEffect(() => {
    if (isNearScreen) debounceHandleNextPage();
  }, [debounceHandleNextPage, isNearScreen]);

  const handleFilters = (filters: FiltersType) => {
    searchMarsPhotos(filters);
  };

  return (
    <>
      <div style={{ minHeight: '100vh' }}>
        <Search onFilters={handleFilters} />
        <ListOfPhotos photos={photos} />
      </div>
      <div className="board-footer" id="observable" ref={externalRef}>
        {searching && <Spinner />}
      </div>
    </>
  );
};

export default MarsBoard;