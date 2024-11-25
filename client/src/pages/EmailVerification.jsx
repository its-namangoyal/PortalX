import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState("Verifying...");
  const { id, token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/auth/verify/${id}/${token}`
        );
        setVerificationStatus(response.data.message);
      } catch (error) {
        setVerificationStatus(error.response?.data?.message || "Verification failed");
      }
    };

    verifyEmail();
  }, [id, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{verificationStatus}</h2>
        {verificationStatus === "Email verified successfully" && (
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Proceed to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;