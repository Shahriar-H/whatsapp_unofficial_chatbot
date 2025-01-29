import { useEffect, useState } from "react";
import { apilink, useStore } from "../../lib";
import toast from "react-hot-toast";

const useUpdateitemcrm = ()=>{
    const [data, setdata] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {instancedata} = useStore((state)=>state)

    const update_itemcrm = (data)=>{
        //{data,table,id}
        try {
          setisLoading(true)
          fetch(apilink+"/db/update-itemerm",{
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


    return {update_itemcrm}
}

export default useUpdateitemcrm