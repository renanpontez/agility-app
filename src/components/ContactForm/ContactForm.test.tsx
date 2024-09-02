import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ContactForm from './ContactForm';

describe('ContactForm', () => {
  it('renders all input fields and the submit button', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/Nome e Sobrenome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sua mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar mensagem/i })).toBeInTheDocument();
  });

  it('validates form inputs and shows error messages', () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    expect(screen.getByLabelText(/Nome e Sobrenome/i)).toHaveClass('is-invalid');
    expect(screen.getByLabelText(/E-mail/i)).toHaveClass('is-invalid');
    expect(screen.getByLabelText(/Sua mensagem/i)).toHaveClass('is-invalid');
  });

  it('submits the form and shows loading state', async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Nome e Sobrenome/i), { target: { value: 'Antonio Araujo' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'contato@araujocolchoes.com.br' } });
    fireEvent.change(screen.getByLabelText(/Sua mensagem/i), { target: { value: 'Preciso de um novo site' } });

    fireEvent.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    expect(screen.getByText(/Você será redirecionado para o WhatsApp em instantes.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/'));
    });
  });
});
