
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import { CopyPlus , Users } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [room, setRoom] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ roomName });

    axios
      .post(
        "/room/create",
        {
          name: roomName,
        },
        {
          withCredentials: true,
        }
      )
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
      .get("/room/all")
      .then((res) => {
        console.log(res.data);
        setRoom(res.data.rooms);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-black p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-wrap gap-4 md:gap-6">
          {/* New Room Button */}
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex gap-2 items-center p-4 bg-zinc-900/60 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
            >
              New Room
              <CopyPlus className="w-5 h-5" />
            </button>
          </div>

          {/* Room Cards */}
          {room.map((room) => (
            <div
              key={room._id}
              onClick={() => {
                navigate(`/room`, {
                  state: { room },
                });
              }}
              className="flex flex-col gap-3 cursor-pointer p-4 bg-zinc-900/60 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 rounded-xl min-w-52 max-w-72 hover:bg-zinc-800/60 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
            >
              <h2 className="font-semibold text-xl text-zinc-100">{room.name}</h2>

              <div className="flex gap-2 items-center">
                <p className="text-zinc-300 text-sm flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Members</span>
                </p>
                <span className="text-blue-300 font-semibold">:</span>
                <span className="text-zinc-100 font-medium">{room.users.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-blue-500/20 p-6 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Create New Room</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-blue-200 mb-2">
                  Room Name
                </label>
                <input
                  onChange={(e) => setRoomName(e.target.value)}
                  value={roomName}
                  type="text"
                  className="w-full p-3 bg-zinc-800/50 border-2 border-zinc-700 hover:border-blue-500/30 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 rounded-xl text-zinc-100 placeholder-zinc-400 transition-all duration-300"
                  placeholder="Enter room name"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  className="px-6 py-3 bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-200 rounded-xl transition-all duration-300 border border-zinc-600 hover:border-zinc-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25"
                >
                  Create
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