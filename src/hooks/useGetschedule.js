import { useEffect, useState } from "react";
import { apilink, Phone_Id, useStore } from "../../lib";
import toast from "react-hot-toast";

const useGetschedule = ()=>{
    const [data, setdata] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {instancedata} = useStore((state)=>state)

    const get_schedule = ()=>{
        try {
          setisLoading(true)
          fetch(apilink+"/db/get-item",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({query:{host:Phone_Id},table:"schedule"})
          })
          .then((res)=>res.json())
          .then((result)=>{
            if(result?.status!==200){
              return toast.error(result?.message);
            }
            console.log(result?.result);
            
            setdata(result?.result)
          })
        } catch (error) {
          toast.error("Error");
          // console.log(error);
          
        } finally{
          setisLoading(false)
        }
        
    }

    useEffect(() => {
        if(instancedata?.info?.wid?.user){
          get_schedule()
        }
        
    }, [instancedata?.info?.wid?.user]);

    return {data,get_schedule}
}

export default useGetschedule