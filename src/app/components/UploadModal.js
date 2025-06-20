"use client";

import { gql, useMutation } from "@apollo/client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const UPLOAD_PHOTO = gql`
  mutation UploadPhoto($input: UploadPhotoInput!) {
    uploadPhoto(input: $input) {
      id
      title
      imageUrl
    }
  }
`;

export default function UploadModal({ isOpen, onClose, onUploaded }) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [uploadPhoto, { loading, error }] = useMutation(UPLOAD_PHOTO);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert("Please select an image");

    await uploadPhoto({
      variables: {
        input: { title, image },
      },
      context: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });

    setTitle("");
    setImage(null);
    setPreview(null);
    onUploaded(); // callback to refresh and close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition">
      <div className="bg-white w-full max-w-lg mx-auto p-6 rounded-xl shadow-lg relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-pink-600">📤 Upload New Photo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded px-4 py-2"
            type="text"
            placeholder="Photo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700">
            Choose Image:
            <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileInput"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
              <label
                htmlFor="fileInput"
                className="inline-block mt-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded cursor-pointer transition"
              >
                Browse
              </label>
            </div>
          </label>

          {preview && (
            <div className="mt-4">
                <p className="text-sm text-gray-500">Image Preview:</p>
                <div className="w-full h-64 overflow-hidden rounded border mt-2 bg-gray-100 flex items-center justify-center">
                <img
                    src={preview}
                    alt="Preview"
                    className="object-contain max-h-full max-w-full"
                />
                </div>
            </div>
            )}


          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Photo"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-1">🚫 {error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
