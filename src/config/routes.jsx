import React from 'react'
import App from '../App'
import { Routes } from 'react-router';
import { Route } from 'react-router';
import ChatPage from '../components/ChatPage';


const AppRoutes = () => {
  return (
<Routes>
<Route path="/" element={<App/>}/>
<Route path="about" element={<h1>hello</h1>}/>
<Route path="/chat" element={<ChatPage/>}/>

</Routes>
  )
};

export default AppRoutes
