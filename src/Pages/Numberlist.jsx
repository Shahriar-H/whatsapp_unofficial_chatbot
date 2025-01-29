import React, { useEffect, useState } from 'react';
import { apilink, Phone_Id, useStore } from '../../lib';
import toast from 'react-hot-toast';
import useGetnumbers from '../hooks/useGetnumbers';
import useDeletenumbers from '../hooks/useDeletenumber';
import moment from 'moment';

const Numberlist = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setusername] = useState('');
  const {instancedata} = useStore((state)=>state)
  const [isLoading, setisLoading] = useState(true);
  const {data,get_number} = useGetnumbers()
  const {delete_number} = useDeletenumbers()
  const [isAdding, setisAdding] = useState(false);
  const [numbersArr, setnumbersArr] = useState([]);

  const [groups, setgroups] = useState([]);
  const [selectedGroup, setselectedGroup] = useState(null);

  const getallGroup = async ()=>{
      const response = await fetch(apilink+"/db/get-item",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({query:{host:Phone_Id},table:"group"})
      })
      const result = await response.json()
      if(result?.status!==200){
        return toast.error(result?.message);
      }
      setgroups(result?.result)
    
  }

  const deleteGroip = (id,name)=>{
    const groupedData = numbers.filter((item)=>item?.groupname===name)
    if(groupedData.length>0){
      return toast.error("Please Delete All Number First!")
    }
    if(window.confirm("Are you sure to delete this group?")){
      fetch(apilink+"/db/delete-item",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({id,table:"group"})
      })
      .then((res)=>res.json())
      .then((result)=>{
        if(result?.status!==200){
          return toast.error(result?.message);
        }
        toast.success(result?.message);
        getallGroup()
      })
    }
  }

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

  const add_number = ()=>{
    if(isAdding){
      return 0;
    }
    if(!inputValue){
      return toast.error("Number is Empty!")
    }
    if(inputValue.includes('+')){
      return toast.error("Only Numbers are allowed!")
    }
    if(inputValue.length!==13){
      return toast.error("Country Code not Found")
    }
    setisAdding(true)
    fetch(apilink+"/db/add-phone",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name:username,phone:inputValue,host:Phone_Id})
    })
    .then((res)=>res.json())
    .then((result)=>{
      console.log(result);
      setisAdding(false)
      if(result?.status!==200){
        return toast.error('result?.message');
      }
      get_number()
      toast.success(result?.message);
      setInputValue('')
      setusername('')
    })
  }


  useEffect(() => {
    if(data){
      setNumbers(data)
      data?.map(({phone})=>{
        setnumbersArr([...numbersArr,phone]) 
      })
    }
    
  }, [data]);

//   const handleImportNumbers = (event) => {
//     const importedNumbers = event.target.value.split(/\r?\n/);
//     setNumbers([...numbers, ...importedNumbers.filter(num => num.trim() !== '')]);
//   };

  const isSelected = (number) => selectedNumbers.includes(number);

const selectallnumber = () => {
    let idarr = [];
    let numarr = [];
    numbers.map(({id,phone,groupname})=>{
        if(groupname===selectedGroup){
          idarr.push(id)
          numarr.push(phone)
        }
    })
   
    setSelectedNumbers(numarr);
   
};

  const deleteddNumbers =async ()=>{
    if(!window.confirm(`Are you sure to Delete ${selectedNumbers?.length} data?`)){
      return 0;
    }
    const placeholders = selectedNumbers.map((num) => num).join(',');
    console.log(selectedNumbers,placeholders);
    await delete_number(selectedNumbers)
    get_number()
    setSelectedNumbers([])
    
  }

  useEffect(() => {
 
    getallGroup()
  }, []);
  useEffect(() => {
    get_number({group:selectedGroup})
  }, [selectedGroup]);

  return (
    <div className="container mx-auto  p-4">
      <h1 className="text-2xl font-bold mb-4" onClick={get_number}>WhatsApp Numbers</h1>
      <p className='text-red-500'>Must enter number with country code <b>(88 for BD)</b> do not enter <b>+ sign</b></p>
      <div className="mb-4 bg-white dark:bg-gray-700 rounded-md p-4">
        {/* <textarea
          className="w-full p-2 border rounded-md mb-2"
          rows="4"
          placeholder="Import multiple numbers (one per line)"
          onChange={handleImportNumbers}
        ></textarea> */}
        
        <div className="flex items-center">
          <input
            className="w-full lg:w-1/3 p-2 border rounded-md mr-2"
            type="text"
            placeholder="Name of user (Optional)"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
          <input
            className="w-full lg:w-1/3 p-2 border rounded-md mr-2"
            type="text"
            placeholder="Enter a WhatsApp number(Required)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={add_number}
          >
            {isAdding?"Adding...":'Add'}
          </button>
        </div>
      </div>

      <div>
        <div className='flex justify-between items-center '>
          <h2 className="text-xl font-semibold mb-2">Number List:</h2>
          {selectedNumbers&&selectedNumbers.length>0&&<p onClick={deleteddNumbers} className="bg-red-500 cursor-pointer text-white px-2 py-1 text-xs rounded-md">Delete Selected</p>}
        </div>
        <div className='flex my-2'>
        {groups.length>0&&groups.map((item)=>{
          return <p onClick={()=>setselectedGroup(item?.name)} key={item?.id} className={`p-1 mx-1 w-fit border relative rounded-md cursor-pointer ${item?.name===selectedGroup&&'bg-green-500'}`}>{item?.name}
          <span onClick={()=>deleteGroip(item?._id,item?.name)} className='absolute cursor-pointer text-xl text-gray-500 -top-4 right-1 font-bold opacity-0 hover:opacity-100 z-40 hover:text-red-500'>&times;</span>
          </p>
        })}
      </div>
        <div>
            <div className='flex bg-gray-200 dark:bg-gray-600'>
                <p onClick={()=>{
                  if(selectedNumbers?.length>0){
                    setSelectedNumbers([])
                  }else{
                    selectallnumber()
                  }
                }} className='w-16 cursor-pointer border border-gray-500 text-xl p-1'>{selectedNumbers?.length>0?'❌':'✅'}</p>
                <p className='w-28  border border-gray-500 p-1'>#</p>
                <p className='w-1/3 border border-gray-500 p-1'>Name</p>
                <p className='w-1/3 border border-gray-500 p-1'>Number</p>
                <p className='w-1/3 border border-gray-500 p-1'>Added at</p>
            </div>
            {!numbers&&<p className='text-center'>Loading...</p>}
            {numbers?.length<1&&<p className='text-center p-3'>No Data Found</p>}
            {selectedGroup&&numbers&&numbers.map((number, index) =>{ 
                return selectedGroup===number?.groupname&&<div key={index} className='flex items-center'>
                    
                    <p className='w-16  border-gray-500 border p-1'>
                      <input
                          type="checkbox"
                          id={`checkbox-${number?.id}`}
                          className="form-checkbox h-5 w-5 border text-green-600"
                          checked={isSelected(number?.phone)}
                          onChange={() => handleCheckboxChange(number?.phone)}
                      />
                    </p>
                    <p className='w-28  border-gray-500 border p-1'>{index+1}</p>
                    <p className='w-1/3 border-gray-500 border p-1'>{number?.name?number?.name:"Unknown"}</p>
                    <p className='w-1/3 border-gray-500 border p-1'>{number?.phone}</p>
                    <p className='w-1/3 border-gray-500 border p-1'>{moment(number?.created_at).format('lll')}</p>
                </div>
            })}
            
        </div>
        
      </div>
    </div>
  );
};

export default Numberlist;
