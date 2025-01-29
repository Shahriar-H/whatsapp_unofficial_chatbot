import { useEffect, useState } from "react";

export const useGetinstance = ()=>{
    const [data, setdata] = useState();

    const dataseton = (instance)=>{
        setdata(instance)
    }

    return { data,dataseton };
}