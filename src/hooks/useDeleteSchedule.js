import { useEffect, useState } from "react";
import { apilink, useStore } from "../../lib";
import toast from "react-hot-toast";

const useDeleteSchedule = ()=>{
    const [data, setdata] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {instancedata} = useStore((state)=>state)

    const delete_schedule = (id)=>{
        try {
          setisLoading(true)
          fetch(apilink+"/db/delete-schedule",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({id})
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


    return {delete_schedule}
}

export default useDeleteSchedule