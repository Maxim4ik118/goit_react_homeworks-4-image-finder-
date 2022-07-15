import { useState, useEffect } from 'react';

import { Searchbar, ImageGallery, Modal, Button } from './components';
import { fetchImages } from 'services/api';

const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, src: '', alt: '' });

  useEffect(() => {
    if(searchTerm.length === 0 && currentPage === 1) return;
    
    requestImages(searchTerm, currentPage);
  }, [currentPage, searchTerm]);

  const requestImages = async (searchTerm, currentPage) => {
    try {
      setIsFetching(true);

      const { hits } = await fetchImages(searchTerm, currentPage);

      if (currentPage === 1) {
        setImages(hits);
      } else {
        setImages(prevState => [...prevState, ...hits]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmitSearchTerm = searchTerm => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevState => prevState + 1);
  };

  const handleOpenModal = (src, alt) => {
    setModal(() => ({ isOpen: true, src, alt }));
  };

  const handleCloseModal = () => {
    setModal(() => ({ isOpen: false, src: '', alt: '' }));
  };

  return (
    <AppLayout
      handleSubmitSearchTerm={handleSubmitSearchTerm}
      error={error}
      isFetching={isFetching}
      images={images}
      handleOpenModal={handleOpenModal}
      handleLoadMore={handleLoadMore}
      modal={modal}
      handleCloseModal={handleCloseModal}
    />
  );
};

const AppLayout = ({
  handleSubmitSearchTerm,
  error,
  isFetching,
  images,
  handleOpenModal,
  handleLoadMore,
  modal,
  handleCloseModal,
}) => {
  const showLoadMoreBtn = images.length > 0 && !isFetching;

  return (
    <div className="app">
      <Searchbar onSubmit={handleSubmitSearchTerm} />
      <ImageGallery
        error={error}
        isFetching={isFetching}
        images={images}
        openFullScreenMode={handleOpenModal}
      />
      {showLoadMoreBtn && <Button onClick={handleLoadMore} />}
      {modal.isOpen && (
        <Modal closeModal={handleCloseModal}>
          <img src={modal.src} alt={modal.alt} />
        </Modal>
      )}
    </div>
  );
};

export default App;
