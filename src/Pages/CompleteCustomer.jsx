import React, { useEffect, useState } from 'react';
import useAdditem from '../hooks/useAddItems';
import useGetitem from '../hooks/useGetItems';
import CompleteCustomerList from '../Components/CompleteCustomerlList';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUpdateitem from '../hooks/useUpdateItems';
import useSectors from '../hooks/useGetSectors';
import { apilink, localapi } from '../../lib';
import toast from 'react-hot-toast';
import useAdditemcrm from '../hooks/useAddItemscrm';

const CompleteCustomer = () => {
  const {add_item} = useAdditem()
 
  const {update_item} = useUpdateitem()
  const {data:sectordata,get_sectors} = useSectors()
  const {data,get_item} = useGetitem()
  const [formData, setFormData] = useState({
    firstname: '',
    lastname:"",
    designation: '',
    phone: '',
    email: '',
    sector:'',
    companyName: '',
    address: '',
    remarks: '',
    positive:'No',
    assigned_to:''
  });

  const [customers, setCustomers] = useState(null);
  const [isAdding, setisAdding] = useState(false);
  const [seeForm, setseeForm] = useState(false);
  const [isEditingMode, setisEditingMode] = useState(false);
  const [editId, seteditId] = useState(null); //which customer get to edit
  const [customerdata, setcustomerdata] = useState([]);
  const [isLoading, setisLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name==='assigned_to'){
      //we are getting full employee data and from the OBJect we just collect _id
      const employee = JSON.parse(value)
      setFormData({ ...formData, [name]: value,employee_id:employee?._id });
    }else{
      setFormData({ ...formData, [name]: value });
    }
    
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisAdding(true)
    // const formData = new FormData(e.target);
    // const obj = Object.fromEntries(formData.entries())
    // console.log(obj);
    if(isEditingMode && editId){
        
        delete formData['_id']
        await UpdateCustomer(editId,formData)
        fetchCustomer()
        setisAdding(false)
        CanceleditingMode()
        
        return 0;
    }
    await add_item({data:{...formData,positive:"No"},table:'peoples'})
    setisAdding(false)
    setFormData({
      firstname: '',
      lastname:"",
      designation: '',
      phone: '',
      email: '',
      sector:'',
      companyName: '',
      address: '',
      remarks: '',
      positive:'No',
      assigned_to:''
      })
      fetchCustomer()
    //   window.location.href="/complete-customer-data"
  };

  useEffect(() => {
    get_sectors()
    get_item({query:{}, table:"employees"})
    
  }, []);



  const fetchCustomer = ()=>{
    setisLoading(true)
    
    fetch("https://crm-api.fwa-bd.com/api/people/list",{
        method:"GET",
    })
    .then((res)=>res.json())
    .then((result)=>{
        setisLoading(false)
        console.log('result',result?.result);
        
        
        
        setcustomerdata(result?.result)
    })
  }
  const UpdateCustomer = (id,updata)=>{
    setisLoading(true)
    
    fetch("https://crm-api.fwa-bd.com/api/people/update/"+id,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(updata)
    })
    .then((res)=>res.json())
    .then((result)=>{
        setisLoading(false)
        console.log('result',result);
        
        toast.success("Uodated")
    })
  }

  useEffect(() => {
    
    fetchCustomer()

  }, []);

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
        firstname: '',
        lastname: '',
        designation: '',
        phone: '',
        email: '',
        sector:'',
        company: '',
        address: '',
        remarks: '',
        assigned_to:''
      })
  }

  return (
    <div className="container mx-auto p-6">
      
      <div className='flex justify-between mb-4 items-center border-b py-2'>
        <h1 className="text-2xl font-bold">Customer Information Form</h1>
        {/* <p className='cursor-pointer px-2 text-white py-1 bg-blue-500 rounded-md' onClick={()=>setseeForm((prev)=>!prev)}><FontAwesomeIcon icon={faPlus} /> Add Customer</p> */}
      </div>

      {/* Form */}
      {seeForm&&<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full p-2 border rounded-md"
              
            />
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
              
            />
          </div>

          {/* <div>
            <label className="block text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full p-2 border rounded-md"
              
            />
          </div> */}

          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded-md"
              
            />
          </div>
          <div>
            <label className="block text-gray-700">Sectors</label>
            <select 
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            
            >
                <option selected>Select Sector</option>
                {sectordata&&sectordata?.map((item,index)=>{
                    return <option value={item?.name} key={index}>{item?.name}</option>
                })}
            </select>
            
          </div>
          <div>
            <label className="block text-gray-700">Assigned to</label>
            <select 
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            
            >
                <option selected>Select Person</option>
                {data&&data?.map((item,index)=>{
                    return <option value={JSON.stringify(item)} key={index}>{item?.name}</option>
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
            
            >
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
        </div>

        {!isEditingMode&&<button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          {isAdding?"Adding...":'Add Customer'}
        </button>}
        <div className='flex space-x-2'>
            {isEditingMode&&<button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
            {isAdding?"Updating...":'Edit Customer'}
            </button>}
            {isEditingMode&&<p onClick={CanceleditingMode} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">
            Cancel
            </p>}
        </div>
      </form>}

      {/* List of Customers */}
      {<CompleteCustomerList cust_data={customerdata} editingMode={editingMode} fetchCustomer={fetchCustomer} isEditingMode={isEditingMode} isLoadingState={isLoading}/>}
    </div>
  );
};

export default CompleteCustomer;
