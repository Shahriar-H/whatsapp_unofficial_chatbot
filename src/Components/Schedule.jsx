import React, { useEffect, useState } from 'react'
import PhoneNumberSelector from './Multiplenumber'
import { apilink, apitoken, Phone_Id, useStore } from '../../lib';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Addimage from './Addimage';

export default function Schedule() {
  const [allphonenumbers, setallphonenumbers] = useState([]);
  const [sent_time, setsent_time] = useState('');
  const [message, setmessage] = useState('');
  const [isMultiple, setisMultiple] = useState(false);
  const [sentnow, setsentnow] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const {instancedata} = useStore((state) => state)
  const [selectedImage, setselectedImage] = useState(null);

  const selectImageFun = (img)=>{
    setselectedImage(img)
  }

  const getallphonenumbers = (numbers)=>{
    setallphonenumbers(numbers)
    console.log(numbers);
    
  }

  const createScedule = ()=>{
    if(!sent_time || !message || allphonenumbers.length<1){
      return toast.error('Please check all input.')
    }
    
    
    try {
      setisLoading(true)
      let data = {
        host:Phone_Id,
        numbers:JSON.stringify(allphonenumbers),
        send_time:sent_time,
        is_sent:"Waiting",
        message:message,
        access_token:apitoken,
        instance_id:instancedata?.info?.instance_id,
        media_url:selectedImage?selectedImage:null
      }
      console.log(data);
      
      fetch(apilink+"/db/create-schedule",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      })
      .then((res)=>res.json())
      .then((result)=>{
        setisLoading(false)
        if(result?.status!==200){
          return toast.error(result?.message);
        }
        setsent_time('')
        setallphonenumbers([])
        setmessage('')
        toast.success(result?.message);
      })
    } catch (error) {
      setisLoading(false)
      toast.error("Error");
      // console.log(error);
      
    }
  }

//clear the multiple array
//when its single message
  useEffect(() => {
    if(!isMultiple){
      setallphonenumbers([])
    }
  }, [isMultiple]);

  if(instancedata?.subscriptionexpired===false){
    return <div className="text-center">
      <p>Your Subscription has Expired</p>
    </div>
  }
  return (
    <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
        <div className='flex justify-between items-center'>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-4">Schedule WhatsApp Message</h3>
          <Link to={'/wa/my-schedule'} className='text-xs bg-blue-300 hover:bg-blue-400 text-blue-700 p-1 cursor-pointer rounded border border-red-700'>See Schedule</Link>
        </div>

          {/* Message Form */}
          <div className='flex justify-between'>
            <div className="space-y-4 w-full lg:w-3/5">
              <div>
                <label className="block text-gray-600 dark:text-gray-400">Phone Number:</label>
                <input
                  type="text"
                  disabled={true}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="select the numbers"
                  value={allphonenumbers}
                  
                  onChange={(v)=>setallphonenumbers(v.target.value)}
                />
              </div>
              <div>
                <input placeholder='Select Media' type='text' disabled={true} value={selectedImage} className='p-2 w-full border rounded-md' />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-400">Message:</label>
                <textarea
                  required
                  onChange={(v)=>setmessage(v.target.value)}
                  value={message}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your message here"
                ></textarea>
              </div>

              <div className=''>
                <label className="block text-gray-600 dark:text-gray-400">Message Sceduale (24h Clock):</label>
                <div className='lg:space-x-2'>
                  <input value={sent_time} required onChange={(v)=>setsent_time(v.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 my-1" type='datetime-local'/> 
                  
                </div>
              </div>
              <div>
                <button
                  onClick={createScedule}
                  type="submit"
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  {isLoading?"Creating...":'Create'}
                </button>
              </div>
            </div>
            <div className='w-full p-1 lg:w-[40%] h-72 overflow-y-auto '>
              <Addimage selectImageFun={selectImageFun}/>
            </div>
          </div>
          <br></br>
          <PhoneNumberSelector getallphonenumbers={getallphonenumbers}/>
        </div>
  )
}
