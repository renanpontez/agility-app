import type { Meta, StoryObj } from '@storybook/react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import LandingTemplate from './LandingTemplate';

const meta: Meta<typeof LandingTemplate> = {
  title: 'Templates/LandingTemplate',
  component: LandingTemplate,
  tags: ['autodocs'],
  args: {
    children: (
      <div>
        <h1 className="mt-10 text-center text-4xl text-white">Welcome to Agility Creative</h1>
        <p className="mt-4 text-center text-white">
          This is a sample content for the landing page.
        </p>
      </div>
    ),
  },
  decorators: [Story => <div style={{ height: '100vh', backgroundColor: '#1A202C' }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof LandingTemplate>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Header style="transparent" />
        <div className="p-8 text-center">
          <h1 className="mb-4 text-4xl text-white">Welcome to Agility Creative</h1>
          <p className="text-white">
            We provide innovative digital solutions to inspire your brand.
          </p>
        </div>
        <Footer />
      </>
    ),
  },
};
