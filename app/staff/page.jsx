"use client"
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import StaffView from "../components/StaffView";

export default function Staff() {
    const [formData, setFormData] = useState({
        activeForms: {},
        submittedForms: {}
    });
    const socket = useRef(null);  

    useEffect(() => {
        socket.current = io();

        socket.current.on("connect", () => {
            console.log("Connected to WebSocket:", socket.current.id); 
        });

        socket.current.on("updateForms", (data) => {
            console.log("Received form data:", data);
            setFormData(data); 
        });

        socket.current.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
        });

        return () => {
            socket.current.disconnect();
            console.log("Socket disconnected");
        };
    }, []); 

    return (
        <div>
            <StaffView 
                activeForms={formData.activeForms || {}} 
                submittedForms={formData.submittedForms || {}} 
            />
        </div>
    );
}