import React, { useEffect, useState } from 'react';
import { apilink, useStore } from '../../lib';
import toast from 'react-hot-toast';
import useGetnumbers from '../hooks/useGetnumbers';
import useDeletenumbers from '../hooks/useDeletenumber';
import useGetschedule from '../hooks/useGetschedule';
import useDeleteSchedule from '../hooks/useDeleteSchedule';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Schedulelist = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setusername] = useState('');
  const {instancedata} = useStore((state)=>state)
  const [isLoading, setisLoading] = useState(true);
  const {data,get_schedule} = useGetschedule()
  const {delete_schedule} = useDeleteSchedule()

  const handleCheckboxChange = (number) => {
    setSelectedNumbers((prevSelected) =>
        prevSelected.includes(number)
            ? prevSelected.filter((itemNum) => itemNum !== number)
            : [...prevSelected, number]
    );
    
  };

  const handleAddNumber = () => {
    // console.log(instancedata?.info?.wid?.user);
    
    if (inputValue.trim() !== '') {
      setNumbers([...numbers, inputValue]);
      setInputValue('');
    }
  };

  


  useEffect(() => {
    
    setNumbers(data)
    
    
  }, [data]);

//   const handleImportNumbers = (event) => {
//     const importedNumbers = event.target.value.split(/\r?\n/);
//     setNumbers([...numbers, ...importedNumbers.filter(num => num.trim() !== '')]);
//   };





  const deleteddNumbers =async (id)=>{
    if(!window.confirm(`Are you sure to Delete`)){
      return 0;
    }
    
    await delete_schedule(id)
    get_schedule()

    
  }

  useEffect(() => {
    get_schedule()
  }, []);

  return (
    <div className="container mx-auto  p-4">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold mb-4">WhatsApp Schedule</h1>
        <Link to={'/wa/set-schedule'} className='text-xs bg-blue-300 hover:bg-blue-400 text-blue-700 p-1 cursor-pointer rounded border border-red-700'>Add Schedule</Link>
      </div>

      <div>
        
        <div>
            <div className='flex bg-gray-200 dark:bg-gray-600'>
                <p className='w-28  p-1'>#</p>
                <p className='w-1/3 p-1 '>Host</p>
                <p className='w-1/3 p-1 '>Message</p>
                <p className='w-1/3 p-1 '>Send Time</p>
                <p className='w-1/3 p-1 '>Cretated at</p>
                <p className='w-1/3 p-1 '>Is Sent</p>
                <p className='w-12 p-1'><FontAwesomeIcon icon={faDeleteLeft} /></p>
            </div>
            {!numbers&&<p className='text-center'>Loading...</p>}
            {numbers?.length<1&&<p className='text-center p-3'>No Data Found</p>}
            {numbers&&numbers.map((number, index) => (
                <div key={index} className='flex my-1 flex-wrap cursor-pointer items-center rounded-md p-1 py-3 border bg-gray-200 hover:bg-gray-400 dark:bg-gray-600'>  
                    <div className='flex w-full'>
                      <p className='w-12   p-1'>{index+1}</p>
                      <p className='w-1/3  p-1'>{number?.host}</p>
                      <p className='w-1/3  p-1'>
                        <abbr title={number?.message}>{number?.message?.substr(0,40)}</abbr>
                      </p>
                    
                      <p className='w-1/3  p-1'>{moment(number?.send_time).format('lll')}</p>
                      <p className='w-1/3  p-1'>{moment(number?.created_at).format('lll')}</p>
                      <p className='w-1/3  p-1'>{number?.is_sent}</p>
                      <p onClick={()=>deleteddNumbers(number?._id)} className='w-12  p-1'><FontAwesomeIcon icon={faDeleteLeft} /></p>
                    </div>
                    
                    <div className='w-full flex flex-wrap max-h-80 overflow-scroll bg-gray-200  dark:bg-gray-500 p-2'>
                      {
                        number?.numbers&&JSON.parse(number?.numbers)&&JSON.parse(number?.numbers).map((item,index)=>{
                          return <p className='p-1 text-sm bg-gray-400 w-fit rounded-md border'>{item}</p>
                        })
                      }
                    </div>
                </div>
            ))}
            
        </div>
        
      </div>
    </div>
  );
};

export default Schedulelist;
