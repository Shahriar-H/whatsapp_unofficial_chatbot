import React, { useEffect, useState } from 'react';
import useAdditem from '../hooks/useAddItems';
import useGetitem from '../hooks/useGetItems';
import CompleteCustomerList from '../Components/CompleteCustomerlList';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUpdateitem from '../hooks/useUpdateItems';
import useSectors from '../hooks/useGetSectors';
import { apilink, apilinkAlt, apitoken, useStore } from '../../lib';
import toast from 'react-hot-toast';
import MeetingsList from '../Components/MeetingsList';
import moment from 'moment';
import NotificationssList from '../Components/NotificationssList';
import AssignTaskList from '../Components/AssignedTaskList';

const AssignTask = () => {
  const {add_item} = useAdditem()
  const {update_item} = useUpdateitem()
  const {data:sectordata,get_sectors} = useSectors()
  const {data,get_item} = useGetitem()
  

  const [customers, setCustomers] = useState([]);
  const [isAdding, setisAdding] = useState(false);
  const [seeForm, setseeForm] = useState(false);
  const [isEditingMode, setisEditingMode] = useState(false);
  const [editId, seteditId] = useState(null); //which customer get to edit
  const [customerdata, setcustomerdata] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [uploadedFileLink, setuploadedFileLink] = useState(null);
  const {instancedata} = useStore((state) => state)
  const [allcustomersList, setallcustomersList] = useState([]);
  const [isSelectFromCustomer, setisSelectFromCustomer] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    user_id:"",
    task_details:"",
    assigned_by:instancedata?.login_info,
    positive:"No"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
    
    
  };

  



  const handleSubmit = async (e) => {
    e.preventDefault();
    setisAdding(true)
    // const formData = new FormData(e.target);
    // const obj = Object.fromEntries(formData.entries())
    // console.log(obj);
    if(isEditingMode && editId){
        
        delete formData['_id']
        await update_item({data:{...formData},table:'tasks',id:editId})
       
        setisAdding(false)
        CanceleditingMode()
        fetchCustomer()
        return 0;
    }
    await add_item({data:{...formData},table:'tasks'})
  
    setisAdding(false)
    setuploadedFileLink(null)
    setFormData({
      name: '',
      user_id:"",
      task_details:"",
      assigned_by:{},
      employee:{}
    })
      fetchCustomer()
    //   window.location.href="/complete-customer-data"
  };

  useEffect(() => {
    get_sectors()
    
    
  }, []);

  useEffect(() => {
    fetchCustomer()
    fetchCustomerListFromServer()
  }, []);
  //mettings list named as customer
  const fetchCustomer = (data={})=>{
    setisLoading(true)
    let query = {};
    console.log(instancedata?.login_info?.role,'ll');
    
    if(instancedata?.login_info?.role==='Employee'){
      query = {user_id:instancedata?.login_info?._id}
      console.log('query',query);
      
    }
    fetch(apilink+"/db/get-item",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({query,table:"tasks"})
    })
    .then((res)=>res.json())
    .then((result)=>{
        setisLoading(false)
        if(result.status!==200){
            return toast.error(result?.message)
        }
        console.log(result);
        
        setcustomerdata(result?.result)
    })
  }
  const fetchCustomerListFromServer = ()=>{
    setisLoading(true)
    fetch(apilink+"/db/get-item",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({query:{},table:"employees"})
    })
    .then((res)=>res.json())
    .then((result)=>{
        setisLoading(false)
        if(result.status!==200){
            return toast.error(result?.message)
        }
        console.log(result);
        
        setallcustomersList(result?.result)
    })
  }

  const editingMode = (data)=>{
    setseeForm(true)
    setisEditingMode(true)
    seteditId(data?._id)
    console.log(data);
    
    setFormData({...data})
  }
  const CanceleditingMode = ()=>{
    setseeForm(false)
    setisEditingMode(false)
    seteditId(null)
    setFormData({
      name: '',
      user_id:"",
      task_details:"",
      assigned_by:{},
      positive:'',
      employee:{}
      })
  }

  return (
    <div className="container mx-auto p-6">
      
      <div className='flex justify-between mb-4 items-center border-b py-2'>
        <h1 className="text-2xl font-bold">Task Form</h1>
        {instancedata?.login_info?.role!=='Employee'&&<p className='cursor-pointer px-2 text-white py-1 bg-blue-500 rounded-md' onClick={()=>setseeForm((prev)=>!prev)}><FontAwesomeIcon icon={faPlus} /> Add Task</p>}
      </div>

      {/* Form */}
      {seeForm&&<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full p-2 border rounded-md"
              required
            />
            {!isEditingMode&&<p onClick={()=>setisSelectFromCustomer((prev)=>!prev)} className='text-xs text-blue-500 cursor-pointer'>Select From List</p>}
            {isSelectFromCustomer&&<div className='max-h-32 overflow-auto p-2 bg-gray-50 dark:bg-gray-900'>
              {
                allcustomersList&&allcustomersList?.map((item,index)=>{
                  return <p key={index} onClick={()=>{setFormData({...formData,
                    name: item?.name,
                    user_id:item?._id,
                    employee:item
                  });setisSelectFromCustomer(false)}} className='bg-gray-100 dark:bg-gray-900 text-gray-400 cursor-pointer hover:bg-gray-200 border my-1'>{item?.name}</p>
                })
              }
            </div>}
          </div>

          

          <div className="col-span-2">
            <label className="block text-gray-700">Task details</label>
            <textarea
              name="task_details"
              value={formData.task_details}
              onChange={handleChange}
              placeholder="Remarks or Comments"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
        </div>

        {!isEditingMode&&<button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          {isAdding?"Adding...":'Add Task'}
        </button>}
        <div className='flex space-x-2'>
            {isEditingMode&&<button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
            {isAdding?"Updating...":'Edit Task'}
            </button>}
            {isEditingMode&&<p onClick={CanceleditingMode} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">
            Cancel
            </p>}
        </div>
      </form>}

      {/* List of Customers */}
      {<AssignTaskList cust_data={customerdata} editingMode={editingMode} fetchCustomer={fetchCustomer} isEditingMode={isEditingMode} isLoadingState={isLoading}/>}
    </div>
  );
};

export default AssignTask;
