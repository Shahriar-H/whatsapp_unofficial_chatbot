import React, { useEffect } from 'react';
import useGethistory from '../hooks/useGethistory';
import moment from 'moment';

const MessageHistoryTable = () => {
  const history=[];
  const {data,get_history} = useGethistory()

  useEffect(() => {
    get_history()
  }, []);
  
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Message History</h2>
            <div className="overflow-x-auto h-screen">
            {!data&&<p className='text-center'>Loading...{data?.length}</p>}
                <table className="min-w-full bg-white dark:bg-black border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">To</th>
                            <th className="py-3 px-6 text-left">Sent At</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Message</th>
                            <th className="py-3 px-6 text-left">Error</th>
                        </tr>
                    </thead>
                    
                    <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
                        
                        {data&&data.map((item, index) => (
                            <tr key={index} className="border-b border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{item?.number}</td>
                                <td className="py-3 px-6 text-left">{moment(item?.created_at).format('ll')}</td>
                                <td className="py-3 px-6 text-left">{item?.status==='1'?<span className='text-green-400'>Success</span>:<span className='text-red-400'>Error</span>}</td>
                                <td className="py-3 px-6 text-left">
                                  <abbr title={item?.message}> { item?.message?.substr(0,80) }</abbr></td>
                                
                                <td className="py-3 px-6 text-left">{item?.status==='1'?<span className='text-green-400'>No Error</span>:<span className='text-red-400'>Network Unavailable</span>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MessageHistoryTable;
