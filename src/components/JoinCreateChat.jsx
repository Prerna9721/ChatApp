import React, { useState } from 'react'
import chatIcon from "../assets/chat.png"
import toast from 'react-hot-toast';
import {createRoom as createRoomApi, joinChatApi }from "../services/RoomService"; 
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';

const JoinCreateChat = () => {
  const[detail,setDetail]=useState({
    roomId: '',
    userName:'',
  });
const {roomId,userName,setRoomId,setCurrentUser,setConnected}=useChatContext();
const navigate=useNavigate()

  //function to handle input change

  function handleFormInputChange(event){
    setDetail({
      ...detail,[event.target.name]:event.target.value,
    })
  }
  async function joinChat(){
    if(validateRoom()){

    

      try{
      const room=await joinChatApi(detail.roomId);
      toast.success("Joined");
       setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      }catch(error){
        if(error.status==400){
          toast.error(error.response.data);
        }else{
              toast.error("Error in Joining");

        }
        console.log(error);
      }
        

    }
      

  }
  async function createRoom(){
    if(validateRoom()){
      //create room 
      console.log(detail);
      //call api to create room on 
      try{
        const response=await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room created successfully");
        //join room
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true)

        navigate("/chat");
      }catch(error){
        console.log(error);
        if(error.status==400){
          toast.error("Room already exists");
              setDetail({
                roomId:"",
                userName:"",

    });

        }
        console.log("error in creating room");
      }
      
    }

  }
  function validateRoom(){
    if(detail.roomId==="" || detail.userName===""){
      toast.error("Invalid input !!")
      return false;
    }
    return true;
  }


  return (
    <div className='min-h-screen flex items-center justify-center border'>
        <div className=' p-8 w-full flex flex-col gap-5 max-w-md rounded-2xl dark:bg-gray-900 shadow'>
           <div><img src={chatIcon} className='w-24 mx-auto' /> 
            </div> 
            <h1 className='text-2xl font-semibold text-center'>Join Room/Create Room </h1>

            <div className=''><label htmlFor="name" className='block font-medium mb-2'>Your Name</label>
            <input onChange={handleFormInputChange} 
            value={detail.userName}
            type='text'
             id='name'
             name='userName'
             placeholder='Enter the name'
             className='w-full dark:bg-gray-600 px-4 py-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2'/>
            </div>

            {/* room id field */}
            <div className=''><label htmlFor="name" className='block font-medium mb-2'>Room ID / New Room ID</label>
            <input onChange={handleFormInputChange}
            name='roomId'
            value={detail.roomId}
            placeholder='Enter the room Id'
            type='text' id='name' className='w-full dark:bg-gray-600 px-4 py-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2'/>
            </div>
            <div className='flex-justify-center gap-2 mt-4' >
              <button onClick={joinChat} className='px-3 py-2 bg-blue-500 hover:bg-blue-800 rounded-full'>Join Room</button>
             <button onClick={createRoom} className='px-3 py-2 bg-orange-500 hover:dark:bg-orange-800 rounded-full'>Create Room</button>
            </div>
             
            
        </div>

        

    </div> 
  )
}

export default JoinCreateChat
