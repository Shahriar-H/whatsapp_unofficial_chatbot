import React, { useState } from 'react';
import { apilink, useStore } from '../../lib';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const nagivation = useNavigate()
  const {instancedata,updatedata,removeData} = useStore((state)=>state)

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle login logic here
//     console.log({ email, password, rememberMe });
//   };

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!email || !password){
        return toast.error("Enter Value");
    }
    setisLoading(true)
    fetch(apilink+"/db/get-item",{
        method:"POST",
        headers:{
            "Content-Type":'application/json'
        },
        body:JSON.stringify({query:{email,password},table:"employees"})
    })
    .then((res)=>res.json())
    .then((result)=>{
        setisLoading(false)
        if(result?.status!==200){
            return toast.error(result?.message)
        }
        if(result?.result<1){
            return toast.error("Info Not matched")
        }
        result=result?.result[0]
        // console.log(result);
        // return 0
        updatedata({...instancedata,login_info:result})

        sessionStorage.setItem('login_info', JSON.stringify(result));
        nagivation("/")
        toast.success("Login success")

    })
    
}

  return (
    <div className="flex justify-center h-fit bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            {/* <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">
              Remember me
            </label> */}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {isLoading?"Logging...":"Login"}
          </button>
        </form>
        <div className="text-center mt-4">
          {/* <a href="#" className="text-sm text-indigo-600 hover:underline">
            Forgot your password?
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
