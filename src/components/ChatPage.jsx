import React, { useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md'
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { baseURL } from '../config/AxiosHelper';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessages } from '../services/RoomService';
import { timeAgo } from '../config/helper';
export {timeAgo} from "../config/helper";



const ChatPage = () => {

  const {roomId,setConnected,currentUser,connected,setRoomId,setCurrentUser}=useChatContext()

  const navigate=useNavigate();
  useEffect(()=>{
    if(!connected){
      navigate("/")
    }
  },[connected,roomId,currentUser])
   const [messages,setMessages]=useState([
     
    ]);
const [input,setInput]=useState("");
const inputRef=useRef(null)
const chatBoxRef=useRef(null)
const[stompClient,setStompClient]=useState(null);

//page init 
//to load the messages

useEffect(()=>{
  async function loadMessages() {
    
  

    try{
      const messages=await getMessages(roomId);
      console.log("hii");
      console.log(messages);
      setMessages(messages);

    }catch(error){

    }
   
  }
  if(connected){
    loadMessages();
  }
  
},[roomId]);

//scroll down

useEffect(()=>{

  if(chatBoxRef.current){
    chatBoxRef.current.scroll({
      top:chatBoxRef.current.scrollHeight,
      behavior:"smooth",
    });
  }
}),[messages]

//init the stompclient
//subscribe

useEffect(()=>{
  const connectWebSocket = ()=>{
    //Sock Js

    const sock=new SockJS(`${baseURL}/chat`);

    const client=Stomp.over(sock);
    client.connect({},()=>{
      
       setStompClient(client);
       toast.success("connected");
       
      client.subscribe(`/topic/room/${roomId}`,(message)=>{
        console.log(message);
        const newMessage=JSON.parse(message.body);
        setMessages((prev)=>[...prev,newMessage]);
      })
    });

  };
  if(connected){
      connectWebSocket();
      
  }
},[roomId]);



//send messages
const sendMessages=async()=>{
  if(stompClient&& connected && input.trim()){
    console.log(input);

    const message={
      sender:currentUser,
      content:input,
      roomId:roomId
    }
    stompClient.send(`/app/sendMessage/${roomId}`,{},JSON.stringify(message));
    setInput("");

  }
}

//logout
function handleLogOut(){
  stompClient.disconnect();
  setConnected(false);
  setRoomId('' );
  setCurrentUser('');
  navigate("/")
}

  return (

   
    <div className=''>
      <header className="dark:border-gray-700  fixed w-full dark:bg-gray-900 py-5 shadow flex justify-around items-center">

            <div>
          {/* room name container */}
          <h1 className='text-xl font-semibold'> Room : <span>{roomId} </span></h1>
            </div>

            <div>
           {/* username container */}
             <h1 className='text-xl font-semibold'> User : <span>{currentUser}</span></h1>
            </div>


            <div>
                {/* button container */}
<button onClick={handleLogOut} className='bg-red-500 hover:bg-red-700 rounded-full px-3 py-2' >Leave Room </button>

            </div>
        </header>
{/* main content of page */}
      <main ref={chatBoxRef} className="py-20 px-10  w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto flex flex-col items-start ">
      {
        messages.map((message,index)=>(
          <div key={index}className={`flex w-full ${message.sender===currentUser ? "justify-end" : "justify-start"}`}>
            <div className={`my-2 ${message.sender===currentUser ?'bg-green-800':'bg-gray-700'} p-2 rounded max-w-xs`}>
            <div className='flex flex-row gap-2'>
          <img className='h-10 w-10' src={"https://avatar.iran.liara.run/public"} alt={message.sender}/>
            <div className=' flex flex-col text-white'>
            <p className='text-sm font-bold'>{message.sender}</p>
            <p>{message.content}</p>
            <p className='text-gray-500 text-xs '>{timeAgo(message.timeStamp)}</p>
            </div>
             
            </div>

          </div>
          </div>
        ))
              
      }
       
        </main>  
     

{/*input message container */}

<div className='border fixed bottom-2 w-full h-16   bg-gray-400'>
    <div className=' h-full border  w-2/3 mx-auto gap-3 bg-gray-900 rounded-full  flex items-center justify-between'  >
    <input 
    value={input}
    onChange={(e)=>
      {
         console.log("Typed:", e.target.value);
        setInput(e.target.value)}
      }
       onKeyDown={(e) => {
      if (e.key==="Enter") {
      e.preventDefault(); // stop new line if it's a textarea (optional here)
      sendMessages(); // call your send function
    }
      
      }
      
      }
    type="text" placeholder='Type your message here...' className='h-full w-full border-gray-700 bg-gray-900 px-2 py-3 rounded-2xl'/>

       <button  className='bg-blue-600 h-10  w-10 px-3 py-2 rounded-full flex justify-center items-center'>  <MdAttachFile size={20}/></button>

    <button onClick={sendMessages}
     
    className='bg-green-600 h-10  w-10 px-3 py-2 rounded-full flex justify-center items-center'>  <MdSend size={20}/></button>
    </div>
</div>

    </div>
  )
}

export default ChatPage
