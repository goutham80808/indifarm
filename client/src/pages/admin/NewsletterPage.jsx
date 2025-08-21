"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubscribers } from "../../redux/slices/newsletterSlice";
import Loader from "../../components/Loader";
import { FaEnvelope, FaUsers, FaDownload, FaTrash } from "react-icons/fa";

const NewsletterPage = () => {
  const dispatch = useDispatch();
  const { subscribers, loading } = useSelector((state) => state.newsletter);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);

  useEffect(() => {
    dispatch(getAllSubscribers());
  }, [dispatch]);

  useEffect(() => {
    if (subscribers) {
      const filtered = subscribers.filter((subscriber) =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    }
  }, [subscribers, searchTerm]);

  const handleExportCSV = () => {
    if (!subscribers || subscribers.length === 0) return;

    const csvContent = [
      "Email,Subscribed Date,Status",
      ...subscribers.map((sub) => 
        `${sub.email},${new Date(sub.subscribedAt).toLocaleDateString()},${sub.isActive ? 'Active' : 'Inactive'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Newsletter Management</h1>
        <div className="flex gap-4">
          <button
            onClick={handleExportCSV}
            disabled={!subscribers || subscribers.length === 0}
            className="btn btn-outline flex items-center gap-2 disabled:opacity-50"
          >
            <FaDownload />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-green-500 text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {subscribers ? subscribers.length : 0}
          </h3>
          <p className="text-gray-600">Total Subscribers</p>
        </div>

        <div className="glass p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-blue-500 text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {subscribers ? subscribers.filter(s => s.isActive).length : 0}
          </h3>
          <p className="text-gray-600">Active Subscribers</p>
        </div>

        <div className="glass p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-purple-500 text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {subscribers ? subscribers.filter(s => !s.isActive).length : 0}
          </h3>
          <p className="text-gray-600">Unsubscribed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search subscribers by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      {filteredSubscribers && filteredSubscribers.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subscriber.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Remove subscriber"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaEnvelope className="text-gray-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? "No subscribers found" : "No subscribers yet"}
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Subscribers will appear here once they sign up for the newsletter."}
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsletterPage;
