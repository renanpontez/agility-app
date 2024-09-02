import React from 'react';

import Button from '@/components/Button';
import Text from '@/components/Text';

type ActionProps = {
  onClick?: () => void;
  text: string;
  href?: string;
};

type ModalProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  showCloseIcon?: boolean;
  mainAction: ActionProps;
  secondaryAction?: ActionProps;
  onClose?: () => void;
  clickOutsideCloseModal?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  children,
  showCloseIcon = true,
  mainAction,
  secondaryAction,
  onClose,
  clickOutsideCloseModal = true,
}) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (clickOutsideCloseModal && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleOverlayClick}
        onKeyDown={(e) => {
          if (e.key === 'Esc' || e.key === ' ') {
            handleOverlayClick(e);
          }
        }}
        role="button"
        tabIndex={0}
      />

      <div className="relative w-full max-w-lg rounded-lg bg-white">
        <div className="p-6">
          {showCloseIcon && onClose && (
            <button
              type="button"
              className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
              aria-label="Close"
              onClick={onClose}
            >
              ✕
            </button>
          )}
          {title && (
            <Text as="h3">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text as="p" className="text-secondaryLighter">
              {subtitle}
            </Text>
          )}
        </div>
        <div className="px-6 py-2">{children}</div>
        <div className="flex justify-end space-x-4 p-6">
          {secondaryAction && (
            <Button
              style="light"
              {...(secondaryAction.href && { href: secondaryAction.href })}
              {...(secondaryAction.onClick && { onClick: secondaryAction.onClick })}
            >
              {secondaryAction.text}
            </Button>
          )}
          <Button
            style="primary"
            onClick={mainAction.onClick}
            href={mainAction.href}
          >
            {mainAction.text}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
