"use client";
import React, { useEffect, useState } from "react";
import { getSocket } from "../api/socket/socket";

export default function StaffView({ activeForms, submittedForms }) {
    const activeFormsObj = activeForms || {};
    const submittedFormsObj = submittedForms || {};

    const [activeStatus, setActiveStatus] = useState("Actively Filling");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const socket = getSocket();
        socket.on("patientStatus", (data) => {
            if (data && data.status) {
                setActiveStatus(data.status);
            }
        });
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => {
            socket.off("patientStatus");
            clearTimeout(timer);
        };
    }, []);

    const getStatusBadgeClass = (status) => {
        if (status === "Inactive") {
            return "bg-yellow-100 text-yellow-700 border border-yellow-300";
        } else if (status === "Complete") {
            return "bg-green-100 text-green-700 border border-green-300";
        } else {
            return "bg-blue-100 text-blue-700 border border-blue-300";
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-6">
            <div className="w-full max-w-7xl mx-auto p-0 sm:p-2 md:p-4 lg:p-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-5 sm:py-6 px-4 sm:px-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                            Patient Form Dashboard
                        </h1>
                        <p className="text-blue-100 text-center mt-2 text-sm sm:text-base">
                            ระบบติดตามแบบฟอร์มของผู้ป่วยแบบเรียลไทม์
                        </p>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 animate-pulse"></div>
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-bold text-blue-700">
                                            Active Forms
                                        </h2>
                                        <div className="ml-auto">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                {Object.keys(activeFormsObj).length}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                                    {Object.keys(activeFormsObj).length === 0 ? (
                                        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            <p className="text-gray-500 font-medium">ไม่มีแบบฟอร์มที่กำลังดำเนินการอยู่</p>
                                            <p className="text-gray-400 text-sm mt-1">แบบฟอร์มที่กำลังดำเนินการจะแสดงที่นี่</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 sm:space-y-4">
                                            {Object.values(activeFormsObj).map((form) => (
                                                <div
                                                    key={form.id || Math.random()}
                                                    className="bg-blue-50 hover:bg-blue-100 transition-colors duration-200 border border-blue-200 rounded-lg p-4 hover:shadow-md"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-blue-100">
                                                        <h3 className="font-bold text-blue-800">
                                                            <span className="inline-flex items-center">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                                </svg>
                                                                Patient {form.id}
                                                            </span>
                                                        </h3>
                                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(activeStatus)}`}>
                                                            {activeStatus}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {form && Object.entries(form).map(
                                                            ([key, value]) =>
                                                                key !== "id" && (
                                                                    <div key={key} className="flex flex-col sm:flex-row text-sm">
                                                                        <span className="font-medium text-gray-600 mb-1 sm:mb-0 sm:w-1/2 truncate">
                                                                            {key}:
                                                                        </span>
                                                                        <span className="text-gray-800 break-words sm:w-1/2 truncate">{value}</span>
                                                                    </div>
                                                                )
                                                        )}
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-100 to-green-50 border-b border-green-200 p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-bold text-green-700">
                                            Submitted Forms
                                        </h2>
                                        <div className="ml-auto">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                {Object.keys(submittedFormsObj).length}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                                    {Object.keys(submittedFormsObj).length === 0 ? (
                                        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                            </svg>
                                            <p className="text-gray-500 font-medium">ยังไม่มีแบบฟอร์มที่ส่งแล้ว</p>
                                            <p className="text-gray-400 text-sm mt-1">แบบฟอร์มที่ส่งเรียบร้อยแล้วจะแสดงที่นี่</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 sm:space-y-4">
                                            {Object.values(submittedFormsObj).map((form) => (
                                                <div
                                                    key={form.id || Math.random()}
                                                    className="bg-green-50 hover:bg-green-100 transition-colors duration-200 border border-green-200 rounded-lg p-4 hover:shadow-md"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-green-100">
                                                        <h3 className="font-bold text-green-800">
                                                            <span className="inline-flex items-center">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                                </svg>
                                                                Patient {form.id}
                                                            </span>
                                                        </h3>
                                                        <span className="px-2.5 py-1 bg-green-100 text-green-700 border border-green-300 text-xs font-medium rounded-full">
                                                            Complete
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {form && Object.entries(form).map(
                                                            ([key, value]) =>
                                                                key !== "id" && (
                                                                    <div key={key} className="flex flex-col sm:flex-row text-sm">
                                                                        <span className="font-medium text-gray-600 mb-1 sm:mb-0 sm:w-1/2 truncate">
                                                                            {key}:
                                                                        </span>
                                                                        <span className="text-gray-800 break-words sm:w-1/2 truncate">
                                                                            {value}
                                                                        </span>
                                                                    </div>
                                                                )
                                                        )}
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-500 text-xs mt-4">
                    Patient Form Dashboard © {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
}