import { useState, useEffect, useRef } from 'react';
import FormField from './FormField';
import { getSocket, emitFormSubmit, emitPatientStatus } from '../api/socket/socket';
import { v4 as uuidv4 } from 'uuid';

export default function PatientForm() {
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    phoneNumber: '',
    email: '',
    address: '',
    preferredLanguage: '',
    nationality: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    religion: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('active');
  const [socket, setSocket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const activityTimeout = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const generatedUUID = uuidv4();
    setFormData((prevData) => ({
      ...prevData,
      id: generatedUUID,
    }));

    const socket = getSocket();
    setSocket(socket);

    return () => {
      if (activityTimeout.current) {
        clearTimeout(activityTimeout.current);
      }
    };
  }, [isClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedFormData = { ...prev, [name]: value };

      if (socket) {
        socket.emit("formData", updatedFormData);
      }

      return updatedFormData;
    });
  };

  const updateActivity = () => {
    if (status !== 'submitted') {
      if (status !== 'active') {
        setStatus('active');
        socket?.emit('patientStatus', { status: 'Actively filling' });
      }

      if (activityTimeout.current) clearTimeout(activityTimeout.current);

      activityTimeout.current = setTimeout(() => {
        setStatus('inactive');
        socket?.emit('patientStatus', { status: 'Inactive' });
        socket?.emit("")
      }, 5000);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.preferredLanguage.trim()) newErrors.preferredLanguage = 'Preferred language is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (formData.phoneNumber && !/^\+?\d{8,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    emitFormSubmit(formData);
    emitPatientStatus("submitted");

    setStatus("submitted");

    if (socket) {
      socket.emit("formSubmit", formData);
    }
    setModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: isClient ? uuidv4() : '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      phoneNumber: '',
      email: '',
      address: '',
      preferredLanguage: '',
      nationality: '',
      emergencyContactName: '',
      emergencyContactRelation: '',
      religion: '',
    });
    setErrors({});
    setStatus('active');
    setModalOpen(false);

    if (socket) {
      socket.emit("resetForms");
    }
  };

  const getStatusBadgeClass = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {

    switch (status) {
      case 'active':
        return 'Actively filling form';
      case 'inactive': {
        return 'Inactive';

      }
      case 'submitted':
        return 'Submitted';
      default:
        return 'Unknown';
    }
  };

  if (!isClient) {
    return <div className="max-w-2xl mx-auto p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-indigo-800 mb-2">Patient Information Form</h1>
        <div className="h-1 w-24 bg-indigo-600 mx-auto rounded"></div>
      </div>
      <div className="animate-pulse">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="h-20">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-indigo-800 mb-2">Patient Information Form</h1>
        <div className="h-1 w-24 bg-indigo-600 mx-auto rounded"></div>
      </div>

      <form onSubmit={handleSubmit} onClick={updateActivity} onChange={updateActivity} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            error={errors.firstName}
          />
          <FormField
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            error={errors.middleName}
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            error={errors.lastName}
          />
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            error={errors.dateOfBirth}
          />
          <FormField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            error={errors.phoneNumber}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FormField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            error={errors.address}
          />
          <FormField
            label="Preferred Language"
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            required
            error={errors.preferredLanguage}
          />
          <FormField
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            error={errors.nationality}
          />
          <FormField
            label="Religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            error={errors.religion}
          />
          <FormField
            label="Emergency Contact Name"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            error={errors.emergencyContactName}
          />
          <FormField
            label="Emergency Contact Relation"
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation}
            onChange={handleChange}
            error={errors.emergencyContactRelation}
          />
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusBadgeClass()}`}>
              <div className={`h-2 w-2 rounded-full mr-2 ${status === 'active' ? 'bg-green-500' : status === 'inactive' ? 'bg-yellow-500' : 'bg-purple-500'}`}></div>
              <span className="text-sm font-medium">
                Status: {getStatusText()}
              </span>
            </div>

            <button
              type="submit"
              disabled={status === 'submitted'}
              className={`w-full sm:w-auto text-white font-medium py-2 px-6 rounded-md transition duration-200 ${status === 'submitted' ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              Submit
            </button>
          </div>
        </div>
      </form>

      {modalOpen && (
        <div className="fixed inset-0  bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl border border-indigo-100 w-4/5 max-w-md mx-auto z-10">
            <div className="h-12 w-12 rounded-full bg-indigo-100 mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center text-indigo-800">Form Submitted Successfully!</h2>
            <p className="mt-3 text-sm text-slate-600 text-center">Your information has been received and will be processed shortly.</p>
            <div className="flex justify-center mt-6">
              <button
                onClick={resetForm}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
              >
                Close and Reset Form
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="text-center text-gray-500 text-xs mt-4">
        Patient Form Dashboard © {new Date().getFullYear()}
      </div>
    </div>
  );
}