"use client";
import React from 'react';
import { FaWhatsapp, FaEnvelope, FaUser, FaPhone } from 'react-icons/fa';

const Help = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/201117254520', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:eng.yousefk2024@gmail.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
            Need Help?
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            Get in touch with the developer
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Developer Info Card */}
          <div className="bg-white text-black p-8 rounded-lg shadow-xl border border-gray-200 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <FaUser className="text-3xl mr-4" />
              <h2 className="text-2xl font-bold">Developer</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Yousef Khaled</h3>
                <p className="text-gray-600">Quiz App Developer</p>
              </div>
              <div>
                <p className="text-gray-600">
                  Passionate developer creating interactive quiz applications
                  to enhance learning experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Methods Card */}
          <div className="bg-white text-black p-8 rounded-lg shadow-xl border border-gray-200 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <FaPhone className="text-3xl mr-4" />
              <h2 className="text-2xl font-bold">Contact Methods</h2>
            </div>
            <div className="space-y-6">
              {/* WhatsApp */}
              <div 
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center md:justify-start p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
              >
                <FaWhatsapp className="text-2xl text-green-400" />
                <div className="ml-4">
                  <p className="font-semibold hidden md:block">WhatsApp</p>
                  <p className="text-sm text-gray-600">0111 7254520</p>
                </div>
              </div>

              {/* Email */}
              <div 
                onClick={handleEmailClick}
                className="flex items-center justify-center md:justify-start p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
              >
                <FaEnvelope className="text-2xl text-blue-400" />
                <div className="ml-4">
                  <p className="font-semibold hidden md:block">Email</p>
                  <p className="text-sm text-gray-600">eng.yousefk2024@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleWhatsAppClick}
            className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
          >
            <FaWhatsapp className="mr-3 text-xl" />
            Contact via WhatsApp
          </button>
          
          <button 
            onClick={handleEmailClick}
            className="bg-white text-black border-2 border-black px-8 py-4 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            <FaEnvelope className="mr-3 text-xl" />
            Send Email
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-8 border-t-2 border-black">
          <p className="text-gray-600 text-lg">
            Thank you for using our Quiz App!
          </p>
          <p className="text-gray-500 mt-2">
            Feel free to reach out with any questions or feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;