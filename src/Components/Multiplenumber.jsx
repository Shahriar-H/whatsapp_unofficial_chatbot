// src/components/PhoneNumberSelector.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useGetnumbers from '../hooks/useGetnumbers';
import { apilink, Phone_Id } from '../../lib';



const PhoneNumberSelector = ({getallphonenumbers}) => {
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [selectedphonenumber, setselectedphonenumber] = useState([]);
    const [phoneNumbers, setphoneNumbers] = useState([]);
    const {data,get_number} = useGetnumbers()
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

    const handleCheckboxChange = (number) => {
        setSelectedNumbers((prevSelected) =>
            prevSelected.includes(number)
                ? prevSelected.filter((itemNum) => itemNum !== number)
                : [...prevSelected, number]
        );
        
    };
    const selectallnumber = () => {
        let idarr = [];
        let numarr = [];
        phoneNumbers.map(({id,phone})=>{
            idarr.push(id)
            numarr.push(phone)
        })
        console.log(numarr);
        
        setSelectedNumbers(numarr);
       
    };

    const passNumbersToHome = ()=>{
        getallphonenumbers(selectedNumbers)
    }

    useEffect(() => {
        passNumbersToHome()
    }, [selectedNumbers]);

    useEffect(() => {
       
        setphoneNumbers(data)
        
    }, [data]);

    useEffect(() => {
        getallGroup()
    }, []);
    useEffect(() => {
        get_number({group:selectedGroup})
        
    }, [selectedGroup]);
    
   

    const isSelected = (number) => selectedNumbers.includes(number);

    return (
        <div className="p-4 relative mx-auto shadow-md bg-gray-50 dark:bg-gray-800 bg-opacity-5 max-h-96 overflow-y-auto rounded-lg">
            <h1 className="text-xl flex items-center font-bold space-x-2 text-green-600 mb-4">
                <span>Select Phone Numbers({selectedNumbers?.length})</span> 
                <p onClick={selectallnumber} className='text-xs bg-green-300 hover:bg-green-400 text-green700 p-1 cursor-pointer rounded border border-green-700'>Select ALL</p>

                <p onClick={()=>{setSelectedNumbers([])}} className='text-xs bg-red-300 hover:bg-red-400 text-red-700 p-1 cursor-pointer rounded border border-red-700'>Unselect ALL</p>

                <Link to={'/wa/add-number'} className='text-xs bg-blue-300 hover:bg-blue-400 text-blue-700 p-1 cursor-pointer rounded border border-red-700'>Add Number</Link>
            </h1>
            <div className='flex'>
                {groups.length>0&&groups.map((item)=>{
                return <p onClick={()=>setselectedGroup(item?.name)} key={item?.id} className={`p-1 mx-1 w-fit border rounded-md hover:bg-green-400 cursor-pointer ${item?.name===selectedGroup&&'bg-green-500'}`}>{item?.name}</p>
                })}
            </div>
            <div>
                {selectedGroup&&phoneNumbers&&phoneNumbers.map(({ id, phone,name,groupname },index) => {
                    return selectedGroup===groupname&&<div key={index} className="flex items-center mb-2">
                        <div className="flex items-center w-3/12 border p-1">
                            <input
                                type="checkbox"
                                id={`checkbox-${id}`}
                                className="form-checkbox h-5 w-5 text-green-600"
                                checked={isSelected(phone)}
                                onChange={() => handleCheckboxChange(phone)}
                            />
                            <label
                                htmlFor={`checkbox-${id}`}
                                className="ml-2 text-gray-700 dark:text-gray-200"
                            >
                                {index+1} {name?name:"Unknown"}
                            </label>
                        </div>
                        
                        <div className='w-8/12 border p-1 border-l-0'>
                            <label
                                htmlFor={`checkbox-${id}`}
                                className="ml-2 text-gray-700 dark:text-gray-200"
                            >
                                {phone}
                            </label>
                        </div>
                    </div>
                    
                })}
            </div>

            <div className="mt-4">
                <h2 className="text-lg font-semibold text-green-600">Selected Numbers:</h2>
                {selectedNumbers.length > 0 ? (
                    <ul className="list-inside list-none flex flex-wrap ">
                        {selectedNumbers.map((number,index) => (
                            <li key={index} className="text-gray-700 bg-green-300 p-1 rounded-xl text-xs border m-1 dark:text-green-700">
                                {phoneNumbers?.find((num) => num.phone === number).phone}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No numbers selected.</p>
                )}
            </div>
        </div>
    );
};

export default PhoneNumberSelector;
