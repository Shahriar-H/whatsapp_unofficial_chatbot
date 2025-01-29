import React, { useEffect, useState } from 'react';
import useAdditem from '../hooks/useAddItems';
import useGetitem from '../hooks/useGetItems';
import CompleteCustomerList from '../Components/CompleteCustomerlList';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUpdateitem from '../hooks/useUpdateItems';
import useSectors from '../hooks/useGetSectors';
import { apilink, apilinkAlt, apitoken, Phone_Id, useStore } from '../../lib';
import toast from 'react-hot-toast';
import MeetingsList from '../Components/MeetingsList';
import moment from 'moment';
import NotificationssList from '../Components/NotificationssList';

const Notifications = () => {
  const {add_item} = useAdditem()
  const {update_item} = useUpdateitem()
  const {data:sectordata,get_sectors} = useSectors()
  const {data,get_item} = useGetitem()
  const [formData, setFormData] = useState({
    customerName:"",
    designation: '',
    phone: '',
    email: '',
    sector:'',
    companyName: '',
    address: '',
    remarks: '',
    positive:'No',
    meeting_time:'',
    numbers:'',
    notification:'yes'
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
    
    
  };

  const gettheTimeBefore5minutes = (scheduedtime)=>{
    const dateStr = scheduedtime;
    const date = new Date(dateStr);

    // Subtract 5 minutes (5 * 60 * 1000 milliseconds)
    date.setMinutes(date.getMinutes() - 5);

    // Get the new time
    const newTime = date.toISOString().slice(0,16); // Format to keep 'YYYY-MM-DDTHH:MM'
    console.log(newTime); // Output: 2024-09-14T13:27
    return newTime
  }

  const createScedule = ()=>{
    
    try {
      setisLoading(true)
      const message = "A notification for you, Details- "+formData?.remarks;
      let data = {
        host:Phone_Id,
        numbers:JSON.stringify(formData?.numbers.split(',')),
        send_time:gettheTimeBefore5minutes(formData?.meeting_time),
        is_sent:"Waiting",
        message:message,
        access_token:apitoken,
        instance_id:instancedata?.info?.instance_id,
        media_url:null
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
        
        toast.success("Scheduled");
      })
    } catch (error) {
      setisLoading(false)
      toast.error("Error");
      // console.log(error);
      
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisAdding(true)
    // const formData = new FormData(e.target);
    // const obj = Object.fromEntries(formData.entries())
    // console.log(obj);
    if(isEditingMode && editId){
        
        delete formData['_id']
        const numarr =typeof formData?.numbers==='string'?JSON.stringify(formData?.numbers?.split(',')):formData?.numbers;
        await update_item({data:{...formData,numbers:numarr,notification:'yes'},table:'meetings',id:editId})
       
        setisAdding(false)
        CanceleditingMode()
        fetchCustomer()
        return 0;
    }
    const numarr =typeof formData?.numbers==='string'?JSON.stringify(formData?.numbers?.split(',')):formData?.numbers;
    await add_item({data:{...formData,numbers:numarr,notification:'yes'},table:'meetings'})
    createScedule()
    setisAdding(false)
    setuploadedFileLink(null)
    setFormData({
      customerName:"",
        designation: '',
        phone: '',
        email: '',
        sector:'',
        companyName: '',
        address: '',
        remarks: '',
        meeting_time:'',
        numbers:'',
        notification:''
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
    fetch(apilink+"/db/get-item",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({query:{notification:"yes"},table:"meetings"})
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
    fetch(apilink+"/db/get-itemcrm",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({query:{isClient:true},table:"peoples"})
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
    
    setFormData({...data,numbers:JSON.parse(data?.numbers)})
  }
  const CanceleditingMode = ()=>{
    setseeForm(false)
    setisEditingMode(false)
    seteditId(null)
    setFormData({
      customerName:"",
        designation: '',
        phone: '',
        email: '',
        sector:'',
        companyName: '',
        address: '',
        remarks: '',
        meeting_time:'',
        numbers:''
      })
  }

  const handleUpload = (file)=>{
    let data = new FormData();
    data = data.append("file",file)

    fetch(apilinkAlt+"/upload-image",{
      method:"POST",
      body:JSON.stringify(data)
    })
    .then((res)=>res.json())
    .then((result)=>{
      if(result?.status!==200){
        return toast.error(result?.message)
      }
      setuploadedFileLink(result?.filename)
    })
  }

  return (
    <div className="container mx-auto p-6">
      
      <div className='flex justify-between mb-4 items-center border-b py-2'>
        <h1 className="text-2xl font-bold">Notification Form</h1>
        <p className='cursor-pointer px-2 text-white py-1 bg-blue-500 rounded-md' onClick={()=>setseeForm((prev)=>!prev)}><FontAwesomeIcon icon={faPlus} /> Add Notification</p>
      </div>

      {/* Form */}
      {seeForm&&<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full p-2 border rounded-md"
              required
            />
            {!isEditingMode&&<p onClick={()=>setisSelectFromCustomer((prev)=>!prev)} className='text-xs text-blue-500 cursor-pointer hidden'>Select From List</p>}
            {isSelectFromCustomer&&<div className='max-h-32 overflow-auto p-2 bg-gray-50'>
              {
                allcustomersList&&allcustomersList?.map((item,index)=>{
                  return <p key={index} onClick={()=>{setFormData({
                    customerName: item?.customerName,
                    designation: item?.designation,
                    phone: item?.phone,
                    email: item?.email,
                    sector:item?.sector,
                    companyName: item?.companyName,
                    address: item?.address,
                    remarks: item?.remarks,
                    positive:item?.positive,
                    meeting_time:item?.meeting_time,
                    numbers:item?.numbers,
                    
                    notification:'yes'
                  });setisSelectFromCustomer(false)}} className='bg-gray-100 cursor-pointer hover:bg-gray-200 border my-1'>{item?.firstname} {item?.lastname}</p>
                })
              }
            </div>}
          </div>

          <div>
            <label className="block text-gray-700">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Phone Number / WhatsApp</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">When to Notifiy?</label>
            <input
              type="datetime-local"
              name="meeting_time"
              value={formData.meeting_time}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* <div>
            <label className="block text-gray-700">Upload File</label>
            <input
              type="file"
              name="upload_file"
              onChange={handleUpload}
              placeholder="Address"
              className="w-full p-2 border rounded-md"
              
            />
            {uploadedFileLink&&<p>{uploadedFileLink} is Uploaded</p>}
          </div> */}
          <div>
            <label className="block text-gray-700">Sectors</label>
            <select 
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            
            required>
                <option selected>Select Sector</option>
                {sectordata&&sectordata?.map((item,index)=>{
                    return <option value={item?.name} key={index}>{item?.name}</option>
                })}
            </select>
            
          </div>
          {isEditingMode&&<div>
            <label className="block text-gray-700">Positive?</label>
            <select 
            name="positive"
            value={formData.positive}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            
            required>
                <option selected disabled>Select Sector</option>
                <option value={"Yes"}>Yes</option>
                <option value={"No"}>No</option>
                
            </select>
            
          </div>}

          <div className="col-span-2">
            <label className="block text-gray-700">Remarks / Comments</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Remarks or Comments"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700">To Notification Numbers</label>
            <p className='text-xs'>Enter multiple Number with comma Ex. 8801xxxxxxxxx,8801xxxxxxxxx</p>
            <textarea
              name="numbers"
              value={formData.numbers}
              onChange={handleChange}
              placeholder="8801xxxxxxxxx,8801xxxxxxxxx"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {!isEditingMode&&<button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          {isAdding?"Adding...":'Add Notification'}
        </button>}
        <div className='flex space-x-2'>
            {isEditingMode&&<button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
            {isAdding?"Updating...":'Edit Notification'}
            </button>}
            {isEditingMode&&<p onClick={CanceleditingMode} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">
            Cancel
            </p>}
        </div>
      </form>}

      {/* List of Customers */}
      {<NotificationssList cust_data={customerdata} editingMode={editingMode} fetchCustomer={fetchCustomer} isEditingMode={isEditingMode} isLoadingState={isLoading}/>}
    </div>
  );
};

export default Notifications;
