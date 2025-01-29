import React, { useEffect, useState } from 'react';
import useGetnumbers from '../hooks/useGetnumbers';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { apilink, Phone_Id, useStore } from '../../lib';
import moment from 'moment';

const Importxldata = () => {
  const [jsonData, setJsonData] = useState(null);
  const [dataArr, setdataArr] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const {data,get_number} = useGetnumbers()
  const [isModalOpen, setisModalOpen] = useState(false);
  const {instancedata} = useStore((state)=>state)
  const [imporing, setimporing] = useState(false);
  const [groupname, setgroupname] = useState('');
  const [groups, setgroups] = useState([]);
  const [selectedGroup, setselectedGroup] = useState(null);
  const [importtype, setimporttype] = useState('text');
  const [textimport, settextimport] = useState('');
  const [fetcingnumber, setfetcingnumber] = useState(false);
  const [grouploading, setgrouploading] = useState(false);

  useEffect(() => {
    get_number({groupname:selectedGroup})
    setfetcingnumber(true)
    setTimeout(() => {
      setfetcingnumber(false)
    }, 3000);
  }, [selectedGroup]);

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

  const createGroup = async ()=>{
    const response = await fetch(apilink+"/db/add-item",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({query:{},table:"group",data:{name:groupname,host:Phone_Id}})
    })
    const result = await response.json()
    if(result?.status!==200){
      return toast.error(result?.message);
    }
    toast.success(result?.message);
  }
  const getallGroup = async ()=>{
    setgrouploading(true)
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
    setgrouploading(false)
  
  }

  const handleFileUpload = (event) => {
    if(!groupname){
      return alert("Please Enter Group Name First!")
    }
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet is what you want to convert
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setJsonData(json);
        const host = instancedata?.info?.number;
        let values = json.map((item) => {
          
          return {name:item.name,groupname:groupname, phone:String(item.phone).replace(/\s+/g, ''), host:Phone_Id,created_at:new Date().getTime()}
        });
       
        setdataArr(values)
        setisModalOpen(true)
      };

      reader.readAsArrayBuffer(file);
    }
  };


  const add_numbers = async (multipledata)=>{
    setimporing(true)
    const response = await fetch(apilink+"/db/add-multiple-phone",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(multipledata)
    })
    const result = await response.json()
    console.log(result);
    setimporing(false)
    if(result?.status!==200){
      return toast.error(result?.message);
    }
    toast.success(result?.message);
    setJsonData(null);
    setdataArr(null)
    // get_number()
    getallGroup()

    // .then((res)=>res.json())
    // .then((result)=>{
    //   console.log(result);
    //   setimporing(false)
    //   if(result?.status!==200){
    //     return toast.error(result?.message);
    //   }
    //   toast.success(result?.message);
    //   setJsonData(null);
    //   setdataArr(null)
    //   get_number()
    // })
  }



  const handleAddNumber = () => {
    
    if (inputValue.trim() !== '') {
      setNumbers([...numbers, inputValue]);
      setInputValue('');
    }
  };

  useEffect(() => {
    
    setNumbers(data)
    getallGroup()
    console.log(data);
    
  }, [data,selectedGroup]);

  const handleImportNumbers = (event) => {
    settextimport(event.target.value)
    const importedNumbers = event.target.value.split(/\r?\n/);
    let numarr = []
    //filter only unique numbers
    const filterdata = importedNumbers.filter((item,index)=>importedNumbers.indexOf(item)===index);
  
    filterdata.map((item)=>{   
      if(item.trim()!==''&&item[0]==='8'&&item[0]==='8'&&item.length===13){
        numarr.push({name:"Unknown",phone:item,groupname:groupname,host:Phone_Id,created_at:new Date().getTime()})
      }
    })
    setJsonData(numarr)
    console.log(numarr);
    setdataArr(numarr)
    settextimport('')
    setNumbers([...numbers, ...importedNumbers.filter(num => num.trim() !== '')]);
  };

const importtoDb = async ()=>{
  console.log(groupname);
  
  if(!groupname){
    return alert("Please Enter Group Name!")
  }
  

  if(!jsonData){
    return alert("Please Select an Excel Sheet!")
  }
  await createGroup()
  
  if(dataArr.length<250){
    await add_numbers(dataArr)
    return 0;
  }
  for (let index = 1; index <= Math.ceil(dataArr.length/250); index++) {
    if(dataArr[index*250]){
      console.log("Chank:", index);
      
      const datafilter = dataArr.slice((index-1)*250,index*250)
      await add_numbers(datafilter)
    }else{
      const datafilter = dataArr.slice((index-1)*250,dataArr.length)
      await add_numbers(datafilter)
    }

  }
  
  settextimport('')
  // if(window.confirm("Are sure to import?")){
  //   add_numbers(dataArr)
  // }
  
}
if(instancedata?.subscriptionexpired){
  return <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-4">
    Subscription Expired
  </h3>
  <p className="text-red-500">Please renew your subscription. 
    </p>      
</div>
}
return (
  <div className="container mx-auto p-4">
    <div className='flex justify-center space-x-2 mb-5'>
      <button onClick={()=>setimporttype('excle')} className={` ${importtype==='excle'?" bg-green-500":"dark:bg-slate-800 bg-slate-400"}  dark:text-white text-gray-800`}>Import Excle Sheet</button>
      <button onClick={()=>setimporttype('text')} className={` ${importtype==='text'?" bg-green-500":"dark:bg-slate-800 bg-slate-400"}  dark:text-white text-gray-800`}>Import Text Data</button>
    </div>
    

    {isModalOpen&&jsonData.length>0&&
    <div className='fixed z-50 top-0 left-0 w-full h-screen bg-black bg-opacity-60 flex justify-center items-center'>
      <div  className='bg-white cursor-pointer dark:bg-black p-4 w-1/2 rounded h-3/4 overflow-auto'>
        <p onClick={()=>{setisModalOpen(!isModalOpen)}} className='p-1 mb-1 bg-red-400 w-fit text-white rounded-sm text-sm'>Close</p>
        <table className='w-full p-3 border'>
          <thead>
            <tr className='border'>
              <th className='border p-1'>Name</th>
              <th className='border p-1'>Phone No.</th>
              <th className='border p-1'>Group</th>
              <th className='border p-1'>Status</th>
            </tr>
          </thead>
          <tbody>

              {dataArr&&dataArr.map((item,index)=>{
                return <tr key={index} className='border'>
                <td className='border p-1'>{item?.name}</td>
                <td className='border p-1'>{item?.phone}</td>
                <td className='border p-1'>{groupname}</td>
                <td className='border p-1'>{
                  <span className='text-green-500'>Valid</span>}</td>
              </tr>
              })}
          </tbody>
        </table>
      </div>
    </div>}

    {importtype==='text'&&<div className="mb-4">
      <h1 className="text-2xl font-bold mb-4">WhatsApp Numbers-</h1>
      <p className='text-red-500'>*Don't Add more than 500 number in a single group</p>
      <input disabled={imporing} onChange={(v)=>setgroupname(v.target.value)} value={groupname} className='p-2 border rounded mb-2 w-full' placeholder='Group Name' />
      <textarea
        
        className="w-full p-2 border rounded-md "
        rows="6"
        placeholder="Import multiple numbers (one per line)"
        onChange={handleImportNumbers}
      >{textimport}</textarea>
      <p className='text-red-500 text-xs mb-2'>*Must enter number with country code <b>(88 for BD)</b> do not enter <b>+ sign</b></p>
      <div className="flex space-x-2">
        <button onClick={()=>importtoDb()} 
        className={`bg-green-500 dark:text-white text-gray-800`}
        disabled={imporing}>
          {imporing?"Importing...":'Import Data'}
        </button>

          {jsonData&&jsonData.length>0&&!isModalOpen&&<p
            className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded-md"
            onClick={()=>setisModalOpen(true)}
          >
            Preview Data
          </p>}
          {jsonData&&jsonData.length>0&&!isModalOpen&&<p
            className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded-md"
            onClick={()=>setJsonData(null)}
          >
            Cancel Import
          </p>}
      </div>
      
    </div>}
    {importtype==='excle'&&<div className="mb-4">
      {/* <textarea
        className="w-full p-2 border rounded-md mb-2"
        rows="4"
        placeholder="Import multiple numbers (one per line)"
        onChange={handleImportNumbers}
      ></textarea> */}
      <h1 className="text-2xl font-bold mb-4">WhatsApp Numbers Import From Excel</h1>
      <div className=" items-center justify-between">
          <input disabled={imporing} onChange={(v)=>setgroupname(v.target.value)} value={groupname} className='p-2 border rounded w-full' placeholder='Group Name' />
          <p className='text-red-500'>*Don't Add more than 500 number in a single group</p>
          <div className="flex justify-between flex-wrap">
            <div class="flex mb-3 items-center justify-center w-full lg:w-1/2 p-2">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer h-full bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" disabled={jsonData?.length>0} type="file" accept=".xlsx, .xls" onChange={handleFileUpload} class="hidden" />
                </label>
            </div> 

            <div className='w-full lg:w-1/2 p-2'>
              <p className='p-2 border rounded-md bg-gray-200 my-1 dark:bg-gray-700'>Please Create a <b>.xlsx</b> file.</p>
              <img className='w-full border rounded-md' src='https://universalinternational.org/assets/images/xslx_demo.png' />
              <p className='p-2 border rounded-md bg-gray-200 my-1 dark:bg-gray-700'>Then save and import.</p>
            </div>
          </div>
        
        <div className='flex space-x-2 mt-2'>
          
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={importtoDb}
            disabled={imporing}
          >
            {imporing?"Importing...":'Import Data'}
          </button>
          {jsonData&&jsonData.length>0&&!isModalOpen&&<p
            className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded-md"
            onClick={()=>setisModalOpen(true)}
          >
            Preview Data
          </p>}
          {jsonData&&jsonData.length>0&&!isModalOpen&&<p
            className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded-md"
            onClick={()=>setJsonData(null)}
          >
            Cancel Import
          </p>}
        </div>
      </div>
    </div>}
    <h2 className="text-xl font-semibold">Group List:</h2>
    <div className='flex p-3 bg-gray-200 dark:bg-gray-600'>
      {grouploading&&<p>Loading...</p>}
      {groups.length>0&&groups.map((item)=>{
        return <p onClick={()=>setselectedGroup(item?.name)} key={item?.id} className={`p-1 mx-1 w-fit border relative text-xs  border-gray-500 px-4 rounded-md cursor-pointer ${item?.name===selectedGroup?'bg-green-500':"bg-gray-400"}`}>{item?.name}
        <span onClick={()=>deleteGroip(item?._id,item?.name)} className='absolute cursor-pointer text-xl text-gray-500 -top-4 right-1 font-bold opacity-0 hover:opacity-100 z-40 hover:text-red-500'>&times;</span>
        </p>
      })}
    </div>
    <div>
      <h2 className="text-xl font-semibold mb-2">Number List:</h2>
      <div>
          <div className='flex dark:bg-gray-600 bg-gray-200'>
              <p className='w-28 border border-gray-500 p-1'>#</p>
              <p className='w-1/3 border border-gray-500 p-1'>Name</p>
              <p className='w-1/3 border border-gray-500 p-1'>Number</p>
              <p className='w-1/3 border border-gray-500 p-1'>Group</p>
              <p className='w-1/3 border border-gray-500 p-1'>Added at</p>
          </div>
          {fetcingnumber&&<p className='text-center'>Loading...</p>}
          {numbers?.length<1&&<p className='text-center p-3'>No Data Found</p>}
          {selectedGroup&&numbers&&numbers.map((number, index) =>{ 
              return selectedGroup===number?.groupname&&<div key={index} className='flex'>
                    <p className='w-28  border-gray-500 border p-1'>{index+1}</p>
                  <p className='w-1/3 border-gray-500 border p-1'>{number?.name?number?.name:"Unknown"}</p>
                  <p className='w-1/3 border-gray-500 border p-1'>{number?.phone}</p>
                  <p className='w-1/3 border-gray-500 border p-1'>{number?.groupname}</p>
                  <p className='w-1/3 border-gray-500 border p-1'>{moment(number?.created_at).format('lll')}</p>
              </div>
          })}
          
      </div>
      
    </div>
  </div>
);
};

export default Importxldata;
