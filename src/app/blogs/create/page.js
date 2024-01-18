"use client";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, doc, refEqual, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

const Page = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    image: null,
    video: null,
    published: null,
  });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  const handleInputChange = (e) => {
    if (e.target.type === "file") {
      setBlogData({
        ...blogData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setBlogData({
        ...blogData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const collectionName = "blogs";
      if (!currentUser) {
        console.error("User not authenticated!");
        return;
      }
      const timestamp = Date.now();
      const imageStorage = getStorage();
      const imageRef = ref(
        imageStorage,
        `blog_images/${currentUser.uid}_${timestamp}_${blogData.image.name}`
      );
      await uploadBytes(imageRef, blogData.image);
      const imageUrl = await getDownloadURL(imageRef);

      const videoStorage = getStorage();
      const videoRef = ref(
        videoStorage,
        `blog_videos/${currentUser.uid}_${timestamp}_${blogData.video.name}`
      );
      await uploadBytes(videoRef, blogData.video);

      const videoUrl = await getDownloadURL(videoRef);
      const blogWithUser = {
        ...blogData,
        userId: currentUser.uid,
        userName: currentUser?.displayName,
        image: imageUrl,
        video: videoUrl,
      };

      await addDoc(collection(db, collectionName), blogWithUser);
      toast.success("Blog created successfully!");
      router.back();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <Card style={{ maxWidth: "700px", margin: "auto" }}>
        <Card.Body>
          <Card.Title className="text-start">Create Post</Card.Title>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="title">
              <Form.Label className="mt-2 mb-0">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter blog title"
                name="title"
                value={blogData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label className="mt-2 mb-0">Content</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter blog content"
                name="content"
                value={blogData.content}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label className="mt-2 mb-0">Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="image"
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="video">
              <Form.Label className="mt-2 mb-0">Video</Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                name="video"
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Create
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Page;
