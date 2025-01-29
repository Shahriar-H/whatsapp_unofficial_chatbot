import React, { useEffect, useState } from 'react';
import SideMenu from '../Components/Sidebar';
import Home from '../Components/Home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import Numberlist from './Numberlist';
import Importxldata from './Importxldata';
import { Outlet, useNavigate } from 'react-router-dom';
import { apilink, useStore } from '../../lib';
import toast, { Toaster } from 'react-hot-toast';




const HomePage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {instancedata,updatedata,removeData} = useStore((state) => state)
    const [todaysSceduleNumber, settodaysSceduleNumber] = useState(0);
    const navigate = useNavigate()
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const logout = ()=>{
      sessionStorage.removeItem('login_info')
      sessionStorage.removeItem('info')
      updatedata({qr:null,info:null,login_info:null})
      toast.success("Logged out.")
      // window.location.href="/login"
      navigate("/login")
    }

    useEffect(() => {
      const value = sessionStorage.getItem('login_info') //main login
      const value1 = sessionStorage.getItem('info') //whatsapp login
     
      const newval = JSON.parse(value)
      const newval1 = JSON.parse(value1)
      updatedata({...instancedata,login_info:newval,info:newval1})
      fetchCustomer()
      
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
      
      fetch(apilink+"/db/get-item",{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({query:{},table:"meetings"})
      })
      .then((res)=>res.json())
      .then((result)=>{
          
          if(result.status!==200){
              return toast.error(result?.message)
          }
          console.log(result);
          const filteredData = result?.result?.filter((item)=>item?.positive!=='Yes'&&isToday(item?.meeting_time)&&item)
          settodaysSceduleNumber(filteredData?.length)
      })
    }
    const gotoTodaysScedule=()=>{
      navigate("/todaysscedule")
    }
  return (
    <div className="bg-[#f9fafc] dark:bg-gray-900 h-screen">
    
      {/* Navbar */}
      <nav className="sticky top-0 bg-[#0cbaa0] p-4 z-50 flex justify-between items-center">
        <div className="container mx-auto space-x-3 w-1/2 flex items-center">
          {instancedata?.login_info?.name&&<h1 className='text-2xl cursor-pointer' onClick={toggleMenu}>
            {isOpen?<FontAwesomeIcon icon={faBars} />:<span className='text-green-700'><FontAwesomeIcon icon={faBars} /></span>}
          </h1>}
          <h1 className="text-gray-600 text-2xl font-bold">WA Automation</h1>
        </div>
        <div className='flex w-1/2 space-x-2 justify-end'>
          {instancedata?.login_info?.name?.split(" ")[0]&&
          <div className='relative' onClick={gotoTodaysScedule}>
            {todaysSceduleNumber>0&&<p className='cursor-pointer absolute text-xs flex justify-center items-center bg-red-500 h-5 rounded-full -top-1 w-5 text-white'>{todaysSceduleNumber}</p> }
            <p className='text-2xl'><FontAwesomeIcon icon={faBell} /></p>
          </div>
          }
          <p className='text-gray-500'>{instancedata?.login_info?.name?.split(" ")[0]?instancedata?.login_info?.name?.split(" ")[0]:"Need Setup"}</p> 
          {instancedata?.login_info?.name?.split(" ")[0]&&<p className='cursor-pointer text-gray-500' onClick={logout}>Logout</p> }
         
        </div>
      </nav>
      

      {/* Main Content */}
      <main className=" flex w-full justify-center">
        {instancedata?.login_info?.name&&<SideMenu isOpen={isOpen} toggleMenu={toggleMenu}/>}
        <div className={`w-full overflow-auto h-[570px] p-3 ${!isOpen&&"pr-1 lg:pr-20"}`}>
            {/* <Home/> */}
            {/* <Numberlist/> */}
            {/* <Importxldata/> */}
            {<Outlet/>}
        </div>
        <Toaster/>
      </main>

      {/* Footer */}
      <footer className="bg-[#f9fafc] p-1 text-xs text-center text-gray-500">
        &copy; 2024 - All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
