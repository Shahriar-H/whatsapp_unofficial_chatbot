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
import TodaysScheduleList from '../Components/TodaysScheduleList';

const Todaysschedule = () => {
  const {add_item} = useAdditem()
  const {update_item} = useUpdateitem()
  const {data:sectordata,get_sectors} = useSectors()
  const {data,get_item} = useGetitem()
  const [formData, setFormData] = useState({
    customerName: '',
    designation: '',
    phoneNumber: '',
    email: '',
    sector:'',
    companyName: '',
    address: '',
    remarks: '',
    positive:'Yes',
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
        customerName: '',
        designation: '',
        phoneNumber: '',
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

  function isToday(dateString) {
    // Parse the given date string
    const givenDate = new Date(dateString);
  
    // Get today's date
    const today = new Date();
  
    // Compare year, month, and day
    return (
      givenDate.getFullYear() === today.getFullYear() &&
      givenDate.getMonth() === today.getMonth() &&
      givenDate.getDate() === today.getDate()
    );
  }
  //mettings list named as customer
  const fetchCustomer = (data={})=>{
    setisLoading(true)
    fetch(apilink+"/db/get-item",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({query:{},table:"meetings"})
    })
    .then((res)=>res.json())
    .then((result)=>{
        setisLoading(false)
        if(result.status!==200){
            return toast.error(result?.message)
        }
        console.log(result);
        const filteredData = result?.result?.filter((item)=>isToday(item?.meeting_time)&&item)
        setcustomerdata(filteredData)
    })
  }
  const fetchCustomerListFromServer = ()=>{
    setisLoading(true)
    fetch(apilink+"/db/get-item",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({query:{},table:"customers"})
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
        customerName: '',
        designation: '',
        phoneNumber: '',
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
     
      {/* List of Customers */}
      {<TodaysScheduleList cust_data={customerdata} editingMode={editingMode} fetchCustomer={fetchCustomer} isEditingMode={isEditingMode} isLoadingState={isLoading}/>}
    </div>
  );
};

export default Todaysschedule;
