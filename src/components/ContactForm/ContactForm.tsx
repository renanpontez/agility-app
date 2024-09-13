'use client';

import {
  Button,
  Input,
  Text,
  TextArea,
} from 'agility-wind';
import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

import { BrandLoading } from '@/components/Loading';
import { SOCIAL_NETWORKS } from '@/utils/Constants';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {
      name: false,
      email: false,
      message: false,
    };

    if (!formData.name.trim()) {
      newErrors.name = true;
    }

    const emailPattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      newErrors.email = true;
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = true;
    }

    if (!formData.message.trim()) {
      newErrors.message = true;
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const whatsappMessage = `Olá Agility, me chamo ${formData.name} (${formData.email}). Escrevi a seguinte mensagem:\n${formData.message}`;
      const whatsappUrl = `https://wa.me/+5585996284730?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(whatsappUrl);
      setIsLoading(false);
    }, 3500);
  };

  const handleFormChange = (fieldName: keyof typeof formData, value: string) => {
    setErrors({
      ...errors,
      [fieldName]: '',
    });

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  return (
    <section className="container flex w-full flex-col justify-between gap-16 py-8 md:flex-row md:py-16">
      <div className="flex flex-col gap-10">
        <Text as="h2" styleOverride="h1">
          ENTRE EM CONTATO
          <br />
          COM A
          {' '}
          <span className="text-primary">AGILITY</span>
        </Text>
        <div className="flex flex-col gap-3">
          {SOCIAL_NETWORKS.map(item => (
            <div key={item.title} className="flex items-center gap-2">
              <item.icon className="text-sm text-primaryLighter " />
              <a href={item.href} className="text-sm" target="_blank" rel="noopener noreferrer">
                <Text as="p" size="sm" className="hover:text-primaryLighter">{item.title}</Text>
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className="md:p-5">
        <form
          className="relative flex w-full flex-col items-stretch justify-center gap-2 md:min-w-96"
          onSubmit={e => e.preventDefault()}
        >
          {isLoading && (
            <BrandLoading size="full" label="Você será redirecionado para o WhatsApp em instantes..." />
          )}
          <div>
            <Input
              type="text"
              placeholder="Antonio Araujo"
              label="Nome e Sobrenome"
              value={formData.name}
              onChange={e => handleFormChange('name', e.target.value)}
              required
              isInvalid={!!errors.name}
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="contato@araujocolchoes.com.br"
              label="E-mail"
              value={formData.email}
              onChange={e => handleFormChange('email', e.target.value)}
              required
              isInvalid={!!errors.email}
            />
          </div>
          <div>
            <TextArea
              placeholder="Conta pra gente como podemos ajudar seu projeto"
              label="Sua mensagem"
              value={formData.message}
              onChange={e => handleFormChange('message', e.target.value)}
              required
              isInvalid={!!errors.message}
            />
          </div>
          <div>
            <Button style="outlined" size="lg" fullWidth onClick={handleSubmit}>
              <span>Enviar mensagem</span>
              <span className="ml-2">
                <FaWhatsapp size={14} />
              </span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
