import { useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { StyledModal } from './Styled';

const Modal = ({ children, closeModal }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      this.props.closeModal();
    }
  };

  return (
    <StyledModal onClick={closeModal()}>
      <div className="modal">{children}</div>
    </StyledModal>
  );
};

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default Modal;
