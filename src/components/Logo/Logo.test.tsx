import { render, screen } from '@testing-library/react';

import Logo from './Logo';

describe('Logo Component', () => {
  it('renders correctly with all components (symbol, name, slogan)', () => {
    render(
      <Logo
        style="horizontal"
        symbolColor="primary"
        nameSloganColor="white"
        showName={true}
        showSlogan={true}
      />,
    );
    expect(screen.getByAltText('Logo Symbol')).toBeInTheDocument();
    expect(screen.getByAltText('Agility Creative')).toBeInTheDocument();
    expect(screen.getByAltText('Creative - Digital - Innovation')).toBeInTheDocument();
  });

  it('renders correctly without slogan', () => {
    render(
      <Logo
        style="standard"
        symbolColor="primary"
        nameSloganColor="black"
        showName={true}
        showSlogan={false}
      />,
    );
    expect(screen.getByAltText('Logo Symbol')).toBeInTheDocument();
    expect(screen.getByAltText('Agility Creative')).toBeInTheDocument();
    expect(screen.queryByAltText('Creative - Digital - Innovation')).not.toBeInTheDocument();
  });

  it('renders only the symbol when showName is false', () => {
    render(
      <Logo
        style="horizontal"
        symbolColor="black"
        nameSloganColor="primary"
        showName={false}
      />,
    );
    expect(screen.getByAltText('Logo Symbol')).toBeInTheDocument();
    expect(screen.queryByAltText('Agility Creative')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Creative - Digital - Innovation')).not.toBeInTheDocument();
  });
});
