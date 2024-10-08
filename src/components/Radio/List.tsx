import React from 'react';

import type { RadioOption } from './RadioGroup';

type ListProps = {
  items: RadioOption[];
  renderItem: (item: any) => JSX.Element;
};

const List: React.FC<ListProps> = ({ items, renderItem }) => {
  return (
    <div>
      {items.map((item: any, index: React.Key) => (
        <div key={index}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default List;
