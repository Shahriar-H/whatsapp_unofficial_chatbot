import { faBoxOpen, faCheck, faCheckDouble, faClock, faMessage, faPhotoFilm, faRefresh, faTimesCircle, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { apilink, imageLink, localapi, Phone_Id, WA_token } from '../../lib';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';
import Addimage from '../Components/Addimage';
const socket = io(apilink);

const ChatComponent = () => {
    const [allNumbers, setallNumbers] = useState([]);
    const [allConversation, setallConversation] = useState([]);
    const [userPecificConverstion, setuserPecificConverstion] = useState({});
    const [selectedConverstion, setselectedConverstion] = useState([]);
    const [selectUserNumber, setselectUserNumber] = useState('');
    const [message, setmessage] = useState('');
    const [isSendingsingle, setisSendingsingle] = useState(false);
    const [isGettheSocet, setisGettheSocet] = useState(0);
    const messagesEndRef = useRef(null);
    const [lasMessageFrom, setlasMessageFrom] = useState('');
    const [isReloading, setisReloading] = useState(false);
    const [selectedImage, setselectedImage] = useState(null);
    const [showMedia, setshowMedia] = useState(false);
    const [isVideo, setisVideo] = useState(false);



  useEffect(() => {
    const ext = selectedImage?.split(".")[1]
   
    if(ext==='mp4'){
      console.log("true",ext);
      setisVideo(true)
    }else{
      console.log("false",ext);
      setisVideo(false)
    }
    
    
  }, [selectedImage]);

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom(); // Scroll to the bottom on component mount or update
    }, [selectUserNumber,isGettheSocet]);

    const reorderTheConversation = (number)=>{
      let previousData = {...userPecificConverstion};
      let data = JSON.parse(JSON.stringify(userPecificConverstion));
      // console.log('previousData',previousData);
      delete data[number]
      // console.log("Porer",previousData);
      
      // console.log({[number]:previousData[number],...data});
      setuserPecificConverstion({[number]:previousData[number],...data})
    }

    const update_item = (senderNumber)=>{
      //{data,table,query}
      try {
       
        fetch(apilink+"/db/updatemessage",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({data:{iread:true},table:"wa_messages",query:{$or:[{senderId:senderNumber},{receiverId:senderNumber}]}})
        })
        .then((res)=>res.json())
        .then((result)=>{
          console.log(result);
          
          if(result?.status!==200){
            return toast.error(result?.message);
          }
          getconverstion()
          
        })
      } catch (error) {
        toast.error("Error");
        console.log(error);
        
      }
    }

    useEffect(() => {
        // getInstance()
        socket.on("messages",(res)=>{
          console.log('message res',res);
          
          if(res?.entry[0]?.changes[0]?.value&&
            res?.entry[0]?.changes[0]?.value?.messages&&
            res?.entry[0]?.changes[0]?.value?.messages[0]&&
            res?.entry[0]?.changes[0]?.value?.messages[0]?.from){
            const senderNumber= res.entry[0].changes[0].value.messages[0]?.from;
            
            setlasMessageFrom(senderNumber)
            
            
          }
          
          getconverstion()
          // getNumbers()
          setisGettheSocet((prev)=>prev+1)
          scrollToBottom();
        })
        
    }, []);

    useEffect(() => {
      reorderTheConversation(lasMessageFrom)
      console.log("lasMessageFrom",lasMessageFrom);
      
    }, [lasMessageFrom,userPecificConverstion[lasMessageFrom]]);

    const getconverstion = ()=>{
        fetch(apilink+"/db/getconversations",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({senderId:"8801303954432",receiverId:Phone_Id}),
        })
        .then(res=>res.json())
        .then((result)=>{
            console.log("Converstions- ",result);
            setallConversation(result?.result)
        })
    }
    const getNumbers = ()=>{
        fetch(apilink+"/db/numbers",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({query:{host:""}}),
        })
        .then(res=>res.json())
        .then((result)=>{
            console.log("Numbers-",result?.result);
            
            if(result?.status!==200){
                return toast(result?.message);
            }
            setallNumbers(result?.result)
        })
    }
    useEffect(() => {
        // getNumbers()
        getconverstion()
    }, []);
    
    const findSpecificCoverstion = ()=>{
        let specificConverstion = {}
        // console.log('senderNumbers',senderNumbers);
        
        allNumbers?.map((number)=>{
            const myconversation = allConversation.filter((converstion)=>{
                
                if(converstion.senderId===number || converstion.receiverId===number){
                    return converstion
                }
            })
            //update the selected state
            if(selectUserNumber===number){
                setselectedConverstion(myconversation)
            }

            //specific state get populated if only one message is exist
            if(myconversation.length>0){
                specificConverstion={...specificConverstion,[number]:myconversation}
            }
            
        })
        console.log("Specific Conver-",specificConverstion);
        setuserPecificConverstion(specificConverstion)
        
    }

    useEffect(() => {
        //call findSpecificCoverstion when number and conversation exist
        if(allNumbers[0] && allConversation[0]){
            findSpecificCoverstion()
        }
    }, [allNumbers[0], allConversation[0]]);

    const findTheUniqueUserFromCOnverstion = ()=>{
      const ConversationUser = [];
        if(allConversation[0]){
          allConversation.map((item)=>{
            if(item?.senderId===Phone_Id || item?.receiverId===Phone_Id){
              if(item?.senderId!==Phone_Id){
                ConversationUser.push(item?.senderId)
              }
              if(item?.receiverId!==Phone_Id){
                ConversationUser.push(item?.receiverId)
              }
            }
            
            
          })
          let unique = ConversationUser.filter((item, i, ar) => ar.indexOf(item) === i);
          console.log("Unique",unique);
          
          setallNumbers(unique)
        }
    }


    useEffect(() => {
      findTheUniqueUserFromCOnverstion()
    }, [allConversation[0]]);

    useEffect(() => {
        //when socket appered call this
        findSpecificCoverstion()
    }, [isGettheSocet]);

    useEffect(() => {
      //if enter in message update all the message to read
      if(selectUserNumber){
        update_item(selectUserNumber)
      }
      
    }, [selectUserNumber]);

    const saveMessage = (data)=>{
        //save sms into db
        fetch(apilink+"/db/saveMessage",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({...data,iread:true, link: selectedImage?imageLink + selectedImage:undefined})
        })
        .then((res)=>res.json())
        .then((result)=>{
          toast.success(result?.message)
        })
    }

    const sendImageMessage = async () => {
      try {
        const response = await axios({
          method: 'POST',
          url: `https://graph.facebook.com/v20.0/373281909212162/messages`,
          headers: {
            'Authorization': `Bearer ${WA_token}`,
            'Content-Type': 'application/json',
          },
          data: {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: selectUserNumber,
            type: 'image',
            image: {
              link: IMAGE_URL,
            },
          },
        });
        console.log('Image message sent:', response.data);
      } catch (error) {
        console.error('Error sending image message:', error.response ? error.response.data : error.message);
      }
    };

    const sendByexios = async ()=>{
        setisSendingsingle(true);
        const data = await axios({
          method: "POST",
          url: `https://graph.facebook.com/v21.0/${Phone_Id}/messages`,
          data: {
              messaging_product: "whatsapp",
              to: selectUserNumber,
              
              text: {
                body: message,
              }
          },
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${WA_token}`
          }
      });
      console.log(data);
      setmessage('')
      setisSendingsingle(false);
      saveMessage({
        senderId:Phone_Id,
        receiverId:selectUserNumber,
        message:message,
        timestamp: new Date(),
        status:'sent',
        messageId:data?.data?.messages[0]?.id
      })
      setselectedConverstion((prev)=>[...prev,{
        senderId:Phone_Id,
        receiverId:selectUserNumber,
        message:message,
        timestamp: new Date(),
        status:'sent',
        messageId:data?.data?.messages[0]?.id
      }])
      
      
    }
    const sendByexiosWithImage = async ()=>{
        setisSendingsingle(true);
        const data = await axios({
          method: "POST",
          url: `https://graph.facebook.com/v21.0/${Phone_Id}/messages`,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: selectUserNumber,
            type: isVideo?"video":"image",
            [isVideo?"video":"image"]: {
              link: imageLink + selectedImage,
              caption:message
            },
          },
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${WA_token}`
          }
      });
      console.log(data);
      setmessage('')
      setisSendingsingle(false);
      saveMessage({
        senderId:Phone_Id,
        receiverId:selectUserNumber,
        message:message,
        timestamp: new Date(),
        status:'sent',
        messageId:data?.data?.messages[0]?.id
      })
      setselectedConverstion((prev)=>[...prev,{
        senderId:Phone_Id,
        receiverId:selectUserNumber,
        message:message,
        timestamp: new Date(),
        status:'sent',
        messageId:data?.data?.messages[0]?.id
      }])
      
      
    }
    const reloadChat = async ()=>{
      setisReloading(true)
      await getconverstion()
      setTimeout(() => {
        setisReloading(false)
      }, 1000);
    }

    const selectImageFun = (img) => {
      setselectedImage(img);
    };

    const checkFileExtension = (file) => {
      let ext = file?.split('.')
      ext = ext[ext.length - 1]
      
      
      if (ext === 'mp4') {
        return 'video'
      } else {
        return 'image'
      }
    };

  

    
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-700">
      {/* Sidebar */}
      <div className="flex flex-row h-[500px]">
        <div className="w-1/3 bg-gray-50 border-r overflow-auto">
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between border-b w-full bg-white dark:bg-gray-700">
            <div className='flex items-center space-x-2'>
              <div className="rounded-full bg-green-200 w-10 h-10 flex justify-center items-center">
                  <FontAwesomeIcon color='green' icon={faMessage} />
              </div>
              <h3 className="text-lg font-bold">Chats</h3>
            </div>
            <div className="ml-4 flex justify-between items-center">
              
              <h3 onClick={reloadChat} className="text-lg cursor-pointer font-bold">
                <FontAwesomeIcon icon={faRefresh} />
              </h3>

            </div>
          </div>
          {/* Chat List */}
          <div className="overflow-scroll h-[500px] bg-white dark:bg-gray-700">
            {isReloading&&<p className='text-center bg-red-200 text-red-500 text-xs p-1'>Reloading</p>}
            {userPecificConverstion&&Object.keys(userPecificConverstion).map((number)=>{
              if(userPecificConverstion[number]){
             
                return <div onClick={()=>{setselectedConverstion(userPecificConverstion[number]);setselectUserNumber(number)}} className="p-4 border-b hover:bg-gray-100 dark:hover:bg-black cursor-pointer">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                        <div className="rounded-full bg-green-200 w-10 h-10 flex justify-center items-center">
                            <FontAwesomeIcon color='green' icon={faUserAlt} />
                        </div>
                        <div className="ml-4">
                            <p className="font-bold">{number}</p>
                            <p className={`text-gray-500 ${!userPecificConverstion[number][userPecificConverstion[number]?.length-1]?.iread&&"font-semibold text-gray-800 dark:text-gray-100"}`}>
                              
                              {userPecificConverstion[number][userPecificConverstion[number]?.length-1]?.message.substr(0,30)}...
                            </p>
                            
                        </div>
                        </div>
                        <span className="text-xs text-gray-400"></span>
                    </div>
                    </div>
              }
            })}
            
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 bg-gray-50 dark:bg-gray-600 flex flex-col justify-between">
          {/* Chat Header */}
          <div className="p-4 bg-white dark:bg-gray-700 border-b flex items-center">
            <div className="rounded-full bg-green-200 dark:bg-gray-800 w-10 h-10 flex justify-center items-center">
                <FontAwesomeIcon color='green' icon={faUserAlt} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">{selectUserNumber??"Select User"}</h3>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="flex flex-col items-start space-y-4 w-full">
                {!selectUserNumber&&<div className='w-full h-48 flex justify-center items-center'>
                    <div className='text-gray-500 text-center'>
                        <p className='text-5xl'><FontAwesomeIcon icon={faBoxOpen} /></p>
                        <p>Select User from left bar</p>

                    </div>
                </div>}
              {selectedConverstion&&selectedConverstion?.map((item,index)=>{
                
                return <div className={`flex ${selectUserNumber===item?.senderId?"justify-start":"justify-end"} w-full`}>
                    <div className="bg-green-100 dark:bg-gray-800 rounded-lg p-2 min-w-40 max-w-96">
                        {item?.link&&checkFileExtension(item?.link)==='image'&&<img className='' src={item?.link} />}
                        {item?.link&&checkFileExtension(item?.link)==='video'&& <>
                        <video className='w-full h-[200px]' controls>
                          <source src={item?.link} type="video/mp4" />
                        </video></> }
                        {/* {item?.media_url&&<img className='' src={item?.media_url} />} */}
                        <p>{item?.message}</p>
                        <p className='flex justify-between items-center'>
                            <p className='text-[12px] text-gray-600'>{moment(item?.created_at).fromNow()}</p>
                            {selectUserNumber!==item?.senderId&&<p className='text-[12px] text-gray-500 text-right'>{
                            item?.status==='delivered'?<FontAwesomeIcon icon={faCheckDouble} size={10} />:
                            item?.status==='sent'?<FontAwesomeIcon icon={faCheck} size={10} />:
                            item?.status==='read'?<FontAwesomeIcon icon={faCheckDouble} color={'#05e1d6'} size={10} />:item?.status==='failed'?<FontAwesomeIcon icon={faTimesCircle} color={'#ef1d1d'} size={10} />:
                            <FontAwesomeIcon icon={faClock} size={10} />
                            }</p>}
                        </p>
                    </div>
              </div>
              })}
              <div ref={messagesEndRef}></div>
            </div>
          </div>
          {showMedia&&<div className="fixed shadow-lg p-5 z-50 bg-white lg:w-[40%] h-72 overflow-y-auto ">
            <Addimage selectImageFun={selectImageFun} />
          </div>}
          {/* Message Input */}
          {selectUserNumber&&<div className="p-4 bg-white dark:bg-gray-700 border-t flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              value={message}
              onChange={(v)=>setmessage(v.target.value)}
            />
            <button onClick={selectedImage?sendByexiosWithImage:sendByexios} disabled={isSendingsingle} className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg">{isSendingsingle?"...":'Send'}</button>
            <button onClick={()=>setshowMedia((prev)=>!prev)} disabled={isSendingsingle} className="ml-1 px-1 py-1 text-white rounded-lg">
              {!selectedImage&&<FontAwesomeIcon icon={faPhotoFilm} color='gray' />}
              {selectedImage&&<img src={imageLink+selectedImage} className='h-6 w-6' />}
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
