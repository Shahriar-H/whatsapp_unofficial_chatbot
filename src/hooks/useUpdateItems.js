import { useEffect, useState } from "react";
import { apilink, useStore } from "../../lib";
import toast from "react-hot-toast";

const useUpdateitem = ()=>{
    const [data, setdata] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {instancedata} = useStore((state)=>state)

    const update_item = (data)=>{
        //{data,table,id}
        try {
          setisLoading(true)
          fetch(apilink+"/db/update-item",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
          })
          .then((res)=>res.json())
          .then((result)=>{
            if(result?.status!==200){
              return toast.error(result?.message);
            }
            toast.success(result?.message);
          })
        } catch (error) {
          toast.error("Error");
          // console.log(error);
          
        } finally{
          setisLoading(false)
        }
        
    }


    return {update_item}
}

export default useUpdateitem