import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/user.context";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import Markdown from "markdown-to-jsx";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Room = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [room, setRoom] = useState(location.state.room);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = React.createRef();

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const saveMessageToDatabase = async (messageData) => {
    try {
      await axios.post("/messages/create", {
        roomId: room._id,
        content: messageData.message,
      });
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  };

  const loadMessagesFromDatabase = async () => {
    try {
      setLoadingMessages(true);
      const response = await axios.get(`/messages/room/${room._id}`);

      const transformedMessages = response.data.messages.map((msg) => ({
        sender: {
          _id: msg.sender._id,
          email: msg.sender.email,
        },
        message: msg.content,
        createdAt: msg.createdAt,
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error("Error loading messages from database:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
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
    axios
      .put("/rooms/add-user", {
        roomId: location.state.room._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
        setSelectedUserId(new Set());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const send = async () => {
    if (message.trim()) {
      const messageData = {
        message: message.trim(),
        sender: user,
      };

      sendMessage("room-message", messageData);

      setMessages((prevMessages) => [...prevMessages, messageData]);

      await saveMessageToDatabase(messageData);

      setMessage("");
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      send();
    }
  };

  function WriteAiMessage(message) {
    let messageObject;

    try {
      if (typeof message === "string") {
        messageObject = JSON.parse(message);
      } else {
        messageObject = message;
      }
    } catch (error) {
      console.error("Error parsing AI message:", error);
      messageObject = { text: message };
    }

    if (!messageObject || typeof messageObject !== "object") {
      messageObject = { text: String(message) };
    }

    if (!messageObject.text) {
      messageObject.text = String(message);
    }

    return (
      <div className="overflow-auto bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 rounded-xl p-4 border border-purple-500/30 shadow-lg">
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    loadMessagesFromDatabase();

    initializeSocket(room._id);

    receiveMessage("room-message", async (data) => {
      console.log("Received message data:", data);

      if (data.sender._id == "auraAI") {
        let messageData;

        try {
          if (typeof data.message === "string") {
            messageData = JSON.parse(data.message);
          } else {
            messageData = data.message;
          }
        } catch (error) {
          console.error("Error parsing message from auraAI:", error);
          messageData = {
            text: data.message || "Error parsing message",
          };
        }

        console.log("Parsed message:", messageData);

        try {
          await axios.post("/messages/create", {
            roomId: room._id,
            content: JSON.stringify(messageData),
            sender: "auraAI",
          });
        } catch (error) {
          console.error("Error saving AI message to database:", error);
        }

        scrollToBottom();
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        if (data.sender._id !== user._id) {
          setMessages((prevMessages) => [...prevMessages, data]);

          try {
            await axios.post("/messages/create", {
              roomId: room._id,
              content: data.message,
              sender: data.sender._id,
            });
          } catch (error) {
            console.error("Error saving received message to database:", error);
          }
        }
      }
    });

    axios
      .get(`/rooms/get-room/${location.state.room._id}`)
      .then((res) => {
        console.log(res.data.room);
        setRoom(res.data.room);
      })
      .catch((err) => {
        console.error("Error fetching room:", err);
      });

    axios
      .get("/user/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  function scrollToBottom() {
    setTimeout(() => {
      if (messageBox.current) {
        messageBox.current.scrollTop = messageBox.current.scrollHeight;
      }
    }, 100);
  }

  return (
    <main className="h-screen w-screen flex bg-gradient-to-br from-slate-950 via-zinc-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <section className="relative flex flex-col h-screen w-full z-10">
        <header className="flex justify-between items-center p-6 px-8 w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <i className="ri-chat-3-fill text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                {room.name || "Chat Room"}
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                {room.users?.length || 0} members online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="ri-user-add-fill text-lg"></i>
              <span className="font-semibold">Add Member</span>
            </button>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-4 bg-slate-800/60 hover:bg-slate-700/60 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-slate-600/30"
            >
              <i className="ri-group-fill text-lg"></i>
            </button>
          </div>
        </header>

        <div className="conversation-area flex-grow flex flex-col h-full relative overflow-hidden">
          <div
            ref={messageBox}
            className="message-box p-8 flex-grow flex flex-col gap-6 overflow-auto scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent"
          >
            {loadingMessages ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-12 h-12 border-4 border-zinc-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg font-medium">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                    <i className="ri-chat-3-line text-5xl text-white"></i>
                  </div>
                  <p className="text-2xl font-bold text-gray-300 mb-2">
                    Start the conversation!
                  </p>
                  <p className="text-gray-500 font-medium">
                    Send a message to begin chatting with your team.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-wrapper ${
                    msg.sender._id == user._id.toString()
                      ? "ml-auto"
                      : "mr-auto"
                  } max-w-4xl`}
                >
                  <div
                    className={`message flex flex-col p-6 rounded-3xl shadow-2xl backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] ${
                      msg.sender._id === "auraAI"
                        ? "bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 shadow-purple-500/20"
                        : msg.sender._id == user._id.toString()
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400/30 shadow-blue-500/20"
                        : "bg-gradient-to-r from-blue-700 to-indigo-500 border border-slate-600/30 shadow-slate-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg ${
                          msg.sender._id === "auraAI"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/25"
                            : msg.sender._id == user._id.toString()
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/25"
                            : "bg-gradient-to-r from-pink-500 via-black to-blue-500 text-white shadow-slate-500/25"
                        }`}
                      >
                        {msg.sender._id === "auraAI"
                          ? "🤖"
                          : (msg.sender.email || msg.sender._id)
                              ?.charAt(0)
                              .toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <small
                          className={`text-sm font-bold ${
                            msg.sender._id === "auraAI"
                              ? "text-purple-300"
                              : msg.sender._id == user._id.toString()
                              ? "text-blue-100"
                              : "text-gray-300"
                          }`}
                        >
                          {msg.sender._id === "auraAI"
                            ? "Aura AI"
                            : msg.sender.email || msg.sender._id}
                        </small>
                        <small
                          className={`text-xs opacity-75 font-medium ${
                            msg.sender._id === "auraAI"
                              ? "text-purple-400"
                              : msg.sender._id == user._id.toString()
                              ? "text-blue-200"
                              : "text-gray-400"
                          }`}
                        >
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </small>
                      </div>
                    </div>
                    <div
                      className={`text-base leading-relaxed font-medium ${
                        msg.sender._id === "auraAI"
                          ? "text-gray-100"
                          : msg.sender._id == user?._id?.toString()
                          ? "text-white"
                          : "text-gray-200"
                      }`}
                    >
                      {msg.sender._id === "auraAI" ? (
                        WriteAiMessage(msg.message)
                      ) : (
                        <p className="break-words">{msg.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="input-area p-8 bg-slate-900/60 backdrop-blur-xl border-t border-slate-700/50">
            <div className="flex items-center gap-6 bg-slate-800/60 backdrop-blur-sm rounded-3xl p-3 shadow-2xl border border-slate-600/30">
              <div className="flex items-center gap-4"></div>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow bg-transparent text-white placeholder-gray-400 px-6 py-4 border-none outline-none text-lg font-medium"
                type="text"
                placeholder="Type your message..."
              />
              <button
                onClick={send}
                disabled={!message.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform cursor-pointer font-bold"
              >
                <i className="ri-send-plane-fill text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`side-panel w-96 h-full flex flex-col bg-slate-900/90 backdrop-blur-xl border-l border-slate-700/50 absolute transition-all duration-500 ease-in-out ${
            isSidePanelOpen ? "translate-x-0" : "translate-x-full"
          } top-0 right-0 shadow-2xl`}
        >
          <header className="flex justify-between items-center px-8 py-6 bg-slate-800/60 backdrop-blur-sm border-b border-slate-600/30">
            <h1 className="font-bold text-xl text-white">Team Members</h1>
            <button
              onClick={() => setIsSidePanelOpen(false)}
              className="p-3 hover:bg-slate-700/60 rounded-2xl transition-all duration-300 text-gray-300 hover:text-white"
            >
              <i className="ri-close-fill text-lg"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-3 p-6 overflow-auto scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent">
            {room.users &&
              room.users.map((roomUser, index) => (
                <div
                  key={index}
                  className="user cursor-pointer hover:bg-slate-800/60 p-4 rounded-2xl flex gap-4 items-center transition-all duration-300 transform hover:scale-105 border border-slate-700/30 hover:border-purple-500/30"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/25">
                    <i className="ri-shield-user-line"></i>
                  </div>
                  <div className="flex-grow">
                    <h1 className="font-bold text-white text-lg">
                      {roomUser.email}
                    </h1>
                    <p className="text-sm text-gray-400 font-medium">
                      {roomUser._id === user._id ? "You" : "Team Member"}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="add-section fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl w-[500px] max-w-full relative shadow-2xl border border-slate-700/50">
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Add Team Members
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-slate-700/60 rounded-2xl transition-all duration-300 text-gray-400 hover:text-white"
              >
                <i className="ri-close-fill text-lg"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-3 mb-8 max-h-96 overflow-scroll">
              {users
                .filter((u) => !room.users?.find((ru) => ru._id === u._id))
                .map((user) => (
                  <div
                    key={user._id}
                    className={`user cursor-pointer hover:bg-slate-800/60 ${
                      selectedUserId.has(user._id)
                        ? "bg-slate-800/80 ring-2 ring-purple-500/50 border-purple-500/30"
                        : "border-slate-700/30"
                    } p-4 rounded-2xl flex gap-4 items-center transition-all duration-300 transform hover:scale-105 border`}
                    onClick={() => handleUserClick(user._id)}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="font-bold text-white text-lg flex-grow">
                      {user.email}
                    </h1>
                    {selectedUserId.has(user._id) && (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <i className="ri-check-fill text-white"></i>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <button
              onClick={addMembers}
              disabled={selectedUserId.size === 0}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg transform hover:scale-105"
            >
              Add {selectedUserId.size} Member
              {selectedUserId.size !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Room;
