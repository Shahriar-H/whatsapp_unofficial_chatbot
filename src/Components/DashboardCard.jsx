// src/components/DashboardCard.js
import React from 'react';

const DashboardCard = ({ title, value, extraInfo, highlight, isPrimary }) => {
    return (
        <div className="p-4 bg-white dark:bg-gray-900 shadow-md rounded-lg flex flex-col">
            <span className={`text-sm ${isPrimary ? 'text-green-600' : 'text-gray-300'}`}>
                {title}
            </span>
            <div className="flex items-center flex-wrap justify-between mt-2">
                <span className={`text-2xl font-bold ${highlight ? 'text-green-600' : 'text-gray-300'}`}>
                    {value}
                </span>
                {extraInfo && (
                    <span className="text-sm text-gray-500">
                        {extraInfo}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;
