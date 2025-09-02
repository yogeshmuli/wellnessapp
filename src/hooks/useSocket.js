import React, { useContext, createContext, useEffect } from "react";
import socket from "../socket";
import { getAllConversations } from "../redux/thunks/user";
import { useDispatch } from "react-redux";
import { getAuth } from "@react-native-firebase/auth";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const listenForMessages = async () => {
    // Fetch all conversations when connected
    socket.emit("register", getAuth().currentUser.uid);
    let conversations = await dispatch(getAllConversations()).unwrap();
    conversations.forEach((conversation) => {
      socket.emit("joinConversation", conversation.id);
    });
    return;
  };

  return (
    <SocketContext.Provider value={{ connected, socket, listenForMessages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
