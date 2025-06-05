"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "@/context/AuthContext";

const TOGGLE_LIKE = gql`
  mutation LikePhoto($input: LikePhotoInput!) {
    likePhoto(input: $input) {
      liked
    }
  }
`;

export default function PhotoCard({ photo }) {
  const { token, user } = useAuth();
  const [liked, setLiked] = useState(photo.likedByCurrentUser);

  const [likePhoto] = useMutation(TOGGLE_LIKE, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: (data) => {
      setLiked(data.likePhoto.liked);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleLike = async () => {
    if (!user) return;
  
    try {
      const res = await likePhoto({
        variables: {
          input: { photoId: photo.id }, // ✅ wrapped in input
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
  
      setLiked(res.data.likePhoto.liked);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all border bg-white">
      <div className="relative">
        <img
          src={`http://localhost:3001${photo.imageUrl}`}
          alt={photo.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <a
          href={`http://localhost:3001${photo.imageUrl}`}
          download
          className="absolute top-2 right-2 bg-white/80 text-gray-700 hover:text-pink-600 p-2 rounded-full shadow transition"
          title="Download"
        >
          ⬇️
        </a>

        {user && (
          <button
            onClick={handleLike}
            className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-full shadow hover:scale-110 transition-transform"
            title={liked ? "Unlike" : "Like"}
          >
            {liked ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-blue-600 font-medium">Urban</p>
        <h3 className="text-lg font-semibold mt-1">{photo.title}</h3>
        <p className="text-xs text-gray-500 mt-1">by {photo.user.email}</p>
      </div>
    </div>
  );
}
