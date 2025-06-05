"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import UploadModal from "../components/UploadModal";
import Link from "next/link";

const USER_PHOTOS_QUERY = gql`
  query {
    me {
      id
      email
      photos {
        id
        title
        imageUrl
      }
    }
  }
`;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [token, setToken] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  const { data, loading, error, refetch } = useQuery(USER_PHOTOS_QUERY, {
    skip: !token,
    context: token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {},
  });

  const photos = data?.me?.photos || [];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-pink-600 drop-shadow">
              🎨 Your Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome, <span className="text-pink-500 font-medium">{user?.email}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-pink-600 text-white font-medium px-6 py-2 rounded-full shadow hover:bg-pink-700 transition"
          >
            + Upload New Photo
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error loading photos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                <img
                  src={`http://localhost:3001${photo.imageUrl}`}
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onUploaded={() => {
          setModalOpen(false);
          refetch(); // Refresh photo list
        }}
      />
    </div>
  );
}
