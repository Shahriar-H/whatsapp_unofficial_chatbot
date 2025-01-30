import React, { useEffect, useState } from 'react'
import { apilink, apilinkAlt, imageLink, Phone_Id } from '../../lib'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faVideo } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';


export default function Addimage({selectImageFun}) {
    const [file, setfile] = useState(null);
    const [isUploading, setisUploading] = useState(false);
    const [allimages, setallimages] = useState();
    const [selectedImage, setselectedImage] = useState('');
    useEffect(() => {
        selectImageFun(selectedImage)
    }, [selectedImage]);
    const uploadImage = ()=>{
        if(!file){
          return toast.error("No File Selected")
        }
        setisUploading(true)
        let data = new FormData()
        data.append("file",file)
        data.append("phone_id", Phone_Id);
    
        fetch(apilinkAlt+"/api/upload-image",{
          method:"POST",
          body: data,
        })
        .then((res)=>res.json())
        .then((result)=>{
          console.log(result);
          setisUploading(false)
          if(result?.status!==200){
            return toast.error(result.message)
          }
          setfile(null)
          getImages()
          toast.success(result.message)
        })
      }
      const getImages = ()=>{
        
        setisUploading(true)
        
    
        fetch(apilink+"/db/get-item",{
          method:"POST",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({query:{host:Phone_Id},table:"images"})
        })
        .then((res)=>res.json())
        .then((result)=>{
          setisUploading(false)
          if(result?.status!==200){
            return toast.error(result.message)
          }
          console.log(result,"Images");
          
          setallimages(result?.result)
         
        })
      }
      const deleteImages = (image)=>{
        if(!window.confirm("Are you sure?")){
          return 0;
        }
        setisUploading(true)
        setselectedImage('')
    
        fetch(apilinkAlt+"/db/delete-image",{
          method:"POST",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({image})
        })
        .then((res)=>res.json())
        .then((result)=>{
          setisUploading(false)
          if(result?.status!==200){
            return toast.error(result.message)
          }
          setselectedImage('')
         getImages()
        })
      }
      useEffect(() => {
        getImages()
      }, []);
  return (
    <div className='w-full'>
        <div className='flex justify-between'>
            <input type='file' onChange={(v)=>setfile(v.target.files[0])} className='p-1 w-2/3 border rounded-md' />
            <input onClick={uploadImage} disabled={isUploading} type='submit' value={isUploading?"Wait...":'Upload'} className=' bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300' />
            {selectedImage&&<p className=' bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300' onClick={()=>deleteImages(selectedImage)}><FontAwesomeIcon icon={faTrash} /></p>}
        </div>
        <p className='text-xs p-1'>My Images-</p>
        <div className='flex justify-start flex-wrap'>
            
            {!allimages&&<p className='text-xs'>Loading...</p>}
            {
            allimages&&allimages.map(({image},index)=>{
                return image.split('.')[1]!='mp4'?<img key={index} onClick={()=>setselectedImage(image)} src={imageLink+image} className={`h-12 w-12 m-1 rounded border ${image===selectedImage&&"border-2 border-red-700"}`} />:
                <div onClick={()=>setselectedImage(image)} className={`h-12 flex justify-center items-center w-12 m-1 text-4xl rounded border ${image===selectedImage&&"border-2 border-green-500"}`}><FontAwesomeIcon icon={faVideo} /></div>
            })
            }
            
        </div>
      <button onClick={()=>setselectedImage('')} className='p-1 bg-red-300 mt-3 text-xs text-red-500'>Un Select</button> 
    </div>
  )
}
