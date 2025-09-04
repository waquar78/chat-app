import React, { useState ,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useLoginUserMutation } from '../api/AuthApi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'


const Login = () => {
  const [formData , setFormData]=useState({email:"" ,password:""})
  const [login,{isSuccess ,isLoading ,isError}]=useLoginUserMutation()
   
  const navigate= useNavigate()
  const dispatch=useDispatch()

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
    
  }

  const submitHandler=async(e)=>{
    e.preventDefault()
   const res= await login(formData);
   console.log("response",res);
   if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data.user));  
  }  

  }

  useEffect(() => {
    if(isSuccess){
      toast.success("login successfull");
      setFormData({ email: "", password: "" });
      navigate("/") 
      
    }
    if (isError) {
          toast.error("login failed");
        }
  }, [isSuccess,isError])
  
  
  return (
    <div className="relative h-screen w-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://wallpaperaccess.com/full/393735.jpg')" }}
      ></div>

      <div className="relative flex items-center justify-center h-full ">
        <form className="bg-white opacity-70 p-8 rounded-lg shadow-lg w-96 space-y-4">
          <h2 className="text-2xl font-bold text-center">Register</h2>

          <label htmlFor="email">Email</label>
          <input
           className="w-full p-2 border rounded"
            type="email"
            placeholder='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
             />

          <label htmlFor="password">Password</label>
          <input 
          className="w-full p-2 border rounded"
           type="password" 
           placeholder='password'
           name='password'
           value={formData.password}
           onChange={handleChange}
           />

          <button onClick={submitHandler} className='w-full bg-blue-600 hover:bg-blue-800 p-2' type='submit'>
            Submit
          </button>

          <p className='text-gray-800 text-center'>Create account?
            <Link to={"/register"} className='text-blue-600 hover:text-blue-800 hover:underline'>Signup</Link>
          </p>
        </form>
      </div>

    </div>
  )
}

export default Login