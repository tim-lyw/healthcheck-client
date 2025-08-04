import React from 'react';

interface StatusPillProps {
  value: boolean;
  positiveText?: string;
  negativeText?: string;
}

const StatusPill: React.FC<StatusPillProps> = ({
  value,
  positiveText = 'No',
  negativeText = 'Yes',
}) => {
  const text = value ? positiveText : negativeText;
  const colorClass = value 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-red-100 text-red-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {text}
    </span>
  );
};

export default StatusPill;