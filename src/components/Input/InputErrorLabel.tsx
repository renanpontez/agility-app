import React from 'react';

import Text from '@/components/Text';

type InputErrorLabelProps = {
  errorMessage: string;
  isInvalid?: boolean;
};

const InputErrorLabel: React.FC<InputErrorLabelProps> = ({ errorMessage, isInvalid }) => {
  return (
    <div className="min-h-6 w-full">
      {isInvalid && (
        <Text as="em" className="pl-3 text-error">{errorMessage}</Text>
      )}
    </div>
  );
};

export default InputErrorLabel;
