import React, { useEffect, useState } from 'react';
import useGetitem from '../hooks/useGetItems';
import CustomerInfoModal from './CustomerInfoModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClone, faEdit, faEye, faSquareFull, faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import useDeleteitem from '../hooks/useDeleteitems';
import useSectors from '../hooks/useGetSectors';
import useUpdateitem from '../hooks/useUpdateItems';
import moment from 'moment';
import { useStore } from '../../lib';

const MeetingsList = ({editingMode,positivePage,cust_data,fetchCustomer,isLoadingState}) => {
  const {data,get_item} = useGetitem()
  const {update_item} = useUpdateitem()
  const {data:sectordata,get_sectors} = useSectors()
  const {delete_item} = useDeleteitem()
  const [selecteddata, setselecteddata] = useState(null);
  const [selectedsectors, setselectedsectors] = useState('');
  const [isPositiveFilter, setisPositiveFilter] = useState('');
  const {instancedata} = useStore((state) => state)

  const [customers, setCustomers] = useState(cust_data);

 

  useEffect(() => {
    if(selectedsectors){
        fetchCustomer({sector:selectedsectors})
    }else{
        fetchCustomer()
    }
    
    
  }, [selectedsectors]);

  useEffect(() => {
    get_sectors()
  }, []);



 

  const CloseModal = ()=>{
    setselecteddata(null)
  }

  const deleteData = async (id)=>{
    await delete_item({id,table:"meetings"})
    fetchCustomer()
  }

  const positiveCustData = (value)=>{
    fetchCustomer({positive:value})
    setisPositiveFilter(value)
    
  }

  const updateState =async (value,id)=>{
    //change the positive status
    console.log(value,id);
    
    const data = {positive:value}
    await update_item({data,table:"meetings",id})
    setTimeout(() => {
        if(positivePage){
            fetchCustomer({positive:'Yes'})
        }else{
            fetchCustomer()
        }
    }, 1000);
    
    
  }
  

  return (
    <div className="container mx-auto">
      {selecteddata&&<CustomerInfoModal CloseModal={CloseModal} data={selecteddata}/>}
      {/* List of Customers */}
      <div className="mt-8 overflow-auto min-h-96">
        <div className='flex justify-between items-center'>
           
            <div className='mb-4'>
              <h2 className="text-xl font-bold">Meetings List</h2>
              <div className='flex space-x-1 items-center'>
                    <div className='h-4 w-4 border-green-500 border-2 cursor-pointer overflow-hidden p-[2px] rounded-full'></div> 
                    <p className='text-sm'>Success</p>
                    <div className='h-4 w-4 border-yellow-400 cursor-pointer overflow-hidden p-[2px] border-2 rounded-full'></div> 
                    <p className='text-sm'>Pending</p>
                    <div className='h-4 w-4 border-red-500 overflow-hidden p-[2px] cursor-pointer border-2 rounded-full'></div>
                    <p className='text-sm'>Cancel/Rejected</p>
              </div>
            </div>
            <div className='flex items-center space-x-1'>
                {/* <p className={`cursor-pointer px-2 text-white py-1 ${isPositiveFilter?"bg-green-700 ":"bg-green-500 hover:bg-green-400"} rounded-md text-xs`} onClick={()=>positiveCustData()}><FontAwesomeIcon icon={faCheck} /> Postive Customer</p> */}
                <p className={`cursor-pointer px-2 text-white py-1 bg-red-500 rounded-md text-xs`} onClick={()=>{fetchCustomer();setisPositiveFilter(false);setselectedsectors('')}}><FontAwesomeIcon icon={faClone} /> Clear Filter</p>

                <div className='flex space-x-1'>
                    <div onClick={()=>positiveCustData("Yes")} className='h-4 w-4 border-green-500 border-2 cursor-pointer overflow-hidden p-[2px] rounded-full'>
                        {isPositiveFilter==='Yes'&&<div className='w-full h-full bg-green-500 rounded-full'></div>}
                    </div>
                    <div onClick={()=>positiveCustData("Unknown")} className='h-4 w-4 border-yellow-400 cursor-pointer overflow-hidden p-[2px] border-2 rounded-full'>
                        {isPositiveFilter==='Unknown'&&<div className='w-full h-full bg-yellow-500 rounded-full'></div>}
                    </div>
                    <div onClick={()=>positiveCustData("No")} className='h-4 w-4 border-red-500 overflow-hidden p-[2px] cursor-pointer border-2 rounded-full'>
                        {isPositiveFilter==='No'&&<div className='w-full h-full bg-red-500 rounded-full'></div>}
                    </div>
                </div>

                
                
                <select onChange={(e)=>setselectedsectors(e.target.value)} defaultValue={selectedsectors} className='p-1 rounded-md '>
                        <option value={''} selected >All Itmes</option>
                        {sectordata&&sectordata?.map((item,index)=>{
                            return <option selected={item?.name===selectedsectors} key={index} value={item?.name}>{item?.name}</option>
                        })}
                </select>
            </div>
        </div>
        <div className='relative'>
            {
                isLoadingState&&
                <p colSpan="8" className="text-center absolute top-10 left-0 right-0 m-auto py-4">
                    Loading...
                </p>
            }
            {
                !isLoadingState&&cust_data?.length === 0 && (
                        <p colSpan="8" className="text-center absolute top-10 left-0 right-0 m-auto py-4">
                        No Meetings Added
                        </p>
                ) 
            }
        </div>
        <table className="min-w-full min-h-14 bg-white dark:bg-gray-800 shadow-md rounded-md">
          <thead>
            <tr className='text-left'>
              <th className="py-2 px-4 w-10 border-b text-sm">#</th>
              <th className="py-2 px-4 border-b text-sm">Customer Name</th>
              <th className="py-2 px-4 border-b text-sm">Meeting Time</th>
              <th className="py-2 px-4 border-b text-sm">Contact</th>
              <th className="py-2 px-4 border-b text-sm">Company</th>
              <th className="py-2 px-4 border-b text-sm">Status</th>
              
              <th className="py-2 px-4 border-b text-sm">More</th>
            </tr>
          </thead>
          
          <tbody>
            
            {(
                cust_data&&cust_data?.map((customer, index) => (
                <tr key={index} className='text-left'>
                  <td className="py-2 px-4 w-10 border-b text-sm">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <p>{customer.customerName}</p>
                    <p className='text-xs text-gray-400'>{customer.designation}</p>
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <p>{moment(customer?.meeting_time).format("lll")}</p>
                    <p className='text-gray-400'>{moment(customer?.meeting_time).fromNow()}</p>
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <p>{customer.phoneNumber}</p>
                    <p>{customer.email}</p>
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <p>{customer.companyName}</p>
                    <p className='text-gray-400'>({customer.sector})</p>
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <div className='flex space-x-1'>
                        <div onClick={()=>updateState("Yes",customer?._id)} className='h-4 w-4 border-green-500 border-2 cursor-pointer overflow-hidden p-[2px] rounded-full'>
                            {customer?.positive==='Yes'&&<div className='w-full h-full bg-green-500 rounded-full'></div>}
                        </div>
                        <div onClick={()=>updateState("Unknown",customer?._id)} className='h-4 w-4 border-yellow-400 cursor-pointer overflow-hidden p-[2px] border-2 rounded-full'>
                            {customer?.positive==='Unknown'&&<div className='w-full h-full bg-yellow-500 rounded-full'></div>}
                        </div>
                        <div onClick={()=>updateState("No",customer?._id)} className='h-4 w-4 border-red-500 overflow-hidden p-[2px] cursor-pointer border-2 rounded-full'>
                            {customer?.positive==='No'&&<div className='w-full h-full bg-red-500 rounded-full'></div>}
                        </div>
                    </div>
                  </td>
                 
                  <td className="py-2 px-4 border-b text-sm space-x-2">
                    <span className='cursor-pointer' onClick={()=>setselecteddata(customer)}><FontAwesomeIcon icon={faEye} /></span>
                    {instancedata?.login_info?.role!=='Employee'&&<>
                      <span onClick={()=>editingMode(customer)} className='cursor-pointer'><FontAwesomeIcon icon={faEdit} /></span>
                      <span onClick={()=>deleteData(customer?._id)}><FontAwesomeIcon icon={faTrash} /></span>
                    </>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingsList;
