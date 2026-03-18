import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "../../api/blogApi";
import DOMPurify from "dompurify";
import CommentSection from "../comments/CommentSection";
import { useAuthStore } from "../auth/authStore";
import './css/blog.css';
import "../admin/css/tiptap.css";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
  });

  if (isLoading) return <div className="blog-state">Loading post…</div>;
  if (error)     return <div className="blog-state">Could not load post.</div>;

  const sanitizedContent = DOMPurify.sanitize(data.content);

  return (
    <div className="blog-page">

      {/* ── Hero image ── */}
      {data.imageUrl && (
        <img
          className="blog-hero"
          src={data.imageUrl}
          alt={data.title}
        />
      )}

      <article className="blog-container">

        {/* ── Header ── */}
        <header className="blog-header">
          <span className="blog-eyebrow">ThinkingOutLoud </span>
          <h1 className="blog-title">{data.title}</h1>

          <div className="blog-meta-row">
            <time className="blog-date">
              {new Date(data.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>

            {role === "ROLE_ADMIN" && (
              <button
                className="blog-edit-btn"
                onClick={() => navigate(`/admin/editor/${id}`)}
              >
                Edit Post
              </button>
            )}
          </div>
        </header>

        {/* ── Body ── */}
        <div
          className="tiptap"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* ── Comments ── */}
        <div className="blog-comments-divider" />
        <CommentSection blogId={id} />

      </article>
    </div>
  );
}

export default BlogDetails;