import React, { useEffect, useState } from 'react'
import { useStore } from '../../lib';
import { Navigate } from 'react-router-dom';

export default function PrivetRoute({children}) {
    
    const {instancedata,updatedata,removeData} = useStore((state) => state)
    const [isLoggedin, setisLoggedin] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const value = sessionStorage.getItem('login_info')
    const value1 = sessionStorage.getItem('info')

    useEffect(() => {
        setisLoading(true)
        
        console.log(value);
        updatedata({...instancedata,qr:null,login_info:JSON.parse(value),info:JSON.parse(value1)})
        setisLoading(false)
        
        
    }, []);
    useEffect(() => {
        if(instancedata?.name){
            setisLoggedin(true)
        }else{
            setisLoggedin(false)
        }
    }, []);

  return !isLoading?
  instancedata?.login_info?children:<Navigate to={'/login'} />
  :<p>Loading...</p>


//   return !isLoading?
//   instancedata?.info?children:<Navigate to={'/login'} />
//   :<p>Loading...</p>

}
