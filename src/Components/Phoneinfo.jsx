// src/components/PhoneInfoCard.js
import React from 'react';

const PhoneInfoCard = ({ name, phoneNumber }) => {
    return (
        <div className="p-4 bg-white dark:bg-gray-900 shadow-md rounded-lg flex items-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-500 rounded-full flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500 dark:text-gray-700 "
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422M6.16 9.422L12 12m0 0v6.5M6 18.5a9 9 0 0112 0M6 18.5H18"
                    />
                </svg>
            </div>
            <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{phoneNumber}</p>
            </div>
        </div>
    );
};

export default PhoneInfoCard;
