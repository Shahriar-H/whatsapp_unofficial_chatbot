import React, { useEffect, useState } from 'react'
import DashboardCard from '../Components/DashboardCard';
import PhoneInfoCard from '../Components/Phoneinfo';
import { apilink, apitoken, useStore } from '../../lib';
import Qrcodeinfo from '../Components/Qrcodeinfo';
import { useGetinstance } from '../hooks/useGetinstance';


import SocketIOClient, { io } from "socket.io-client";
import toast from 'react-hot-toast';
import { faPowerOff, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// const socket = io(apilink);
// socket.connect()





export default function Setup() {
    const [instance, setinstance] = useState(null);
    const [isReady, setisReady] = useState(false);
    const [qrurl, setqrurl] = useState(null);
    const {data, dataseton} = useGetinstance()
    const [instatceID, setinstatceID] = useState(null);
    const {instancedata,updatedata,removeData} = useStore((state) => state)
    const [isLoading, setisLoading] = useState(false);

    const getInstance = ()=>{
      setisLoading(true)
        fetch(apilink+`/crospro`,{
          method:"post",
          headers:{
            "Content-Type":'application/json'
          },
          body: JSON.stringify({url:`https://app.wacloud.xyz/api/create_instance?access_token=${apitoken}`})
        })
        .then((res)=>res.json())
        .then(async (res)=>{
            console.log(res);
            // updatedata({...instancedata,qr:res?.qr})
            // setinstance(res);
            if(res?.instance_id){
              setinstatceID(res?.instance_id)
              await getQr(res?.instance_id)
            }else{
              setisLoading(false)
              toast.error(res?.message)
            }
            
        })
    }
    const unlinkedWA = ()=>{
      if(!window.confirm("This will logout Whatsapp web, Change Instance ID, Delete all old instance data.")){
          return 0;
      }
      setisLoading(true)
        fetch(apilink+`/crospro`,{
          method:"post",
          headers:{
            "Content-Type":'application/json'
          },
          body: JSON.stringify({url:`https://app.wacloud.xyz/api/reset_instance?instance_id=${instancedata?.info?.instance_id}&access_token=${apitoken}`})
        })
        .then((res)=>res.json())
        .then(async (res)=>{
            console.log(res);
            sessionStorage.removeItem('info')
            updatedata({qr:null,info:null})
            setinstance(null)
            setisLoading(false)
        })
    }
    

    useEffect(() => {
        // getInstance()
        // socket.on("messages",(res)=>{
        //   console.log(res);
          
        // })
        
    }, []);
    
    const getQr = (instanceId)=>{
      setinstatceID(instanceId)
      setisLoading(true)
      fetch(apilink+`/crospro`,{
        method:"post",
        headers:{
          "Content-Type":'application/json'
        },
        body: JSON.stringify({url:`https://app.wacloud.xyz/api/get_qrcode?instance_id=${instanceId}&access_token=${apitoken}`})
      })
      .then((res)=>res.json())
      .then((res)=>{
        setisLoading(false)
        console.log(res);
        
          if(res.status!=='success'){
            console.log(res);
            
            return toast.error(res?.message)
          }
          setqrurl(res?.base64)

          dataseton({...res,name:'shaki'})
          return toast.success(res?.message)
      })
    }
    const reinitiate = (instanceId)=>{
      setinstatceID(instanceId)
      setisLoading(true)
      fetch(apilink+`/crospro`,{
        method:"post",
        headers:{
          "Content-Type":'application/json'
        },
        body: JSON.stringify({url:`https://app.wacloud.xyz/api/reconnect?instance_id=${instancedata?.info?.instance_id}&access_token=${apitoken}`})
      })
      .then((res)=>res.json())
      .then((res)=>{
        setisLoading(false)
        console.log(res);
        
          if(res.status!=='success'){
            console.log(res);
            
            return toast.error(res?.message)
          }
          
          return toast.success(res?.message)
      })
    }
    const webhook = ()=>{
    
      setisLoading(true)
      fetch(apilink+`/crospro`,{
        method:"post",
        headers:{
          "Content-Type":'application/json'
        },
        body: JSON.stringify({url:`https://app.wacloud.xyz/api/set_webhook?webhook_url=https://waapi.fwa-bd.com/webhook-notice&enable=true&instance_id=${instancedata?.info?.instance_id}&access_token=${apitoken}`})
      })
      .then((res)=>res.json())
      .then((res)=>{
        setisLoading(false)
        console.log(res);
        
          if(res.status!=='success'){
            console.log(res);
            
            return toast.error(res?.message)
          }
          
          return toast.success(res?.message)
      })
    }



  useEffect(() => {
    console.log('instancedata',instancedata);
    if(instancedata?.info){
      setinstance(instancedata)
    }
    
  }, [instancedata?.info]);
  


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-700 p-8">
          <div className="grid grid-cols-2 gap-4">
          
            {/* <DashboardCard title="Instance ID" value={instance?.instances[0]?.id?instance?.instances[0]?.id:'00000'} highlight={true} isPrimary={true} /> */}
            {instance?.info?.name&&<DashboardCard title={"Current Status"} value={"Ready"} extraInfo={instance?.info?.instance_id} highlight={true} />}
            {!instance?.info?.name&&<DashboardCard title={"Current Status"} value={"No Ready"} extraInfo={'Failed'} highlight={true} />}
            {/* <DashboardCard title="Webhook Failures (today)" value="0" extraInfo="of 0 in total" />
            <DashboardCard title="Created At" value="2024-08-19 12:16:04 UTC" />
            <DashboardCard title="Type" value="Trial Instance" isPrimary={true} />
            <DashboardCard title="Expires in" value="71 hour(s)" isPrimary={true} />
            <DashboardCard title="Expires at" value="2024-08-22 12:16:04 UTC" isPrimary={true} /> */}
          </div>
            
          {!instance?.info?.name&&<div className="mt-8">
            <Qrcodeinfo loading={isLoading} getQr={getInstance} qrurl={qrurl} instatceID={instatceID}/>
            
          </div>}
         
    
          {instance?.info?.name&&<div className="mt-8">
            <PhoneInfoCard name={instance?.info?.name} phoneNumber={instance?.info?.number} /><br></br>
          </div>}

          {instance?.info?.name&&<div className="mt-8 flex flex-wrap">
            {/* <div onClick={unlinkedWA} className='border m-1 cursor-pointer bg-red-600 space-x-2 text-red-200 w-fit px-2 py-1 rounded-md flex items-center'>
                <span><FontAwesomeIcon icon={faPowerOff} /></span> <span>Unlinked Whatsapp Account</span>
            </div> */}
            {!isLoading?<div onClick={reinitiate} className='border m-1 cursor-pointer bg-blue-600 space-x-2 text-blue-200 w-fit px-2 py-1 rounded-md flex items-center'>
                <span><FontAwesomeIcon icon={faRefresh} /></span> <span>Re-Connect Whatsapp Account</span>
            </div>:<p>Loading...</p>}
            {/* <div onClick={webhook} className='border m-1 cursor-pointer bg-lime-600 space-x-2 text-blue-200 w-fit px-2 py-1 rounded-md flex items-center'>
                <span><FontAwesomeIcon icon={faRefresh} /></span> <span>webhook</span>
            </div> */}
          </div>}


          {/* <div className="mt-8">
            <WhatsAppMessageSender />
          </div> */}
        </div>
      );
}
