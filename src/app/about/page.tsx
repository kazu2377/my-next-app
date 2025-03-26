import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Our Reservation System</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
        <p className="mb-4">
          We provide an easy-to-use reservation system for businesses and customers.
          Our platform allows you to book appointments with just a few clicks.
        </p>
        <p>
          Whether you're scheduling a meeting, reserving a table, or booking a service,
          our system is designed to make the process simple and efficient.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-2"><strong>Email:</strong> contact@example.com</p>
        <p className="mb-2"><strong>Phone:</strong> +1-123-456-7890</p>
        <p><strong>Address:</strong> 123 Reservation St, Business City, 12345</p>
      </div>
    </div>
  );
}