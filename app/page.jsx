import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-200 max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Patient Information</h1>
        <p className="text-gray-600 mb-6 text-lg">Agnos Candidate Assignment</p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/patient">
            <div className="px-8 py-4 bg-blue-500 text-white text-lg font-medium rounded-xl shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105">
              🏥 Patient Form
            </div>
          </Link>
          <Link href="/staff">
            <div className="px-8 py-4 bg-green-500 text-white text-lg font-medium rounded-xl shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105">
              👩‍⚕️ Staff View
            </div>
          </Link>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-4">
        Patient Form Dashboard © {new Date().getFullYear()}
      </div>
    </div>
  );
}
