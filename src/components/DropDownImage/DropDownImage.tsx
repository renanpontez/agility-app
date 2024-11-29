'use client';
import classNames from 'classnames';
import Image, { type StaticImageData } from 'next/image';
import React, { useEffect, useState } from 'react';

import ArrowBottom from '@/public/assets/images/icons/arrow-bottom.png';
import ArrowRigth from '@/public/assets/images/icons/arrow-rigth.png';

type DropdownOption = {
  image: string | StaticImageData;
};

type DropdownProps = {
  options: DropdownOption[];
};

const DropDownImage: React.FC<DropdownProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption>();

  useEffect(() => {
    if (options.length > 0 && !selected) {
      setSelected(options[0]);
    }
  }, [options, selected]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    setIsOpen(false);
  };

  const reorderedOptions = selected
    ? [selected, ...options.filter(option => option !== selected)]
    : options;

  return (
    <div className="overflow-y-visible">
      <button
        type="button"
        onClick={toggleDropdown}
        className={classNames(
          { 'border border-secondary': isOpen },
          'flex flex-col gap-1 relative rounded-md text-sm active:border-secondaryLighter p-2 pl-3',
        )}
      >
        <Image
          src={isOpen ? ArrowRigth : ArrowBottom}
          alt="arrow-indicator"
          className={classNames({ 'h-2 w-auto lg:h-3 top-7 left-1': isOpen, 'top-6 -left-2 h-auto w-2 lg:w-3': !isOpen }, 'absolute')}
        />
        {selected?.image && !isOpen
          ? (
              <Image
                src={selected.image}
                alt="selected-image"
                width={50}
                height={50}
                className="size-5 rounded-md lg:size-9 "
              />
            )
          : (
              <ul
                className={classNames(
                  'z-50 mt-1 rounded-md bg-transparent shadow-lg',
                )}
              >
                {reorderedOptions.map((option, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option)}
                      className=" p-1 opacity-80 hover:opacity-100 focus:outline-none"
                    >
                      {option.image && (
                        <Image
                          src={option.image}
                          alt={`option-${index}`}
                          width={50}
                          height={50}
                          className="size-5 rounded-md lg:size-9"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
      </button>
    </div>
  );
};

export default DropDownImage;
