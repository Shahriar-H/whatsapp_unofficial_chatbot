import { useEffect, useState } from "react";
import { apilink, useStore } from "../../lib";
import toast from "react-hot-toast";

const useGethistory = ()=>{
    const [data, setdata] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {instancedata} = useStore((state)=>state)

    const get_history = ()=>{
        try {
          setisLoading(true)
          fetch(apilink+"/db/history",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            }
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
          get_number()
        }
        
    }, [instancedata?.info?.wid?.user]);

    return {data,get_history}
}

export default useGethistory