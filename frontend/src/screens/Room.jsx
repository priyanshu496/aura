import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Boxes, UserPlus, Send, X, Play, ShieldUser, Rss } from "lucide-react";
import axios from "../config/axios.js";
import { UserContext } from "../context/user.context.jsx";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket.js";

const Room = () => {
  const location = useLocation();
  
  // Debug logging
  console.log('Location state:', location.state);
  console.log('Room from location:', location.state?.room);
  console.log('Room ID:', location.state?.room?._id);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [selectedUserId, setselectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState(location.state?.room); // Added optional chaining
  const [message, setMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const {user} = useContext(UserContext);

  const handleUserClick = (id) => {
    setselectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });
  };

  function addMembers() {
    if (!room?._id) {
      console.error('Room ID is not available');
      return;
    }
    
    axios
      .put("/room/add-user", {
        roomId: room._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setisModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function sendMessageClick () {
    if (!socketConnected) {
      console.error('Socket not connected');
      return;
    }
    
    sendMessage('room-message', {
      message,
      sender: user._id
    })
    setMessage("")
  }

  useEffect(() => {
    // Check if we have room data
    if (!location.state?.room?._id) {
      console.error('Room ID is missing from location state');
      return;
    }

    const roomId = location.state.room._id;
    console.log('Attempting to connect to room:', roomId);

    try {
      // Initialize socket connection
      const socket = initializeSocket(roomId);
      
      // Handle connection events
      socket.on('connect', () => {
        console.log('Socket connected successfully');
        setSocketConnected(true);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        setSocketConnected(false);
      });

      // Listen for messages
      receiveMessage('room-message', data => {
        console.log('Received message:', data);
      });

      // Fetch room details
      axios
        .get(`/room/get-room/${roomId}`)
        .then((res) => {
          console.log('Room data:', res.data.room);
          setRoom(res.data.room);
        })
        .catch((err) => {
          console.error('Error fetching room:', err);
        });

      // Fetch users
      axios
        .get("/user/all")
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((err) => {
          console.error('Error fetching users:', err);
        });

    } catch (error) {
      console.error('Error initializing socket:', error);
    }

    // Cleanup function
    return () => {
      if (socketConnected) {
        console.log('Disconnecting socket');
        // Add socket disconnect logic here if needed
      }
    };
  }, [location.state?.room?._id]);

  // Early return if no room data
  if (!location.state?.room) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-950 to-black">
        <div className="text-white text-xl">
          No room data available. Please navigate from the rooms list.
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen flex bg-gradient-to-br from-slate-950 via-zinc-950 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <section className="left relative flex flex-col h-screen min-w-96 bg-zinc-900/60 backdrop-blur-xl border-r border-blue-500/20 z-10">
        <header className="flex justify-between items-center p-4 px-6 w-full bg-zinc-900/80 backdrop-blur-xl border-b border-blue-500/20 absolute z-20 top-0">
          <button
            onClick={() => setisModalOpen(true)}
            className="flex gap-2 items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25"
          >
            <UserPlus />
            <p>Add members</p>
          </button>
          <div className="flex items-center gap-2">
            {/* Connection status indicator */}
            <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-3 bg-zinc-800/50 hover:bg-zinc-700/50 text-blue-400 hover:text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-400/40"
            >
              <Boxes />
            </button>
          </div>
        </header>
        <div className="chat-area pt-20 pb-4 flex-grow flex flex-col h-full relative">
          <div className="message-box p-4 flex-grow flex flex-col gap-3 overflow-auto max-h-full scrollbar-hide">
            <div className="w-fit max-w-56 overflow-y-visible text-white rounded-xl flex flex-col bg-gradient-to-r from-blue-600 to-indigo-600 p-2">
              <small className="opacity-65 text-sm">example@gmail.com</small>
              <p className=" text-sm">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Voluptatum nostrum reiciendis fuga, harum, ex corrupti unde odit
                reprehenderit sed culpa, porro alias officiis totam commodi hic
                nulla excepturi!
              </p>
            </div>
            <div className="ml-auto text-black rounded-xl w-fit flex flex-col bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 p-2">
              <small className="opacity-65 text-sm">example@gmail.com</small>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </div>

          <div className="inputField w-full flex absolute bottom-0 p-4">
            <input
              value={message}
              onChange={ (e) => setMessage(e.target.value) }
              className="p-3 px-4 bg-zinc-800/50 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 rounded-l-xl text-zinc-100 placeholder-zinc-400 flex-grow transition-all duration-300"
              type="text"
              placeholder="Enter message"
              disabled={!socketConnected}
            />
            <button
              onClick={sendMessageClick}
              disabled={!socketConnected}
              className={`px-6 text-white rounded-r-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 ${
                socketConnected 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              <Send />
            </button>
          </div>
        </div>

        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-zinc-900/90 backdrop-blur-xl border-l border-blue-500/20 absolute transition-all duration-300 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0 z-30`}
        >
          <header className="flex justify-between items-center px-6 p-4 bg-zinc-800/80 backdrop-blur-xl border-b border-blue-500/20">
            <h1 className="font-bold text-xl text-zinc-100">Members</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 text-blue-400 hover:text-blue-300 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-xl transition-all duration-300"
            >
              <X />
            </button>
          </header>

          <div className="users flex flex-col gap-3 p-4">
            {room?.users &&
              room.users.map((user, index) => (
                <div
                  key={index}
                  className="user cursor-pointer hover:bg-zinc-800/60 p-3 flex gap-3 items-center rounded-xl transition-all duration-300 border border-transparent hover:border-blue-500/20"
                >
                  <div className="aspect-square rounded-full w-12 h-12 flex items-center justify-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                    <ShieldUser />
                  </div>
                  <h1 className="font-semibold text-lg text-zinc-100">
                    {user.email}
                  </h1>
                </div>
              ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-blue-500/20 p-6 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md relative">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-100">
                Select Members
              </h2>
              <button
                onClick={() => setisModalOpen(false)}
                className="p-2 text-blue-400 hover:text-blue-300 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl transition-all duration-300"
              >
                <X />
              </button>
            </header>
            <div className="users-list flex flex-col gap-3 mb-20 max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user cursor-pointer hover:bg-zinc-800/60 ${
                    Array.from(selectedUserId).indexOf(user._id) != -1
                      ? "bg-zinc-800/80 border-blue-400/40"
                      : "border-transparent"
                  } p-3 flex gap-3 items-center rounded-xl transition-all duration-300 border`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square rounded-full w-12 h-12 flex items-center justify-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                    <ShieldUser />
                  </div>
                  <h1 className="font-semibold text-lg text-zinc-100">
                    {user.email}
                  </h1>
                </div>
              ))}
            </div>
            <button
              onClick={addMembers}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25"
            >
              Add to room
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Room;