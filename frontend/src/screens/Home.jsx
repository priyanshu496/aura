import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { LogOut, MessageCircleCode } from "lucide-react";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [room, setRoom] = useState([]);
  const { signout } = useContext(UserContext);

  const navigate = useNavigate();

  function createRoom(e) {
    e.preventDefault();
    console.log({ roomName });

    axios
      .post("/rooms/create", {
        name: roomName,
      })
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    axios
      .get("/rooms/all")
      .then((res) => {
        setRoom(res.data.rooms);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSignout = () => {
    signout();
    navigate("/signin");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <header className="relative z-10 p-8 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <MessageCircleCode className="ri-chat-3-fill text-white text-2xl" />
            </div>
            <h1
              id="logo"
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 text-5xl md:text-6xl font-bold tracking-tight"
            >
              Aura
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSignout}
              className="group relative p-4 cursor-pointer bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400 hover:text-red-300 rounded-2xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <i className="ri-home-4-fill text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.email?.split("@")[0] || "User"}
                </h1>
                <p className="text-gray-400 text-lg font-medium">
                  Choose a room to start chatting with your team
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-300 text-sm font-medium">
                  Active Rooms
                </p>
                <p className="text-2xl font-bold text-white">{room.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              onClick={() => setIsModalOpen(true)}
              className="group relative bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 transform hover:border-blue-400/50"
            >
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <i className="ri-add-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Create New Room
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  Start a new conversation
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>

            {room.map((roomItem) => (
              <div
                key={roomItem._id}
                onClick={() => {
                  navigate(`/room`, {
                    state: { room: roomItem },
                  });
                }}
                className="group relative bg-gradient-to-br from-slate-900/60 to-zinc-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transform hover:border-purple-500/50"
              >
                <div className="flex flex-col h-full min-h-[200px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <i className="ri-chat-3-fill text-white text-xl"></i>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
                      <span className="text-green-400 text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 flex-grow">
                    {roomItem.name}
                  </h3>

                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="ri-user-line text-blue-400"></i>
                        <span className="text-gray-300 text-sm font-medium">
                          Members
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {roomItem.users?.length || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="ri-time-line text-indigo-400"></i>
                        <span className="text-gray-300 text-sm font-medium">
                          Last activity
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">Just now</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-gray-400 text-xs">Team:</span>
                      <div className="flex -space-x-2">
                        {roomItem.users?.slice(0, 3).map((member, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-900 shadow-lg"
                          >
                            {member.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                        ))}
                        {roomItem.users?.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-900 shadow-lg">
                            +{roomItem.users.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
            ))}
          </div>

          {room.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/25">
                <i className="ri-chat-3-line text-5xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                No rooms yet
              </h2>
              <p className="text-gray-400 text-lg text-center max-w-md mb-8">
                Create your first room to start chatting with your team members
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Create Your First Room
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Create New Room</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-slate-700/60 rounded-2xl transition-all duration-300 text-gray-400 hover:text-white"
              >
                <i className="ri-close-fill text-lg"></i>
              </button>
            </header>

            <form onSubmit={createRoom} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-200">
                  Room Name
                </label>
                <div className="relative">
                  <i className="ri-chat-3-line absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                  <input
                    onChange={(e) => setRoomName(e.target.value)}
                    value={roomName || ""}
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border-2 border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/50 transition-all duration-300"
                    placeholder="Enter room name"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-2xl transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
