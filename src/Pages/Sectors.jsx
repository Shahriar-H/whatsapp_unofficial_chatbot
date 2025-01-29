import React, { useEffect, useState } from 'react';
import { apilink, useStore } from '../../lib';
import toast from 'react-hot-toast';
import useGetnumbers from '../hooks/useGetnumbers';
import useDeletenumbers from '../hooks/useDeletenumber';
import moment from 'moment';
import useSectors from '../hooks/useGetSectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import useDeleteitem from '../hooks/useDeleteitems';

const Sectors = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setusername] = useState('');
  const {instancedata} = useStore((state)=>state)
  const [isLoading, setisLoading] = useState(true);
  const {data,get_sectors} = useSectors()
  const {delete_number} = useDeletenumbers()
  const [isAdding, setisAdding] = useState(false);
  const {delete_item} = useDeleteitem()


 

  const add_item = ()=>{
    if(isAdding){
      return 0;
    }
    if(!username){
      return toast.error("Name Empty")
    }
    
    setisAdding(true)
    fetch(apilink+"/db/addsector",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name:username})
    })
    .then((res)=>res.json())
    .then((result)=>{
      console.log(result);
      setisAdding(false)
      if(result?.status!==200){
        return toast.error('result?.message');
      }
      get_sectors()
      toast.success(result?.message);
      setInputValue('')
      setusername('')
    })
  }

  const deleteSectors =async (data)=>{
    if(instancedata?.login_info?.role==='Employee'){
      return alert("Only Admin can Delete!")
    }
    await delete_item(data)
    get_sectors()
  }

  useEffect(() => {
    
    setNumbers(data)
    
    
  }, [data]);


  useEffect(() => {
    get_sectors()
  }, []);

  return (
    <div className="container mx-auto  p-4">
      <h1 className="text-2xl font-bold mb-4">Sectors</h1>
      
      <div className="mb-4 bg-white dark:bg-gray-700 rounded-md p-4">
        
        
        <div className="flex items-center">
          <input
            className="w-full lg:w-1/3 p-2 border rounded-md mr-2"
            type="text"
            placeholder="Name of Sectors"
            value={username}
            required
            onChange={(e) => setusername(e.target.value)}
          />
          
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={add_item}
          >
            {isAdding?"Adding...":'Add'}
          </button>
        </div>
      </div>

      <div>
        <div className='flex justify-between items-center '>
          <h2 className="text-xl font-semibold mb-2">Sectors List:</h2>
          
        </div>
        <div>
            <div className='flex bg-gray-200 dark:bg-gray-600'>
                
                <p className='w-28  border border-gray-500 p-1'>#</p>
                <p className='w-1/3 border border-gray-500 p-1'>Name</p>
                
                <p className='w-1/3 border border-gray-500 p-1'>Added at</p>
                <p className='w-1/3 border border-gray-500 p-1'>Delete</p>
            </div>
            {!numbers&&<p className='text-center'>Loading...</p>}
            {numbers?.length<1&&<p className='text-center p-3'>No Data Found</p>}
            {numbers&&numbers.map((number, index) => (
                <div key={index} className='flex items-center'>
                    
                    <p className='w-28  border-gray-500 border p-1'>{index+1}</p>
                    <p className='w-1/3 border-gray-500 border p-1'>{number?.name!=""?number?.name:"Unknown"}</p>
                   
                    <p className='w-1/3 border-gray-500 border p-1'>{moment(number?.created_at).format('lll')}</p>
                    <p onClick={()=>deleteSectors({id:number?._id,table:"sectors"})} className='w-1/3 cursor-pointer border-gray-500 border p-1'>
                      <FontAwesomeIcon icon={faTrash} />
                    </p>
                </div>
            ))}
            
        </div>
        
      </div>
    </div>
  );
};

export default Sectors;
