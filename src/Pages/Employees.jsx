import React, { useEffect, useState } from 'react';
import useAdditem from '../hooks/useAddItems';
import useGetitem from '../hooks/useGetItems';
import CompleteCustomerList from '../Components/CompleteCustomerlList';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUpdateitem from '../hooks/useUpdateItems';
import useSectors from '../hooks/useGetSectors';
import { apilink, useStore } from '../../lib';
import toast from 'react-hot-toast';
import EmployeeList from '../Components/EmployeeList';

const Employees = () => {
  const {add_item} = useAdditem()
  const {update_item} = useUpdateitem()
  const {data:sectordata,get_sectors} = useSectors()
  const {data,get_item} = useGetitem()
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    phoneNumber: '',
    email: '',
    sector:'',
    address: '',
    remarks: '',
    password: '',
    role: '',
  });

  const [customers, setCustomers] = useState([]);
  const [isAdding, setisAdding] = useState(false);
  const [seeForm, setseeForm] = useState(false);
  const [isEditingMode, setisEditingMode] = useState(false);
  const [editId, seteditId] = useState(null); //which customer get to edit
  const [customerdata, setcustomerdata] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const {instancedata} = useStore((state) => state)

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
        await update_item({data:{...formData},table:'employees',id:editId})
       
        setisAdding(false)
        CanceleditingMode()
        fetchCustomer()
        return 0;
    }
    await add_item({data:{...formData,positive:"No"},table:'employees'})
    setisAdding(false)
    setFormData({
        name: '',
        designation: '',
        phoneNumber: '',
        email: '',
        sector:'',
        companyName: '',
        address: '',
        remarks: '',
        password:'',
        role:'',
       
      })
      fetchCustomer()
    //   window.location.href="/complete-customer-data"
  };

  useEffect(() => {
    get_sectors()
    
    
  }, []);

  useEffect(() => {
    fetchCustomer()
    
  }, []);

  const fetchCustomer = (data={})=>{
    setisLoading(true)
    fetch(apilink+"/db/get-item",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({query:{...data},table:"employees"})
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
        designation: '',
        phoneNumber: '',
        email: '',
        sector:'',
        companyName: '',
        address: '',
        remarks: '',
        password:'',
        role:""
      })
  }

  return (
    <div className="container mx-auto p-6">
      
      <div className='flex justify-between mb-4 items-center border-b py-2'>
        <h1 className="text-2xl font-bold">Add Employee Form</h1>
        {instancedata?.login_info?.role==='Supper'&&<p className='cursor-pointer px-2 text-white py-1 bg-blue-500 rounded-md' onClick={()=>setseeForm((prev)=>!prev)}><FontAwesomeIcon icon={faPlus} /> Add Employee</p>}
      </div>

      {/* Form */}
      {seeForm&&<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Employee Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border rounded-md"
              required
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
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Phone Number / WhatsApp</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
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

          {/* <div>
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
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
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
          <div>
            <label className="block text-gray-700">Role</label>
            <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            
            required>
                <option selected>Select Role</option>
                {instancedata?.login_info?.role==='Supper'&&<option value={'Supper'}>{"Supper Admin"}</option>}
                {instancedata?.login_info?.role==='Supper'&&<option value={'Admin'}>{"Admin"}</option>}
                
                <option value={'Employee'}>{"Employee"}</option>
            </select>
            
          </div>
          

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
          {isAdding?"Adding...":'Add Employee'}
        </button>}
        <div className='flex space-x-2'>
            {isEditingMode&&<button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
            {isAdding?"Updating...":'Edit Employee'}
            </button>}
            {isEditingMode&&<p onClick={CanceleditingMode} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">
            Cancel
            </p>}
        </div>
      </form>}

      {/* List of Customers */}
      {<EmployeeList cust_data={customerdata} editingMode={editingMode} fetchCustomer={fetchCustomer} isEditingMode={isEditingMode} isLoadingState={isLoading}/>}
    </div>
  );
};

export default Employees;
