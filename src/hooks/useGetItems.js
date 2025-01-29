import { useEffect, useState } from "react";
import { apilink, useStore } from "../../lib";
import toast from "react-hot-toast";

const useGetitem = ()=>{
    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const {instancedata} = useStore((state)=>state)

    const get_item = ({query,table})=>{
        
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


    return {data,get_item}
}

export default useGetitem