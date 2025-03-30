import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
    if (!socket) {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
        console.log("Connecting to Socket.IO server at:", socketUrl); 

        socket = io(socketUrl, {
            transports: ["websocket"], 
            reconnectionAttempts: 5,  
            reconnectionDelay: 2000,   
        });

        socket.on("connect", () => {
            console.log("Connected to socket server with ID:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });
       
    }

    return socket;
}


export function emitFormSubmit(form) {
    const socketInstance = getSocket();
    socketInstance.emit("formSubmit", form);
}

export function addSocketListener(event, callback) {
    const socketInstance = getSocket();
    socketInstance.on(event, callback);
    return () => {
      socketInstance.off(event, callback);
    };
  }
export function emitPatientStatus(status) {
    const socketInstance = getSocket();
    socketInstance.emit('patientStatus', { status });
}
