import React, { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


const Home = () => {
    const Navigate = useNavigate();
    const [roomID , setRoomId] = useState('')
    const [userName , setUserName] = useState('')
    const newRoom = (e) =>{
        e.preventDefault()
        const id = uuidv4()
        setRoomId(id)
        toast.success(' New Room Created : ' +roomID)
    };

    const joinRoom = () => {
        if(!roomID || !userName)
        {
            toast.error('RoomId & UserName are Required!!')
            return;
        }
        Navigate(`/Editor/${roomID}`, {
            state: {
                roomID,
                userName,
            }
        })
    }
    const InputValidation = (e) => {
        if(e.code === 'Enter')
        {
            joinRoom()
        }
    }
    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <h1 className="heading">Code Sycn</h1>
                <h5 className="mainLabel">Enter Room Id</h5>
                <div className="inputBlock">
                    <input type='text' className="inputBox" onChange={(e) =>setRoomId(e.target.value)} value={roomID} placeholder="RoomID"/>
                    <input type='text' className="inputBox" onKeyUp={InputValidation} onChange={(e) => setUserName(e.target.value)} value={userName} placeholder="UserName"/>
                    <button className="btn join-btn" onClick={joinRoom} >Join</button>
                    <span className="createInfo">
                    Create Your Own Room. &nbsp;
                        <a onClick={newRoom} href="" className="createRoom">
                            New Room
                        </a>
                    </span>
                </div>
            </div>

            <footer>
                <h4>Editor Was Epic</h4>
            </footer>
        </div>
    )
}

export default Home;