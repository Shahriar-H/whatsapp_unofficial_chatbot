import { useEffect, useState } from "react";
import { apilink, useStore } from "../../lib";
import toast from "react-hot-toast";

const useSectors = ()=>{
    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const {instancedata} = useStore((state)=>state)

    const get_sectors = (sectors='')=>{
        try {
          setisLoading(true)
          fetch(apilink+"/db/getsector",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({sectors})
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
          get_sectors()
        }
        
    }, [instancedata?.info?.wid?.user]);

    return {data,get_sectors}
}

export default useSectors