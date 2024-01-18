"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import truncateText from "@/lib/utils";

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [blogData, setBlogData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) {
          return;
        }
        const blogsCollectionRef = collection(db, "blogs");
        const userBlogsQuery = query(
          blogsCollectionRef,
          where("userId", "==", currentUser.uid)
        );
        const blogsSnapshot = await getDocs(userBlogsQuery);

        const blogs = [];
        blogsSnapshot.forEach((doc) => {
          blogs.push({ id: doc.id, ...doc.data() });
        });

        setBlogData(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    const getCurrentUserAndFetchData = async () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      fetchData();
      return () => unsubscribe();
    };

    getCurrentUserAndFetchData();
  }, [currentUser, auth]);
  const handlePublish = async (blog) => {
    try {
      if (!currentUser) {
        return;
      }
      const blogRef = doc(db, "blogs", blog.id);
      const updatedBlogData = {
        published: !blog?.published,
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      await updateDoc(blogRef, updatedBlogData);
      setBlogData((prevBlogs) =>
        prevBlogs.map((b) =>
          b.id === blog.id ? { ...b, published: !blog.published } : b
        )
      );
      toast.success("Your blog is published");
      router.push("/");
    } catch (error) {
      console.error("Error publishing blog:", error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-end mb-3">
        <Link
          style={{ border: "1px solid black", color:"black" }}
          className="nav-link p-1"
          href="/blogs/create"
        >
          Create Blog
        </Link>
      </div>
      <div className="row">
        <h3>Your Blogs</h3>
        {blogData.length > 0 ? (
          blogData.map((blog) => (
            <div key={blog.id} className="col-md-4 mb-4">
              <Card>
                <Card.Img variant="top" src={blog.image} />
                <Card.Body>
                  <Card.Title>{truncateText(blog.title, 10)}</Card.Title>
                  <Card.Text>{truncateText(blog.content, 20)}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant={!blog.published ? "success" : "danger"}
                      size="sm"
                      onClick={() => handlePublish(blog)}
                    >
                      {blog.published ? "Unpublish" : "Publish"}
                    </Button>
                    {blog.published ?  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => router.push(`/blogs/${blog.id}`)}
                    >
                      View
                    </Button>
                  
                  </div>:""}
                  </div>
                
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-md-12 text-center">
            <p>You have not created any posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
