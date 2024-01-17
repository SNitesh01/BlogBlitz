"use client";
import BannerSection from "@/components/Banner/BannerSection";
import BlogCard from "@/components/BlogCard";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [publishedBlogData, setPublishedBlogData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsCollectionRef = collection(db, "blogs");
        const publishedBlogsQuery = query(
          blogsCollectionRef,
          where("published", "==", true)
        );
        const publishedBlogsSnapshot = await getDocs(publishedBlogsQuery);
        const blogs = [];
        for (const doc of publishedBlogsSnapshot.docs) {
          const blogData = doc.data();
          const blogWithUser = {
            id: doc.id,
            ...blogData,
          };
          blogs.push(blogWithUser);
        }
        setPublishedBlogData(blogs);
      } catch (error) {
        console.error("Error fetching published blogs:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <BannerSection />
      <div className="container mb-5">
        <div className="row">
          {publishedBlogData && publishedBlogData.map((blog) => (
            <div key={blog.id} className="col-md-4">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
