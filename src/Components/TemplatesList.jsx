import React, { useEffect, useState } from 'react';
import { useStore, WA_token } from '../../lib';

const TemplatesList = ({updateTemplate}) => {
    const [templates, settemplates] = useState([]);
    const [selectedTemt, setselectedTemt] = useState({});
    const { instancedata, updatedata, removeData } = useStore((state) => state);
    const getTemplates = ()=>{
        fetch(`https://graph.facebook.com/v21.0/${instancedata?.login_info?.wab_id}/message_templates?access_token=${WA_token}`)//567668663087213 business Account ID
        .then((res)=>res.json())
        .then((result)=>{
            console.log(result)
            settemplates(result?.data)
        })
    }
    useEffect(() => {
        getTemplates()
    }, []);
    return (
        <div>
            <div className='flex space-x-4 border'>
                <p className='p-1 w-1/3 text-xs'>Name</p>
                <p className='p-1 w-1/4 text-xs'>Format</p>
                <p className='p-1 w-1/4 text-xs'>Status</p>
                <p className='p-1 w-1/4 text-xs'>Language</p>
            </div>
            {templates&&templates.map((item,index)=>{
                return (item?.components[0]?.format==='IMAGE'||item?.components[0]?.format==='VIDEO')&&<div onClick={()=>{updateTemplate(item); setselectedTemt(item?.name)}} key={index} className={`flex space-x-4 border hover:bg-green-500 cursor-pointer ${item?.name===selectedTemt&&'bg-green-500'}`}>
                <p className='p-1 w-1/3 text-xs'>{item?.name}</p>
                <p className='p-1 w-1/4 text-xs'>{item?.components[0]?.format}</p>
                <p className='p-1 w-1/4 text-xs'>{item?.status}</p>
                <p className='p-1 w-1/4 text-xs'>{item?.language}</p>
            </div>
            })}
        </div>
    );
}

export default TemplatesList;
