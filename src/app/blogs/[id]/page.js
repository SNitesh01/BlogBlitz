"use client";
import { auth, db } from "@/lib/firebase";
import truncateText, { formatTimestampToDate } from "@/lib/utils";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";

const Index = ({ params }) => {
  const { id } = params;
  const [blogData, setBlogData] = useState();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const router = useRouter()
  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const blogDocRef = doc(db, "blogs", id);
        const blogDocSnap = await getDoc(blogDocRef);
        if (blogDocSnap.exists()) {
          const blogData = { id: blogDocSnap.id, ...blogDocSnap.data() };
          setBlogData(blogData);
          setComments(blogData.comments || []);
        } else {
          console.log("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching single blog:", error);
      }
    };
    fetchSingleBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if(!auth.currentUser){
      toast.warning("Please login first")
      router.push("/login")
      return
    }
    const updatedComments = arrayUnion({
      text: newComment,
      created_at: Date.now(),
      userName: auth.currentUser.displayName,
    });

    const blogDocRef = doc(db, "blogs", id);
    try {
      await updateDoc(blogDocRef, { comments: updatedComments });
      setComments([
        ...comments,
        {
          text: newComment,
          created_at: Date.now(),
          userName: auth.currentUser.displayName,
        },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

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
                alt="img"
              />
              <span className="clr-black"> {blogData.userName}</span>
            </div>
            <div className="col-md-6">
              <img
                src={blogData.image}
                alt="img"
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
      <div className="mt-5">
        <h4>Comments</h4>
        {comments.length > 0 ? (
          <div className="mt-3">
            <ul style={{ listStyle: "none", padding: 0 }}>
              {comments.map((comment, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "15px",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "10px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    {comment.userName}{" "}
                    <span style={{ color: "#777", fontSize: "12px" }}>
                      {formatTimestampToDate(comment.created_at)}
                    </span>
                  </p>
                  <p style={{ fontSize: "16px" }}>{comment.text}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-3">
            <p>No any comments yet.</p>
          </div>
        )}
        {auth.currentUser?.uid === blogData?.userId ? (
          ""
        ) : (
          <form onSubmit={handleCommentSubmit}>
            <div className="form-group">
              <label htmlFor="comment">Add a Comment:</label>
              <textarea
                className="form-control"
                placeholder="Enter here"
                id="comment"
                rows="3"
                value={newComment}
                required
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Comment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;
