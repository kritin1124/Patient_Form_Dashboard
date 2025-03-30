"use client";
import { useState, useEffect,useRef } from "react";
import io from "socket.io-client";
import PatientForm from "../components/PatientForm";

export default function PatientPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        address: '',
        preferredLanguage: '',
        nationality: '',
        emergencyContactName: '',
        emergencyContactRelation: '',
        religion: '',
    });

    const socket = useRef(null);

    useEffect(() => {
        socket.current = io();
        socket.current.on("connect", () => {
            console.log("Connected to WebSocket:", socket.current.id);
        });

        socket.current.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.current.emit("formData", formData);
    };

    return (
        <div>
            <PatientForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
        </div>
    );
}
