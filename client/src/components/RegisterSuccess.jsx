import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Registration Successful!
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <p className="text-green-800">
            A verification email has been sent to your UWindsor email address.
          </p>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>Please check your email (including spam folder) and click the verification link.</p>
          <p className="text-sm">
            The verification link will expire in 1 hour.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-500">
            Didn't receive the email?
          </p>
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={() => {
              // Add resend verification email functionality here
              alert("Verification email resent. Please check your inbox.");
            }}
          >
            Resend Verification Email
          </button>
          <Link
            to="/login"
            className="block text-blue-600 hover:text-blue-800 text-sm mt-4"
          >
            Already verified? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;