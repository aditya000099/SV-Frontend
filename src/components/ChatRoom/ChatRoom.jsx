import { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../config/config";
import * as HoverCard from "@radix-ui/react-hover-card";
import { VideoCallContext } from "../../context/Context";
import axios from "axios";
import FormCard from "../FormCard/FormCard";
import IncomingCall from "../IncomingCall/IncomingCall";
import Video from "../Video/Video";

export function ChatRoom() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { callUser } = useContext(VideoCallContext);
  const navigate = useNavigate();

  // Add this effect to check authentication
  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch initial messages and set up socket listeners
  useEffect(() => {
    if (!user?._id) return;

    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const messagesRes = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/chatrooms/${id}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (isMounted) {
          const formattedMessages = messagesRes.data.map((msg) => ({
            ...msg,
            sender: {
              _id: msg.sender._id,
              name: msg.sender.name,
            },
          }));
          setMessages(formattedMessages);
          setIsLoading(false);
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setIsLoading(false);
      }
    };

    const setupSocket = () => {
      // Clean up existing listeners
      socket.off("newMessage");
      socket.off("participantUpdate");

      // Join room
      socket.emit("joinRoom", { roomId: id, userId: user._id });

      // Listen for new messages
      socket.on("newMessage", (newMsg) => {
        if (isMounted) {
          console.log("Received new message:", newMsg);
          setMessages((prev) => [...prev, newMsg]);
          setTimeout(scrollToBottom, 100);
        }
      });

      // Listen for participant updates
      socket.on("participantUpdate", (updatedParticipants) => {
        if (isMounted) {
          setParticipants(updatedParticipants);
        }
      });
    };

    fetchInitialData();
    setupSocket();

    return () => {
      isMounted = false;
      socket.emit("leaveRoom", { roomId: id, userId: user._id });
      socket.off("newMessage");
      socket.off("participantUpdate");
    };
  }, [id, user]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp); // Convert the MongoDB timestamp to a Date object
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Format as HH:MM
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?._id) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chatrooms/${id}/messages`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add message to local state
      const messageToAdd = {
        _id: response.data._id,
        text: newMessage,
        timestamp: new Date(),
        sender: {
          _id: user._id,
          name: user.name,
        },
      };

      setMessages((prev) => [...prev, messageToAdd]);

      // Emit to socket
      socket.emit("chatMessage", {
        roomId: id,
        messageData: messageToAdd,
      });

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const initiateVideoCall = (targetUserId) => {
    callUser(targetUserId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black sm:fixed w-full">
      <div className="relative top-2 w-64 bg-zinc-800 backdrop-blur-xl bg-opacity-50 
                hover:bg-opacity-40 transition-all duration-300 my-20 mx-3 rounded-2xl p-4">
  
  {/* Gradient Balls */}
  <div className="absolute top-4 left-8 w-16 h-16 bg-purple-500 rounded-full opacity-30 blur-xl"></div>
  <div className="absolute bottom-8 right-4 w-12 h-12 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
  <div className="absolute top-1/2 left-1/3 w-10 h-10 bg-green-400 rounded-full opacity-20 blur-xl"></div>

  <h3 className="text-xl font-bold mb-4 mt-2">Participants</h3>
  <div className="space-y-2">
    {participants.map((participant) => (
      <HoverCard.Root key={participant._id}>
        <HoverCard.Trigger className="block">
          <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800">
            <div className="w-8 h-8 rounded-full bg-[#5e41de33] flex items-center justify-center">
              {participant.name?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="text-white">{participant.name}</span>
          </div>
        </HoverCard.Trigger>
        <HoverCard.Content className="p-4 bg-gray-800 rounded-xl shadow-xl z-50">
          <div className="space-y-2">
            <div className="text-white">
              <p className="font-bold">{participant.name}</p>
              <p className="text-sm text-gray-400">{participant.email}</p>
              {participant.bio && (
                <p className="text-sm mt-1">{participant.bio}</p>
              )}
            </div>
            {participant._id !== user?._id && (
              <button
                onClick={() => initiateVideoCall(participant._id)}
                className="w-full px-3 py-2 bg-primary-500 hover:bg-primary-600 rounded flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                Video Call
              </button>
            )}
          </div>
        </HoverCard.Content>
      </HoverCard.Root>
    ))}
  </div>
</div>

      {/* <div className="z-[-50] hidden">
        <Video />
        <FormCard />
        <IncomingCall />
      </div> */}
      <div className="flex-1 flex flex-col mt-20">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const isOwnMessage =
              String(message.sender?._id) === String(user?._id);
            {/* console.log(
              "Message sender:",
              message.sender?._id,
              "Current user:",
              user?._id,
              "Is own:",
              isOwnMessage
            ); // Debug log */}

            return (
              <div
                key={message._id || index}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                } mb-4`}
              >
                {!isOwnMessage && (
                  <div className="w-8 h-8 rounded-full bg-[#5e41de33] flex items-center justify-center mr-2">
                    {message.sender?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}

                <div
                  className={`max-w-[70%] px-2 py-1 rounded-xl ${
                    isOwnMessage
                      ? "bg-gray-700 rounded-xl backdrop-blur-xl bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 text-white"
                      : "bg-gray-800 rounded-xl backdrop-blur-xl bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 text-white"
                  }`}
                >
                  <p className="text-sm text-gray-300 mb-1">
                    {message.sender?.name}
                  </p>
                  <div className="flex flex-row gap-2 justify-center items-baseline">
                    <p className="break-words">{message.text}</p>
                    <p className="text-xs">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>

                {isOwnMessage && (
                  <div className="w-8 h-8 rounded-full bg-[#5e41de33] flex items-center justify-center ml-2">
                    {message.sender?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="bg-zinc-900 my-1 mx-1 rounded-2xl p-4"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 rounded-xl focus:border-none border-none bg-zinc-800"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
