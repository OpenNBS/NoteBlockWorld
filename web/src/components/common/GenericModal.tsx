import Modal from 'react-modal';

type TGenericModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
};

const GenericModal = ({ isOpen, setIsOpen, children }: TGenericModalProps) => {
  return (
    <Modal
      ariaHideApp={false}
      closeTimeoutMS={200}
      onAfterOpen={() => {
        document.body.style.overflow = 'hidden';
      }}
      onAfterClose={() => {
        document.body.style.overflow = 'unset';
      }}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          overflow: 'visible',
          width: 'auto',
          height: 'auto',
          maxWidth: '100vw',
          maxHeight: '100vh',
          zIndex: 99,
          border: 'none',
          padding: '0',
          color: 'white',
          backgroundColor: 'transparent',
        },
        overlay: {
          position: 'fixed',
          top: '-25vh',
          left: '-25vw',
          right: 0,
          bottom: 0,
          width: '150vw',
          height: '150vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(5px)',
          zIndex: 99,
        },
      }}
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
    >
      {children}
    </Modal>
  );
};

export default GenericModal;
