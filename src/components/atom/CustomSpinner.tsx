import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string; // Add className prop
}

const CustomSpinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-10 w-10',
    };

    return (
        <div className={`spinner ${sizeClasses[size]} border-4 border-t-transparent border-gray-400 rounded-full animate-spin ${className}`}></div>
    );
};

export default CustomSpinner;