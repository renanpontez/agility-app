'use client';
import Image, { type StaticImageData } from 'next/image';
import React, { useEffect, useState } from 'react';

import ArrowBottom from '@/public/assets/images/icons/arrow-bottom.png';
import ArrowRigth from '@/public/assets/images/icons/arrow-rigth.png';

type DropdownOption = {
  label?: string;
  image?: string | StaticImageData;
};

type DropdownProps = {
  options: DropdownOption[];
  isImageDropdown: boolean; // Define se o dropdown é de imagens
};

const Dropdown: React.FC<DropdownProps> = ({ options, isImageDropdown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>();
  const [reorderedOptions, setReorderedOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    // Define o primeiro item como selecionado por padrão
    if (options.length > 0) {
      setSelected(options[0]);
      setReorderedOptions(options);
    }
  }, [options]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    setIsOpen(false);

    // Reorganiza as opções com o item selecionado no topo
    setReorderedOptions([option, ...options.filter(opt => opt !== option)]);
  };

  return (
    <div className="relative inline-block">
      {/* Botão para abrir/fechar dropdown */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:border-secondaryLighter lg:px-4 lg:py-3"
      >
        {/* Ícone ArrowBottom */}
        <Image
          src={ArrowBottom}
          alt="arrow-bottom"
          className="h-auto w-2 lg:w-3"
        />
        {/* Imagem ou texto selecionado */}
        {isImageDropdown && selected?.image && (
          <Image
            src={selected.image}
            alt="selected-image"
            width={50}
            height={50}
            className="h-4 w-6 lg:h-9 lg:w-14"
          />
        )}
        {!isImageDropdown && <span>{selected?.label || 'Selecione uma opção'}</span>}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          className="absolute z-10 mt-2 flex max-h-40 w-full flex-col items-end justify-end overflow-y-auto rounded-md border border-secondary bg-transparent shadow-lg lg:min-w-max"
        >
          {reorderedOptions.map((option, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect(option);
                  }
                }}
                className="flex w-full items-center gap-3 py-2 pr-3 text-left text-sm focus:outline-none lg:py-3 lg:pr-4"
              >
                {/* Ícone ArrowRigth para a primeira opção */}
                {isOpen && index === 0 && (
                  <Image
                    src={ArrowRigth}
                    alt="arrow-rigth"
                    width={50}
                    height={50}
                    className="h-2 w-auto lg:h-3"
                  />
                )}

                {/* Imagem ou texto das opções */}
                {isImageDropdown && option.image && (
                  <Image
                    src={option.image}
                    alt={`option-${index}`}
                    className="h-4 w-6 lg:h-9 lg:w-14"
                  />
                )}
                {!isImageDropdown && option.label && <span>{option.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
