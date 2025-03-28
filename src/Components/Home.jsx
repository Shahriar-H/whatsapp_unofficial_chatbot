import React, { useEffect, useState } from "react";
import PhoneNumberSelector from "./Multiplenumber";
import { apilink, apitoken, imageLink, useStore, WA_token } from "../../lib";
import useGetnumbers from "../hooks/useGetnumbers";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Addimage from "./Addimage";
import axios from "axios";
// import SocketIOClient, { io } from "socket.io-client";
// const socket = io("https://waapi.fwa-bd.com");

export default function Home() {
  const [allphonenumbers, setallphonenumbers] = useState([]);
  const [singlesender, setsinglesender] = useState();
  const [isMultiple, setisMultiple] = useState(false);
  const [messageingStarted, setmessageingStarted] = useState(false);
  const [history, sethistory] = useState([]);
  const { data, get_number } = useGetnumbers();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isSendingsingle, setisSendingsingle] = useState(false);
  const { instancedata, updatedata, removeData } = useStore((state) => state);
  const [file, setfile] = useState(null);
  const [isUploading, setisUploading] = useState(false);
  const [allimages, setallimages] = useState();
  const [selectedImage, setselectedImage] = useState(null);
  const [isVideo, setisVideo] = useState(false);
  const [sendingInterval, setsendingInterval] = useState(20);

  // useEffect(() => {
  //   // getInstance()
  //   socket.on("messages", (res) => {
  //     console.log(res);
  //   });
  // }, []);



  const getallphonenumbers = (numbers) => {
    setallphonenumbers(numbers);
    setisMultiple(true);
    console.log(numbers);
  };
  const [message, setmessage] = useState("");
  //clear the multiple array
  //when its single message
  useEffect(() => {
    if (!isMultiple) {
      setallphonenumbers([]);
    }
  }, [isMultiple]);

  // const sendsinglemesssage = () => {
  //   try {
  //     if (!singlesender || !message) {
  //       return alert("Fill all input");
  //     }
  //     if (singlesender.length !== 13) {
  //       return toast.error("Country Code not");
  //     }
  //     console.log(singlesender.length);

  //     console.log(instancedata?.info?.instatce_id);

  //     setisSendingsingle(true);
  //     fetch(apilink + `/postproc`, {
  //       method: "post",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         url: `https://app.wacloud.xyz/api/send`,
  //         options: JSON.stringify({
  //           number: singlesender,
  //           type: "media",
  //           message: message,
  //           media_url: selectedImage ? imageLink + selectedImage : null,
  //           instance_id: instancedata?.info?.instance_id,
  //           access_token: apitoken,
  //         }),
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         console.log(res);
  //         setisSendingsingle(false);
  //         if (res.status !== "success") {
  //           return toast.error("Not Send");
  //         }
  //         toast.success("Send Success!");
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     setisSendingsingle(false);
  //   }
  // };

  // const sendmesssage = async (number) => {
  //   if (number.length !== 13) {
  //     sethistory((prev) => [...prev, { number: number, status: "Not Sent" }]);
  //     return toast.error("Country Code not");
  //   }
  //   if (!number) {
  //     sethistory((prev) => [...prev, { number: number, status: "Not Sent" }]);
  //     return 0;
  //   }
  //   try {
  //     const response = await fetch(apilink + `/postproc`, {
  //       method: "post",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         url: `https://app.wacloud.xyz/api/send`,
  //         options: JSON.stringify({
  //           number: number,
  //           type: "media",
  //           message: message,
  //           media_url: selectedImage ? imageLink + selectedImage : null,
  //           instance_id: instancedata?.info?.instance_id,
  //           access_token: apitoken,
  //         }),
  //       }),
  //     });
  //     const result = await response.json();

  //     if (result?.status === "success") {
  //       sethistory((prev) => [...prev, { number: number, status: "Sent" }]);
  //     } else {
  //       sethistory((prev) => [...prev, { number: number, status: "Not Sent" }]);
  //     }
  //   } catch (error) {
  //     sethistory((prev) => [
  //       ...prev,
  //       { number: number, status: "Sent", isError: error },
  //     ]);
  //     console.log(error);
  //   }
  // };
  // const client = new Client({ 
  //   puppeteer: { 
  //     headless: true,
  //     args: ['--no-sandbox', '--disable-setuid-sandbox']
  //   }, 
  //   session: sessionCfg 
  // });
  const sendMessage = ()=>{
    try {
      fetch(apilink+"/message",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({phoneNumber:singlesender,message:message, mediaUrl:selectedImage?imageLink+selectedImage:null})
      })
      .then((res)=>res.json())
      .then((result)=>{
        console.log(result);
        
      })
    } catch (error) {
      
    }
  }
  const sendMessageOnMultiLavel = async (numberis)=>{
    try {
      const response = await fetch(apilink+"/message",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({phoneNumber:numberis,message:message, mediaUrl:selectedImage?imageLink+selectedImage:null})
      })
      const result = await response.json()
     
        console.log(result);
        
        
      
    } catch (error) {
      // sethistory((prev)=>[...prev,{number:numberis,status:'Failed',error:error?.message}])
    }
  }

  const sendMultiplemesssage = async () => {
    sethistory([]);
  
    if (!message) {
      alert("No Message Initiated!");
      return;
    }
  
    setmessageingStarted(true);
    setisModalOpen(true);
  
    try {
      for (const number of allphonenumbers) {
        await sendMessageOnMultiLavel(number); // Send message
        await new Promise(resolve => setTimeout(resolve, 1000*sendingInterval)); // Wait for 3s
        sethistory((prev)=>[...prev,{number:number,status:'send',error:"No Error"}])
      }
    } catch (error) {
      console.log(error);
    } finally {
      setmessageingStarted(false);
    }
  };
  

  const selectImageFun = (img) => {
    setselectedImage(img);
  };


  if(instancedata?.subscriptionexpired===false){
    return <div className="text-center">
      <p>Your Subscription has Expired</p>
    </div>
  }
  return (
    <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
     
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-4">
        Send a WhatsApp Message{" "}
        {selectedImage && (
          <span
            className="text-red-500 text-sm cursor-pointer"
            onClick={() => setselectedImage("")}
          >
            Unselect Image
          </span>
        )}
      </h3>
      {isModalOpen && (
        <div className="fixed z-50 top-0 left-0 w-full h-screen bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white cursor-pointer dark:bg-black p-4 w-1/2 rounded h-3/4 overflow-auto">
            {(
              <p
                onClick={() => {
                  setisModalOpen(!isModalOpen);
                  setmessageingStarted(false);
                }}
                className="p-1 mb-1 bg-red-400 w-fit text-white rounded-sm text-sm"
              >
                Finish
              </p>
            )}
            {history?.length !== allphonenumbers?.length && (
              <p className="p-1 mb-1 bg-green-400 w-fit text-white rounded-sm text-sm">
                SENDING...
              </p>
            )}
            <table className="w-full p-3 border">
              <thead>
                <tr className="border">
                  <th className="border p-1">#</th>
                  <th className="border p-1">Number</th>
                  <th className="border p-1">Status</th>
                  <th className="border p-1">Error</th>
                </tr>
              </thead>
              <tbody>
                {history &&
                  history.map((item, index) => {
                    return (
                      <tr key={index} className="border">
                        <td className="border p-1">{index + 1}</td>
                        <td className="border p-1">{item?.number}</td>
                        <td className="border p-1">{item?.status}</td>
                        <td className="py-3 px-6 text-left">
                        {item?.error}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Message Form */}
      <div className="flex justify-between">
        <div className="space-y-4 w-full lg:w-3/5">
          <div className="flex space-x-2 items-center">
            <label className="block text-gray-600 dark:text-gray-400">
              Message to Single/Multiple No.:
            </label>
            <input
              className="h-5 w-5"
              type="radio"
              onClick={() => setisMultiple(false)}
              checked={!isMultiple}
              name="messagetype"
              value={"single"}
            />{" "}
            <span>Single</span> <br></br>
            <input
              type="radio"
              className="h-5 w-5"
              onClick={() => setisMultiple(true)}
              checked={isMultiple}
              name="messagetype"
              value={"multiple"}
            />{" "}
            <span>Multiple</span> <br></br>
            <div>
              <select className="p-2 rounded" defaultValue={20} onChange={(v)=>setsendingInterval(v.target.value)}>
                <option disabled>Time Interval {sendingInterval}</option>
                <option value={10}>10 sec</option>
                <option value={20}>20 sec</option>
                <option value={30}>30 sec</option>
                <option value={40}>40 sec</option>
                <option value={50}>50 sec</option>
                <option value={60}>60 sec</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-400">
              Phone Number:
            </label>
            {isMultiple && (
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+8801234567890"
                required={isMultiple}
                value={!isMultiple ? allphonenumbers[0] : allphonenumbers}
                disabled={isMultiple}
                onChange={(v) => setallphonenumbers(v.target.value)}
              />
            )}
            {!isMultiple && (
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+8801234567890"
                required={!isMultiple}
                value={singlesender}
                disabled={isMultiple}
                onChange={(v) => setsinglesender(v.target.value)}
              />
            )}
          </div>
          <div>
            <input
              placeholder="Select Media"
              type="text"
              disabled={true}
              value={selectedImage}
              className="p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-400">
              Message: 
            </label>
            <textarea
              value={message}
              onChange={(v) => setmessage(v.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your message here"
              required
            ></textarea>
            {message?.length<=1000?<p className="text-xs text-green-500">{message?.length}/1000</p>:
            <p className="text-xs text-red-500">{message?.length}/1000 WA does not support mor then 1000 Characters</p>
            }
          </div>

          <div>
            {!isMultiple && (
              <button
                onClick={sendMessage}
                type="submit"
                disabled={isSendingsingle}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                {isSendingsingle ? "Sending..." : "Send Single Message"}
              </button>
            )}
            {isMultiple && (
              <button
                type="submit"
                disabled={messageingStarted}
                onClick={sendMultiplemesssage}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                {messageingStarted ? "Please Wait" : "Send Multiple Message"}
              </button>
            )}
          </div>
        </div>
        <div className="w-full p-1 lg:w-[40%] h-72 overflow-y-auto ">
          <Addimage selectImageFun={selectImageFun} />
        </div>
      </div>

      <br></br>

      {isMultiple && (
        <PhoneNumberSelector getallphonenumbers={getallphonenumbers} />
      )}
    </div>
  );
}
