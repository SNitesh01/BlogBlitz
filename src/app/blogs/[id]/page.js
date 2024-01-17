"use client";
import { db } from "@/lib/firebase";
import truncateText, { formatTimestampToDate } from "@/lib/utils";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

const Index = ({ params }) => {
  const { id } = params;
  const [blogData, setBlogData] = useState();

  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const blogDocRef = doc(db, "blogs", id);
        const blogDocSnap = await getDoc(blogDocRef);
        if (blogDocSnap.exists()) {
          const blogData = { id: blogDocSnap.id, ...blogDocSnap.data() };
          setBlogData(blogData);
        } else {
          console.log("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching single blog:", error);
      }
    };
    fetchSingleBlog();
  }, [id]);

  return (
    <div className="container mb-5 mt-5">
      {blogData && (
        <div>
          <div className="row">
            <div className="col-md-6">
              <h6 className="text-secondary">Resources</h6>
              <h1 className="mb-3 font-weight-bold">{blogData.title}</h1>
              <p className="mb-3">{truncateText(blogData.content, 25)}</p>
              <p className="mb-3">
                {formatTimestampToDate(blogData.created_at)}
              </p>
              <Image
                width={45}
                height={45}
                src={blogData.image}
                roundedCircle
              />
              <span> {blogData.userName}</span>
            </div>
            <div className="col-md-6">
              <img
                src={blogData.image}
                alt={blogData.title}
                className="img-fluid rounded"
              />
            </div>
          </div>
          <div
            style={{
              width: "70%",
              margin: "auto",
              marginTop: "20px",
              fontSize: "20px",
              lineHeight: "2.7",
            }}
          >
            <p>{blogData.content}</p>
            {blogData.video && (
              <div style={{ textAlign: "center" }}>
                <video
                  controls
                  style={{ width: "80%", maxWidth: "600px", margin: "auto" }}
                  className="mt-3"
                >
                  <source src={blogData.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
