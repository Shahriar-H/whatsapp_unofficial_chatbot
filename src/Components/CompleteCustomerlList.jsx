import React, { useEffect, useState } from 'react';
import useGetitem from '../hooks/useGetItems';
import CustomerInfoModal from './CustomerInfoModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClone, faEdit, faEye, faSquareFull, faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import useDeleteitem from '../hooks/useDeleteitems';
import useSectors from '../hooks/useGetSectors';
import useUpdateitem from '../hooks/useUpdateItems';
import { useStore } from '../../lib';
import useUpdateitemcrm from '../hooks/useUpdateItemscrm';
import toast from 'react-hot-toast';

const CompleteCustomerList = ({editingMode,positivePage,cust_data,fetchCustomer,fetchCustomerpositive,isLoadingState}) => {

  const {update_itemcrm} = useUpdateitemcrm()
  const {data:sectordata,get_sectors} = useSectors()
  const {delete_item} = useDeleteitem()
  const [selecteddata, setselecteddata] = useState(null);
  const [selectedsectors, setselectedsectors] = useState(null);
  const [isPositiveFilter, setisPositiveFilter] = useState(null);
  const {instancedata} = useStore((state) => state)
  const [customers, setCustomers] = useState(cust_data);

 

  // useEffect(() => {
  //   if(selectedsectors){
  //       if(positivePage){
  //         fetchCustomerpositive()
  //       }else{
  //         fetchCustomer()
  //       }
        
  //   }else{
  //     if(positivePage){
  //       fetchCustomerpositive()
  //     }else{
  //       fetchCustomer()
  //     }
  //   }
    
    
  // }, [selectedsectors]);

  useEffect(() => {
    get_sectors()
    setCustomers(cust_data)
  }, [cust_data]);

  // const filterMaking =()=>{
  //   const filterresult = cust_data&&cust_data.filter((item)=>{
  //     if()
  //   })
  // }



 

  const CloseModal = ()=>{
    setselecteddata(null)
  }

  const deleteData = async (id)=>{
    await delete_item({id,table:"customers"})
    if(positivePage){
      fetchCustomerpositive()
    }else{
      fetchCustomer()
    }
  }

  const positiveCustData = (value)=>{
    // if(positivePage){
    //   fetchCustomerpositive()
    // }else{
    //   fetchCustomer()
    // }
    setisPositiveFilter(value)
    if(!value){
      setCustomers(cust_data)
      return 0;
    }
    
    const filterdata = cust_data&&cust_data.filter((item)=>item.positive===value&&item)
    setCustomers(filterdata)
    
  }

  useEffect(() => {
    if(selectedsectors){
      const filterdata = cust_data&&cust_data.filter((item)=>item.sector===selectedsectors&&item)
      setCustomers(filterdata)
    }
    
  }, [selectedsectors]);



  const UpdateCustomer = (updata,id)=>{
    
    
    fetch("https://crm-api.fwa-bd.com/api/people/update/"+id,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(updata)
    })
    .then((res)=>res.json())
    .then((result)=>{
       toast.success("Updated")
        console.log('result',result);
        fetchCustomer()
        
    })
  }
  

  return (
    <div className="container mx-auto">
      {selecteddata&&<CustomerInfoModal CloseModal={CloseModal} data={selecteddata}/>}
      {/* List of Customers */}
      <div className="mt-8 overflow-auto min-h-96">
        <div className='flex justify-between items-center'>
            <div className='mb-4'>
              <h2 className="text-xl font-bold">Customer List</h2>
              <div className='flex space-x-1 items-center'>
                    <div className='h-4 w-4 border-green-500 border-2 cursor-pointer overflow-hidden p-[2px] rounded-full'></div> 
                    <p className='text-sm'>Completed</p>
                    <div className='h-4 w-4 border-yellow-400 cursor-pointer overflow-hidden p-[2px] border-2 rounded-full'></div> 
                    <p className='text-sm'>Processing</p>
                    <div className='h-4 w-4 border-red-500 overflow-hidden p-[2px] cursor-pointer border-2 rounded-full'></div>
                    <p className='text-sm'>Canceled</p>
              </div>
            </div>
            
            <div className='flex items-center space-x-1'>
                {/* <p className={`cursor-pointer px-2 text-white py-1 ${isPositiveFilter?"bg-green-700 ":"bg-green-500 hover:bg-green-400"} rounded-md text-xs`} onClick={()=>positiveCustData()}><FontAwesomeIcon icon={faCheck} /> Postive Customer</p> */}
                <p className={`cursor-pointer px-2 text-white py-1 bg-red-500 rounded-md text-xs`} onClick={()=>{positiveCustData(null)}}><FontAwesomeIcon icon={faClone} /> Clear Filter</p>

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
                !isLoadingState&&customers?.length === 0 && (
                        <p colSpan="8" className="text-center absolute top-10 left-0 right-0 m-auto py-4">
                        No Customers Added
                        </p>
                ) 
            }
        </div>
        <table className="min-w-full min-h-14 bg-white dark:bg-gray-800 shadow-md rounded-md">
          <thead>
            <tr className='text-left'>
              <th className="py-2 px-4 w-10 border-b text-sm">#</th>
              <th className="py-2 px-4 border-b text-sm">Customer Name</th>
              <th className="py-2 px-4 border-b text-sm">Assinged to</th>
              <th className="py-2 px-4 border-b text-sm">Phone Number</th>
              <th className="py-2 px-4 border-b text-sm">Email</th>
              <th className="py-2 px-4 border-b text-sm">Status</th>
              
              <th className="py-2 px-4 border-b text-sm hidden">More</th>
            </tr>
          </thead>
          
          <tbody>
            
            {(
                customers&&customers?.map((customer, index) => {
                if(true){
                  return <tr key={index} className='text-left'>
                  <td className="py-2 px-4 w-10 border-b text-sm">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <p>{customer.firstname} {customer.lastname} {customer?.positive}</p>
                    <p className='text-xs text-gray-400'>{customer.designation}</p>
                  </td>
                  <td className="py-2 px-4 border-b text-sm">{customer.assigned_to&&JSON.parse(customer.assigned_to)?.name}</td>
                  <td className="py-2 px-4 border-b text-sm">{customer.phone}</td>
                  <td className="py-2 px-4 border-b text-sm">{customer.email}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <div className='flex space-x-1'>
                        <div onClick={()=>UpdateCustomer({positive	:"Yes"},customer?._id)} className='h-4 w-4 border-green-500 border-2 cursor-pointer overflow-hidden p-[2px] rounded-full'>
                            {customer?.positive==='Yes'&&<div className='w-full h-full bg-green-500 rounded-full'></div>}
                        </div>
                        <div onClick={()=>UpdateCustomer({positive	:"Unknown"},customer?._id)} className='h-4 w-4 border-yellow-400 cursor-pointer overflow-hidden p-[2px] border-2 rounded-full'>
                            {customer?.positive==='Unknown'&&<div className='w-full h-full bg-yellow-500 rounded-full'></div>}
                        </div>
                        <div onClick={()=>UpdateCustomer({positive	:"No"},customer?._id)} className='h-4 w-4 border-red-500 overflow-hidden p-[2px] cursor-pointer border-2 rounded-full'>
                            {customer?.positive==='No'&&<div className='w-full h-full bg-red-500 rounded-full'></div>}
                        </div>
                    </div>
                  </td>
                 
                  <td className="py-2 px-4 border-b text-sm space-x-2">
                    <span className='cursor-pointer' onClick={()=>setselecteddata(customer)}><FontAwesomeIcon icon={faEye} /></span>
                    {instancedata?.login_info?.role!=='Employee'&&<>
                      <span onClick={()=>editingMode(customer)} className='cursor-pointer'><FontAwesomeIcon icon={faEdit} /></span>
                      <span className='hidden' onClick={()=>deleteData(customer?._id)}><FontAwesomeIcon icon={faTrash} /></span>
                    </>}
                    
                  </td>
                </tr>
                }
                
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompleteCustomerList;
