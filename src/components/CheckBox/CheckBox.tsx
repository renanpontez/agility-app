import classNames from 'classnames';

export type CheckBoxProps = {
  style: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  label: string;
  subLabel?: string;
  className: string;
  checked: boolean;
  onClick: (e: any) => void;
  value?: string | number;
  icon?: string;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  style,
  size,
  label,
  className,
  checked,
  subLabel,
  onClick,
  value,
  icon,
}) => {
  const baseClasses = classNames(
    'grid col-2 row-2 items-center cursor-pointer text-md gap-x-2 gap-y-0',
    className,
    {
      'text-sm': size === 'sm',
    },
    !subLabel && 'items-center',
  );
  const iconSize = classNames(
    {
      8: size === 'sm',
      10: size === 'md',
      14: size === 'lg',
    },
  );
  const inputClasses = classNames(
    'flex items-center justify-center rounded border-2 border-gray-400',
    {
      'peer-checked:bg-primary peer-checked:border-primary': style === 'primary',
      'peer-checked:bg-secondary peer-checked:border-secondary': style === 'secondary',
    },
    {
      'w-3.5 h-3.5': size === 'sm',
      'w-5 h-5': size === 'md',
      'w-7 h-7': size === 'lg',
    },
    !checked && 'bg-lighDark',
  );

  return (
    <button className={baseClasses} type="button" onClick={onClick}>
      <input
        type="checkbox"
        className="peer hidden"
        value={value}
        checked={checked}
        onChange={onClick}
      />
      <span className={inputClasses}>
        {icon
          ? (<img src={icon} sizes={iconSize} alt="icon"></img>)
          : (
              <svg width={iconSize} height={iconSize} viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clipRule="evenodd" d="M7.37181 0.152764C7.45389 0.250608 7.5 0.383295 7.5 0.521647C7.5 0.659999 7.45389 0.792686 7.37181 0.89053L3.21231 5.84724C3.1302 5.94505 3.01885 6 2.90275 6C2.78665 6 2.6753 5.94505 2.5932 5.84724L0.622908 3.49932C0.543151 3.40092 0.499019 3.26912 0.500017 3.13232C0.501014 2.99551 0.547062 2.86465 0.628241 2.76791C0.709421 2.67117 0.819237 2.6163 0.934038 2.61511C1.04884 2.61392 1.15944 2.66651 1.24202 2.76156L2.90275 4.74059L6.7527 0.152764C6.8348 0.0549493 6.94615 0 7.06225 0C7.17835 0 7.2897 0.0549493 7.37181 0.152764Z" fill="#F8FAFC" />
              </svg>
            )}

      </span>
      <label className="col-start-2 text-start font-semibold" htmlFor="checkbox">{label}</label>
      {subLabel && <label className="col-start-2 row-start-2 text-darkLight">{subLabel}</label>}
    </button>
  );
};

export default CheckBox;
