import { useEffect, useState } from "react";
import { apilink, useStore } from "../../lib";
import toast from "react-hot-toast";

const useGetData = ({query,table})=>{
    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const {instancedata} = useStore((state)=>state)

    const get_item = ()=>{
        
        try {
          setisLoading(true)
          fetch(apilink+"/db/get-item",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({query,table})
          })
          .then((res)=>res.json())
          .then((result)=>{
            if(result?.status!==200){
              return toast.error(result?.message);
            }
            console.log(result?.result,26);
            
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
      get_item()
    }, []);


    return {data,get_item}
}

export default useGetData