import React, { useEffect, useRef, useState } from "react";
import ACTION from "../Action";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { io } from "socket.io-client";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomID } = useParams();
  const [clients, setClients] = useState([]);
  const codeRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("Sockect error", e); // socket connected
        toast.error("Sockect connection failed , try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTION.JOIN, {
        roomID: location.state?.roomID,
        userName: location.state?.userName,
      });

      // clients joined toast and list of clients.
      socketRef.current.on(ACTION.JOINED, ({ clients, userName, socketId }) => {
        if (userName !== location.state?.userName) {
          toast.success(`${userName} joined the room. `);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        }
        setClients(clients);
        socketRef.current.emit(ACTION.SYNC_CODE, {
          socketId,
          code: codeRef.current,
        });
      });

      //listening of dissconting

      socketRef.current.on(ACTION.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left the room. `);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTION.JOINED);
      socketRef.current.off(ACTION.DISCONNECTED);
    };
  }, []);

  async function copyRoomID() {
    try {
      await navigator.clipboard.writeText(roomID);
      toast.success("RoomID  has been copyed. ");
    } catch (err) {
      toast.error("Could not copy the RoomID!!");
      console.log("RoomID not Copyed", err);
    }
  }
  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="userWrapper">
      <div className="clintWrapper">
        <div className="innerWrap">
          <div className="logo">
            <h1>Code Sycn</h1>
          </div>
          <h3 className="status">Connected</h3>
          <div className="clintList">
            <div className="client">
              {clients.map((client) => (
                <Client
                  className="clientDetail"
                  key={client.socketId}
                  username={client.userName}
                />
              ))}
            </div>
          </div>
        </div>
        <label id="roomid"></label>
        <button className="btn copyBtn" onClick={copyRoomID}>
          RoomID '' {location.state.roomID} ''
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i> leave Room
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomID={roomID}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
