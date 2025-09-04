import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutUerMutation } from '../api/AuthApi'
import toast from 'react-hot-toast'
import { useDispatch } from "react-redux";
import {persistor} from "../Store/Store.js"
import { userLogout } from '../redux/authSlice' // action


const Header = () => {
  const [open, setOpen] = useState(false)
  const user = useSelector((state) => state.auth.user)
  
  const [logout ] = useLogoutUerMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch();

const logoutHandler = async () => {
  try {
    await logout(); // API call
    localStorage.removeItem("user"); // local se hata
    dispatch(userLogout()); // redux state reset
    await persistor.purge(); // persist storage clear kare
    await persistor.flush(); // ensure persist sync
    toast.success("Logout successful");
    navigate("/");
  } catch (error) {
    toast.error("Logout failed");
  }
};


  return (
    <div className="h-14 bg-green-600 flex items-center justify-between px-4 border-b shadow-sm text-white">
      {/* Left: App Title or Logo */}
      <h2 className="text-lg font-semibold">Quick_Chat</h2>

    

      {/* Right: User Info and Dropdown */}
      <div className="relative flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setOpen(!open)}>
            <p className="font-medium">{user.name}</p>
            <IoIosArrowDropdownCircle size={24} />

            {open && (
              <div className="absolute right-0 top-full mt-2 bg-white text-black w-40 rounded shadow-lg py-2 z-50">
                <Link to="/edit-profile" className="block px-4 py-2 hover:bg-gray-100">
                  Edit Profile
                </Link>
                <div
                  className="block px-4 py-2 hover:bg-red-400 cursor-pointer"
                  onClick={logoutHandler}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="font-medium text-white">
            Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default Header
