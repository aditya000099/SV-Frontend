import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { GlareCard } from "../../CardPatterns/Glare";
import { Client, Storage } from "appwrite";

export function Dashboard() {
  const [chatRooms, setChatRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Appwrite Client
  const client = new Client();
  const storage = new Storage(client);

  client
    .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
    .setProject("igshops"); // Replace with your Appwrite project ID

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chatrooms`
      );
      setChatRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch chatrooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (error) return;

    try {
      const imageUrl = await generateAndUploadImage(roomName);

      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chatrooms`,
        { name: roomName, image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      setRoomName("");
      setPreviewImage(null);
      fetchChatRooms();
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const validateRoomName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.split(" ").length > 3) {
      setError("Room name cannot exceed three words.");
    } else if (!/^[\w]+(\s[\w]+)*$/.test(trimmedName)) {
      setError("Room name cannot contain empty spaces or special characters.");
    } else {
      setError("");
    }
  };

  const handleRoomNameChange = (e) => {
    const name = e.target.value;
    setRoomName(name);
    validateRoomName(name);
    if (!error) generateImagePreview(name);
  };

  const generateAndUploadImage = async (roomName) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
  
    const ctx = canvas.getContext("2d");
    const baseImage = new Image();
    baseImage.src = "/base.png"; // Path to your base image
  
    return new Promise((resolve, reject) => {
      baseImage.onload = async () => {
        try {
          // Draw the base image
          ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  
          // Set font styles
          const words = roomName.split(" ");
          let fontSize = 24;
          if (roomName.length > 8) fontSize = 20;
  
          ctx.font = `900 ${fontSize}rem 'Poppins'`;
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
  
          // Multi-line text handling
          if (words.length === 1) {
            ctx.fillText(roomName, canvas.width / 2, canvas.height / 2);
          } else {
            const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ");
            const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ");
            ctx.fillText(firstLine, canvas.width / 2, canvas.height / 2 - 100);
            ctx.font = `600 ${fontSize - 8}rem 'Poppins'`;
            ctx.fillText(secondLine, canvas.width / 2, canvas.height / 2 + 150);
          }
  
          // Convert canvas to blob and upload
          const blob = await new Promise((resolveCanvas) =>
            canvas.toBlob(resolveCanvas, "image/jpeg", 0.9)
          );
  
          // Appwrite file upload
          const file = new File([blob], `${roomName}.jpg`, { type: "image/jpeg" });
          const response = await storage.createFile(
            "bp", // Replace with your Appwrite bucket ID
            "unique()", // Generates a unique ID
            file
          );
  
          // Return the file's URL
          const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/bp/files/${response.$id}/view?project=igshops`;
          resolve(imageUrl);
        } catch (error) {
          console.error("Image generation or upload failed:", error);
          reject(error);
        }
      };
  
      baseImage.onerror = () => reject(new Error("Base image failed to load"));
    });
  };
  

  const generateImagePreview = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    const baseImage = new Image();
    baseImage.src = "/base.png";

    baseImage.onload = () => {
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      ctx.font = "900 24rem 'Poppins'";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      const words = text.split(" ");
      let fontSize = 24; // Adjust font size dynamically
      if (text.length > 8) fontSize = 22;
      ctx.font = `600 ${fontSize}rem 'Poppins'`;

      if (words.length === 1) {
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      } else {
        ctx.font = `800 ${fontSize - 8}rem 'Poppins'`; // Second line weight adjustment
        const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ");
        ctx.fillText(firstLine, canvas.width / 2, canvas.height / 2 - 100);
        ctx.fillText(secondLine, canvas.width / 2, canvas.height / 2 + 150);
      }

      const previewUrl = canvas.toDataURL("image/jpeg");
      setPreviewImage(previewUrl);
    };
  };

  const LoadingSkeleton = () => (
    <div className="relative block p-2 bg-slate-950 rounded-2xl backdrop-blur-lg bg-opacity-50 hover:bg-opacity-70 transition-all duration-300">
      <div className="animate-pulse">
        <div className="w-full h-48 bg-gray-700 rounded-xl mb-4"></div>
        <div className="px-2">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-normal tracking-tighter text-3xl sm:text-5xl md:text-5xl lg:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-tr from-zinc-400/50 to-white/60 via-white">
          Study Rooms
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="button px-3 hover:bg-[#5e41de4d] py-1 flex justify-center items-center rounded-2xl bg-[#5e41de33]"
        >
          <span className="lable text-lg text-[#5D41DE]">Create new room</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-gray-900 backdrop-blur-lg bg-opacity-50 transition-all duration-300">
          <div className="p-6 w-96 bg-gray-900 rounded-2xl backdrop-blur-lg bg-opacity-50 hover:bg-opacity-70 transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 text-white">Create New Room</h2>
            <input
              type="text"
              value={roomName}
              onChange={handleRoomNameChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
              placeholder="Enter room name (max 3 words)..."
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {previewImage && (
              <img
                src={previewImage}
                alt="Room preview"
                className="w-full h-auto rounded-lg mb-4"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="button px-3 hover:bg-[#de41414d] py-1 flex justify-center items-center rounded-xl bg-[#de414133]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className={`button px-3 hover:bg-[#5e41de4d] flex justify-center items-center rounded-xl ${
                  error ? "bg-gray-500" : "bg-[#5e41de33]"
                }`}
                disabled={!!error}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array(6)
              .fill(null)
              .map((_, index) => (
                <GlareCard key={`skeleton-${index}`}>
                  <LoadingSkeleton />
                </GlareCard>
              ))
          : chatRooms.map((room) => (
              <Link key={room._id} to={`/chatroom/${room._id}`}>
                <GlareCard>
                  <div className="relative block p-2 bg-slate-950 rounded-2xl backdrop-blur-lg bg-opacity-50 hover:bg-opacity-70 transition-all duration-300">
                    <img
                      src={room.image}
                      alt={`${room.name} cover`}
                      className="w-full object-cover rounded-xl mb-4"
                    />
                    <div className="px-2">
                      <h3 className="text-xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-tr from-zinc-400/50 to-white/60 via-white mb-2">
                        {room.name}
                      </h3>
                      <p className="text-gray-400 mb-4">Created by: {room.creator.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {room.participants.length} participants
                        </span>
                        <span className="inline-block px-3 py-1 bg-primary-500 rounded-full text-sm text-white">
                          Join Room
                        </span>
                      </div>
                    </div>
                  </div>
                </GlareCard>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default Dashboard;
