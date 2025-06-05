"use client";

import { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import Header from "./components/Header";
import PhotoCard from "./components/PhotoCard";
import { useAuth } from "@/context/AuthContext";

const GET_PHOTOS = gql`
  query GetPhotos($limit: Int, $offset: Int, $titleContains: String) {
    photos(limit: $limit, offset: $offset, titleContains: $titleContains) {
      totalCount
      photos {
        id
        title
        imageUrl
        likedByCurrentUser
        user {
          email
        }
      }
    }
  }
`;

export default function HomePage() {
  const { token, user } = useAuth();
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 9;

  const [loadPhotos, { data, loading, error, fetchMore, refetch }] = useLazyQuery(GET_PHOTOS);

  // Wait until token is available to fire the query
  useEffect(() => {
    if (token) {
      loadPhotos({
        variables: { limit, offset, titleContains: search },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  }, [token, offset, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setOffset(0);
    if (token) {
      refetch({
        limit,
        offset: 0,
        titleContains: e.target.value,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  };

  const handleLoadMore = () => {
    fetchMore({
      variables: { offset: offset + limit, titleContains: search },
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          photos: {
            totalCount: fetchMoreResult.photos.totalCount,
            photos: [...prev.photos.photos, ...fetchMoreResult.photos.photos],
          },
        };
      },
    });
    setOffset(offset + limit);
  };

  const photos = data?.photos?.photos || [];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header search={search} handleSearch={handleSearch} />
 {/* Hero Section */}
 <section className="relative w-full h-[400px] bg-cover bg-center bg-[url('https://gratisography.com/wp-content/uploads/2020/07/gratisography-goofy-goggles-free-stock-photo.jpg')]">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white p-6 bg-white/90 backdrop-blur-md rounded-lg max-w-xl w-full">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Inspiring, Unique, and Free to Use.
        </h1>
        <p className="text-gray-700 mt-2">
          Discover a curated collection of high-quality, artistic photos — completely
          <span className="text-pink-600 font-semibold"> free </span>
          to use without any restrictions. Perfect for your next project, campaign, or creative idea.
        </p>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Search free photos..."
              className="flex-1 px-4 py-2 text-black  border rounded-l-lg focus:outline-none"
              value={search}
              onChange={handleSearch}
            />
            <button className="bg-pink-600 px-4 py-2 text-white rounded-r-lg font-semibold hover:bg-pink-700">
              🔍
            </button>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading && <p className="col-span-3 text-center">Loading...</p>}
        {error && <p className="col-span-3 text-center text-red-600">{error.message}</p>}

        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </main>

      {photos.length < data?.photos?.totalCount && (
        <div className="text-center mt-6 mb-10">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-md hover:bg-pink-700 transition-colors duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
