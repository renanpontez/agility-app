/* eslint-disable no-alert */
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import Button from '@/components/Button';
import Text from '@/components/Text';

import Modal from './Modal';

// Meta configuration
const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    actions: {
      handles: ['onClick', 'onClose'],
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    showCloseIcon: { control: 'boolean' },
    clickOutsideCloseModal: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <Modal
          {...args}
          onClose={args.onClose || handleClose} // Ensure onClose can be overridden
          mainAction={{
            text: args.mainAction?.text || 'Confirm', // Use args to allow overrides
            onClick: args.mainAction?.onClick || handleClose,
            href: args.mainAction?.href,
          }}
          secondaryAction={{
            text: args.secondaryAction?.text || 'Cancel', // Use args to allow overrides
            onClick: args.secondaryAction?.onClick || handleClose,
            href: args.secondaryAction?.href,
          }}
        >
          {args.children || <Text as="p">This is the modal body content.</Text>}
        </Modal>
      )}
      {!isOpen && (
        <Button style="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
      )}
    </>
  );
};

// Stories

export const Default: Story = Template.bind({});
Default.args = {
  title: 'Default Modal',
  subtitle: 'This is a default modal',
  showCloseIcon: true,
  clickOutsideCloseModal: true,
};

export const NoCloseIcon: Story = Template.bind({});
NoCloseIcon.args = {
  title: 'No Close Icon Modal',
  subtitle: 'This modal does not have a close icon',
  showCloseIcon: false,
  clickOutsideCloseModal: true,
};

export const ClickOutsideDisabled: Story = Template.bind({});
ClickOutsideDisabled.args = {
  title: 'Click Outside Disabled Modal',
  subtitle: 'This modal does not close when clicking outside',
  showCloseIcon: true,
  clickOutsideCloseModal: false,
};

export const WithActions: Story = Template.bind({});
WithActions.args = {
  title: 'Modal with Actions',
  subtitle: 'This modal has both primary and secondary actions',
  showCloseIcon: true,
  clickOutsideCloseModal: true,
  mainAction: {
    text: 'Save Changes',
    onClick: () => alert('Save clicked'),
  },
  secondaryAction: {
    text: 'Cancel',
    onClick: () => alert('Cancel clicked'),
  },
};
