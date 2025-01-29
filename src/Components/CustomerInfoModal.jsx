import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useState } from 'react'

export default function CustomerInfoModal({data,CloseModal}) {
  const [objsctskey, setobjsctskey] = useState(Object.keys(data));
  return (
    <div className='fixed top-0 left-0 bg-black bg-opacity-45 overflow-auto h-screen z-40 flex items-center justify-center w-full'>
        <div className='w-full lg:w-1/2 overflow-auto h-[500px] my-10 p-6 bg-white dark:bg-gray-800 rounded-md'>
            <div className='flex justify-between items-center border-b py-2'>
                <h3>Preview Details</h3>
                <p className='cursor-pointer' onClick={()=>CloseModal()}><FontAwesomeIcon icon={faTimes} /></p>
            </div>
            <br></br>
            <table className=" bg-white dark:bg-gray-800 w-full text-left">
            <thead>
                {objsctskey&&objsctskey.map((item,index)=>{
                    if(item==='assigned_to'){
                        return <tr>
                        <th className="py-2 px-4 border-b text-sm">{item.toUpperCase()}</th>
                            <th className="py-2 px-4 border-b text-sm">
                                {JSON.parse(data[item])?.name}
                            </th>
                        </tr>
                    }
                    return <tr>
                        <th className="py-2 px-4 border-b text-sm">{item.toUpperCase()}</th>
                        <th className="py-2 px-4 border-b text-sm">
                            {item==='created_at'?moment(data[item]).format('lll'):data[item]}
                        </th>
                    </tr>
                })}
            </thead>
            
            </table>
        </div>
    </div>
  )
}
