import React from 'react';
import { Users, BarChart3, Zap, ShieldCheck, Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-blue-700">TicketScribe AI</div>
          <div className="hidden md:flex space-x-8 text-gray-700 font-semibold">
            <a href="/" className="hover:text-blue-600 transition">Home</a>
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#testimonials" className="hover:text-blue-600 transition">Testimonials</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
          </div>
          <div className="space-x-4">
            <a
              href="/signin"
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="inline-block px-6 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-50 transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20 px-6">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">Welcome to TicketScribe AI</h1>
        <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
          AI-powered ticket management and analytics platform to streamline your support workflow.
        </p>
      </header>

      {/* Features Section */}
      <main id="features" className="max-w-6xl mx-auto px-6 py-20 space-y-20">
        <section className="text-center">
          <h2 className="text-4xl font-semibold mb-10">Why Choose TicketScribe AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">AI-Powered Classification</h3>
              <p className="text-gray-600">
                Automatically classify and route support tickets with high accuracy using advanced machine learning models.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
              <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Comprehensive Analytics</h3>
              <p className="text-gray-600">
                Gain insights into your support operations with detailed analytics dashboards and reports.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Multi-Role Support</h3>
              <p className="text-gray-600">
                Tailored dashboards and tools for administrators, support agents, and customers.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
              <ShieldCheck className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Built with security best practices to protect your data and ensure reliable service.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-white rounded-xl shadow-lg p-12 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">What Our Clients Say</h2>
          <blockquote className="italic text-gray-700">
            "TicketScribe AI transformed our support process. The AI classification is incredibly accurate and saves us hours every day."
          </blockquote>
          <cite className="block mt-4 font-semibold text-gray-900">- Jane Doe, Support Manager</cite>
        </section>

        {/* Footer Section */}
        <footer id="contact" className="bg-gray-100 py-12 text-gray-700">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">About TicketScribe AI</h3>
              <p className="text-sm">
                TicketScribe AI is an AI-powered ticket management and analytics platform designed to streamline support workflows and improve customer satisfaction.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-blue-600 transition">Home</a></li>
                <li><a href="#features" className="hover:text-blue-600 transition">Features</a></li>
                <li><a href="#testimonials" className="hover:text-blue-600 transition">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-blue-600 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <p className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>support@ticketscribe.ai</span>
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="https://facebook.com" aria-label="Facebook" className="hover:text-blue-600 transition"><Facebook className="w-6 h-6" /></a>
                <a href="https://twitter.com" aria-label="Twitter" className="hover:text-blue-600 transition"><Twitter className="w-6 h-6" /></a>
                <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-blue-600 transition"><Linkedin className="w-6 h-6" /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TicketScribe AI. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
