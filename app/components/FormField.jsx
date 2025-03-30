import React, { useEffect, useState } from 'react';

export default function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  error, 
  type = 'text' 
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="mb-1">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {isClient ? (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-1 
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
            } 
            text-sm`}
        />
      ) : (
        <div className="w-full h-10 bg-slate-100 rounded-md"></div>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}