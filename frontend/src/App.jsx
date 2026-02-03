import React from 'react'
import { Routes,Route,Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx'
import useGetCity from './hooks/useGetCity.jsx'
import Home from './pages/Home.jsx'
import { use } from 'react'
import useGetMyShop from './hooks/useGetMyShop.jsx'
import CreateEditShop from './pages/CreateEditShop.jsx'
import AddItem from './pages/AddItem.jsx'
import EditItem from './pages/EditItem.jsx'
import useGetShopByCity from './hooks/useGetShopByCity.jsx'
import useGetItemsByCity from './hooks/useGetItemsByCity.jsx'
import CartPage from './pages/CartPage.jsx'

export const serverUrl="http://localhost:8000"

function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  const {userData}=useSelector((state)=>state.user);
  return (
    <Routes>
      <Route path="/signup" element={!userData?<SignUp />:<Navigate to="/" />} />
      <Route path="/signin" element={!userData?<SignIn />:<Navigate to="/" />} />
      <Route path="/forgot-password" element={!userData?<ForgotPassword />:<Navigate to="/" />} />
      <Route path="/" element={userData?<Home />:<Navigate to="/signin" />} />
      <Route path="/create-edit" element={userData?<CreateEditShop />:<Navigate to="/signin" />} />
      <Route path="/add-item" element={userData?<AddItem/>:<Navigate to="/signin" />} />
      <Route path="/edit-item/:itemId" element={userData?<EditItem/>:<Navigate to="/signin" />} />
      <Route path="/cart" element={userData?<CartPage/>:<Navigate to="/signin" />} />
    </Routes>
  )
}

export default App