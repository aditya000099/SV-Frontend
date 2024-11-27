import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export function Dashboard() {
  const [chatRooms, setChatRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chatrooms`);
      setChatRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch chatrooms:', error);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chatrooms`, 
        { name: roomName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setRoomName('');
      fetchChatRooms();
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Study Rooms</h1>
        
      <button onClick={() => setShowModal(true)} className="button px-3 hover:bg-[#5e41de4d] py-1 flex justify-center items-center rounded-2xl bg-[#5e41de33]">

        <span className="lable text-lg text-[#5D41DE]">Create new room</span>
      </button>
        {/* <button
          
          className="button px-3 hover:bg-[#5e41de4d] py-1 flex justify-center items-center rounded-2xl bg-[#5e41de33]"
        >
          Create New Room
        </button> */}
      </div>

      {/* Create Room Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-gray-900 backdrop-blur-lg bg-opacity-50 
                      transition-all duration-300">
          <div className="p-6  w-96 bg-gray-900 rounded-2xl backdrop-blur-lg bg-opacity-50 
                     hover:bg-opacity-70 transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 text-white">Create New Room</h2>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
              placeholder="Enter room name..."
            />
            <div className="flex justify-end gap-2">
              
              <button
                onClick={() => setShowModal(false)}
                className="button px-3 hover:bg-[#de41414d] py-1  flex justify-center items-center rounded-xl bg-[#de414133]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="button px-3 hover:bg-[#5e41de4d]  flex justify-center items-center rounded-xl bg-[#5e41de33]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {chatRooms.map((room) => (
    <Link
      key={room._id}
      to={`/chatroom/${room._id}`}
      className="relative block p-2 bg-gray-900 rounded-2xl backdrop-blur-lg bg-opacity-50 
                 hover:bg-opacity-70 transition-all duration-300"
    >
      {/* Top Image */}
      <img
        // src="/img.png" // Replace with the actual path to your image
        src={room.image} // Replace with the actual path to your image
        alt={`${room.name} cover`}
        className="w-full object-cover rounded-t-xl mb-4"
      />

      {/* Room Name with Gradient */}
      <div className="relative">
        <h3 className="text-xl font-semibold mb-2 text-white  relative">
          {room.name}
        </h3>
        
      </div>

      <p className="text-gray-400 mb-4">Created by: {room.creator.name}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {room.participants.length} participants
        </span>
        <span className="inline-block px-3 py-1 bg-primary-500 rounded-full text-sm text-white">
          Join Room
        </span>
      </div>
    </Link>
  ))}
</div>

    </div>
  );
}

export default Dashboard; 