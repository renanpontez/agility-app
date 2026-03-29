import classNames from 'classnames';

export type RadioItemProps = {
  style: 'primary' | 'secondary';
  id: string;
  value: string;
  isChecked?: boolean;
  onClick: () => void;
};

const RadioItem: React.FC<RadioItemProps> = ({
  id,
  value,
  style,
  isChecked,
  onClick,
}) => {
  const inputClass = classNames('appearance-none w-3 h-3 rounded-full ring-1 ring-lightDark ring-offset-2', {
    'checked:bg-primary checked:ring-primary': style === 'primary',
    'checked:bg-secondary': style === 'secondary',
  });

  return (
    <input type="radio" id={id} value={value} className={inputClass} checked={isChecked} onChange={onClick} />
  );
};

export default RadioItem;
