import { fireEvent, render, screen } from '@testing-library/react';

import Modal from './Modal';

describe('Modal component', () => {
  it('should render with title and subtitle', () => {
    render(
      <Modal
        title="Test Modal"
        subtitle="This is a test modal"
        mainAction={{ text: 'Confirm' }}
        onClose={() => {}}
      >
        Modal Body
      </Modal>,
    );
    const titleElement = screen.getByText(/Test Modal/i);
    const subtitleElement = screen.getByText(/This is a test modal/i);
    expect(titleElement).toBeInTheDocument();
    expect(subtitleElement).toBeInTheDocument();
  });

  it('should call onClose when close icon is clicked', () => {
    let closed = false;
    const handleClose = () => {
      closed = true;
    };
    render(
      <Modal
        title="Test Modal"
        showCloseIcon
        mainAction={{ text: 'Confirm' }}
        onClose={handleClose}
      >
        Modal Body
      </Modal>,
    );
    const closeIcon = screen.getByLabelText(/Close/i);
    fireEvent.click(closeIcon);
    expect(closed).toBe(true);
  });

  it('should call onClose when clicking outside the modal if clickOutsideCloseModal is true', () => {
    let closed = false;
    const handleClose = () => {
      closed = true;
    };
    render(
      <Modal
        title="Test Modal"
        mainAction={{ text: 'Confirm' }}
        onClose={handleClose}
        clickOutsideCloseModal
      >
        Modal Body
      </Modal>,
    );
    const overlay = screen.getByRole('dialog').parentElement;
    fireEvent.click(overlay!);
    expect(closed).toBe(true);
  });

  it('should not call onClose when clicking outside the modal if clickOutsideCloseModal is false', () => {
    let closed = false;
    const handleClose = () => {
      closed = true;
    };
    render(
      <Modal
        title="Test Modal"
        mainAction={{ text: 'Confirm' }}
        onClose={handleClose}
        clickOutsideCloseModal={false}
      >
        Modal Body
      </Modal>,
    );
    const overlay = screen.getByRole('dialog').parentElement;
    fireEvent.click(overlay!);
    expect(closed).toBe(false);
  });

  it('should call mainAction onClick when main action button is clicked', () => {
    let actionClicked = false;
    const handleMainActionClick = () => {
      actionClicked = true;
    };

    render(
      <Modal
        title="Test Modal"
        mainAction={{ text: 'Confirm', onClick: handleMainActionClick }}
        onClose={() => {}}
      >
        Modal Body
      </Modal>,
    );
    const mainActionButton = screen.getByText(/Confirm/i);
    fireEvent.click(mainActionButton);
    expect(actionClicked).toBe(true);
  });

  it('should call secondaryAction onClick when secondary action button is clicked', () => {
    let actionClicked = false;
    const handleSecondaryActionClick = () => {
      actionClicked = true;
    };

    render(
      <Modal
        title="Test Modal"
        mainAction={{ text: 'Confirm' }}
        secondaryAction={{ text: 'Cancel', onClick: handleSecondaryActionClick }}
        onClose={() => {}}
      >
        Modal Body
      </Modal>,
    );
    const secondaryActionButton = screen.getByText(/Cancel/i);
    fireEvent.click(secondaryActionButton);
    expect(actionClicked).toBe(true);
  });
});
