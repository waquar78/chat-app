import React from 'react'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { useRegisterUserMutation } from '../api/AuthApi';
import { useEffect } from 'react';
import toast from "react-hot-toast"


const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [register, { isError, isLoading, isSuccess, }] = useRegisterUserMutation()

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    })
  }

  const submitHandler = (e) => {
    e.preventDefault();
    register(formData);
    setFormData({ name: "", email: "", password: "" });

  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("User registered successfully!");
      navigate("/login")

    }
 
    if (isError) {
      toast.error("Registration failed!");
    }
  }, [isSuccess, isError]);

  return (
    <div className="relative h-screen w-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://wallpaperaccess.com/full/393735.jpg')" }}
      ></div>

      {/* Form */}
      <div className="relative flex items-center justify-center h-full ">
        <form className="bg-white opacity-70 p-8 rounded-lg shadow-lg w-96 space-y-4">
          <h2 className="text-2xl font-bold text-center">Register</h2>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              id="name"
              name='name'
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              id="email"
              type="email"
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              id="password"
              name='password'
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={submitHandler}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>

          {/* Link to Login */}
          <p className="text-center text-gray-700 ">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
