import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (roomId) => {
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            roomId  // Changed from projectId to roomId
        }
    });

    return socketInstance;
}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}

// Optional: Add error handling
export const handleConnectionError = (cb) => {
    if (socketInstance) {
        socketInstance.on('connect_error', cb);
    }
}

// Optional: Add connection success handler
export const handleConnection = (cb) => {
    if (socketInstance) {
        socketInstance.on('connect', cb);
    }
}