import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import truncateText, { formatTimestampToDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const BlogCard = ({ blog }) => {
  const router = useRouter();
  const { title, content, image, video, id, created_at, userName, published } =
    blog;

  return (
    <Card className="mt-5">
      {/* {video && (
                <video width="100%" height="180" controls>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )} */}
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{truncateText(title, 5)}</Card.Title>
        <Card.Text>{truncateText(content, 20)}</Card.Text>
        <Button variant="primary" onClick={() => router.push(`/blogs/${id}`)}>
          Read More
        </Button>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          Published by {userName} <br />
          {formatTimestampToDate(created_at)}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default BlogCard;
