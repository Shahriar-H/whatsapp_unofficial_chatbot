// src/components/PhoneInfoCard.js
import { faCheck, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import {QRCodeSVG} from 'qrcode.react';

import { useGetinstance } from '../hooks/useGetinstance';
import { apilink, apitoken, useStore } from '../../lib';

import { io } from "socket.io-client";
import { info } from 'autoprefixer';
import toast from 'react-hot-toast';
const socket = io("ws://103.112.62.216:3028", {
    transports: ['websocket', 'polling'],
  });
socket.connect()

const qrCodeData = "2@GOz2Y6WIU3qiOPsZ0HGSNGRnNrmYedEeNHJZtCXfsBjPnEfBdJW0u/v5kfpjd7MN6VtbkEvkYGalPz5jhQ030cVLOBBQ4E/9zF8=,d3yIB0BEPChJSo8N3GGfqmg1A6Gx1aR0bvfQPsvLMkg=,u88CBocEr/4y6qz0aFBL/GdbFwg6du2TLiKdfojFsUw=,Wn/O6ZWRXYR0sbHC8tYxOeLUrwOqSh4yOo1KCzB8PTg=,1";

const Qrcodeinfo = ({getQr,qrurl,loading,instatceID}) => {
    const {data,dataseton} = useGetinstance()
    const [qrlink, setqrlink] = useState(null);
    const datainstance = useStore((state) => state.instance)
    const [name, setname] = useState('Shariar');
    const [number, setnumber] = useState('01771973925');
    const {instancedata,updatedata,removeData} = useStore((state) => state)
    const [isLoading, setisLoading] = useState(false)
    const [allData, setallData] = useState({});
    
    const emmitFun = ()=>{
        getQr()
        console.log('data',datainstance);
        
        // socket.emit("hello", "world", (response) => {
        //     console.log(response); // "got it"
        // });
    }
    useEffect(() => {
        socket.on("waready",(arg)=>{
            console.log(arg);
            // dataseton(arg)
            if(arg?.isready){
                setupComplete()
            }

        })
        
    }, []);

    const setupComplete = ()=>{
        
        if(!name || !number){
            return toast.error("Enter Correct Value");
        }
        setisLoading(true)
        fetch(apilink+"/db/find-user",{
            method:"POST",
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify({number:number})
        })
        .then((res)=>res.json())
        .then((result)=>{
            setisLoading(false)
            if(result?.status!==200){
                return toast.error(result?.message)
            }
            if(result?.result<1){
                return toast.error("Number Not matched")
            }
            result=result?.result[0]
            console.log(result);
            setqrlink(result?.qr)
            // return 0
            updatedata({...instancedata,qr:qrurl,info:{name,number,instance_id:result?.instance_id}})
            setallData(result)

            sessionStorage.setItem('info', JSON.stringify({name,number,instance_id:result?.instance_id}));

            // window.location.href = apilink+"/"+result?.instance_id+"/start"

        })
        
    }
    return (
        <div className="p-4 bg-white dark:bg-gray-900 shadow-md rounded-lg">
            <div className='flex items-center space-x-3'>

                {/* {!qrurl&&<div onClick={emmitFun} className='border cursor-pointer bg-green-600 space-x-2 text-green-200 w-fit px-2 py-1 rounded-md flex items-center'>
                    <span><FontAwesomeIcon icon={faQrcode} /></span> <span>{loading?"Initializing...":'Setup Start'}</span>
                </div>} */}
                
            </div>
            {
                    <div>
                        <p>Name: {instancedata?.info?.name}</p>
                        <p>Phone: {instancedata?.info?.number}</p>
                        <p>Instance ID: {instancedata?.info?.instance_id}</p>
                    </div>
                }
            {!instancedata?.info&&<div className='flex justify-between'>
                <div className="ml-4 mt-3">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Steps-</h2>
                    <p className="text-gray-500 dark:text-gray-400">1. Click on <b>Get QR</b> Button</p>
                    <p className="text-gray-500 dark:text-gray-400">2. Go to Whatsapp in your phone</p>
                    <p className="text-gray-500 dark:text-gray-400">3. Click on Three dot button and find Click on <b>Linked Device</b> </p>
                    <p className="text-gray-500 dark:text-gray-400">4. Click on <b>Link a Device</b> </p>
                    <p className="text-gray-500 dark:text-gray-400">5. Scan the QR code </p>
                    <p className="text-gray-500 dark:text-gray-400">6. If new device linked on your WA app then click the button below. </p>
                    <div className='mt-2  p-3 rounded-md border'>
                        {/* <input value={name} onChange={(v)=>setname(v.target.value)} required placeholder='Account Name' className='p-1 rounded-md border-2 border-gray-200' />
                        <input value={number} onChange={(v)=>setnumber(v.target.value)} required placeholder='Whatsapp Number' className='p-1 mx-1 rounded-md border-2 border-gray-200' /> */}
                        <div onClick={getQr} className='border mt-3 cursor-pointer bg-blue-600 space-x-2 text-green-200 w-fit px-2 py-1 rounded-md flex items-center'>
                            <span><FontAwesomeIcon icon={faCheck} /></span> <span>{isLoading?"Initializing...":'Get QR'}</span>
                        </div>
                        {/* <a className='text-white' href={apilink+"/661122334455/start"}>Get Qr Code</a> */}
                    </div>
                </div>

                {qrurl&&<div>
                    <div className='border p-1 bg-white'>
{/*                   
                    <p className='bg-green-300 border rounded-md p-1 text-center'>{'instatceID'}</p> */}
                    {/* <img src={qrlink} /> */}
                    {!isLoading&&<QRCodeSVG value={qrurl} size={200} />}
                    </div>
                </div>}
                
            </div>}
            
        </div>
    );
};

export default Qrcodeinfo;
