import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../../api/blogApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";
import './css/bloglayout.css';

function BlogList() {
  const [page, setPage] = useState(0);
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", page],
    queryFn: () => getBlogs(page),
  });

  if (isLoading) return <div className="bloglist-state">Loading posts…</div>;
  if (error)     return <div className="bloglist-state">Could not load posts.</div>;

  return (
    <div className="bloglist-page">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="bloglist-hero">
        <div className="bloglist-hero-left">
          <span className="bloglist-hero-eyebrow">— A space for considered thought</span>
          <h1 className="bloglist-hero-title">
            Ideas worth<br /><em>sitting with.</em>
          </h1>
          <hr className="bloglist-hero-rule" />
          <p className="bloglist-hero-desc">
            Long-form writing, honest takes, and the occasional
            half-baked theory. No algorithmic pressure.
            Just thinking out loud.
          </p>
        </div>

        <div className="bloglist-hero-right">
          <div className="bloglist-hero-logo-wrap">
            <div className="bloglist-hero-logo">
              Thinking<em>OutLoud</em>
            </div>
            <div className="bloglist-hero-logo-sub">
              Est. 2026 · Long-form writing
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar bar ──────────────────────────────── */}
      <div className="ad">
        <span className="bloglist-section-title">Latest Posts</span>
        <span className="bloglist-count">
          Page {page + 1} of {data?.totalPages ?? "—"}
        </span>
        
      </div>

      {/* ── Grid + Pagination ────────────────────────── */}
      <div className="bloglist-content">
        <div className="blog-list">
          {data?.content?.map((blog) => (
            <div key={blog.id} className="blog-card1">
              <Link to={`/blogs/${blog.id}`} className="blog-card1-link">
                <div className="blog-card1-title-row">
                  <div>
                    <img src={blog.imageUrl} alt={blog.title} />
                    <div className="blog-card1-body">
                      <h3 className="blog-card1-title">{blog.title}</h3>
                      <div className="blog-card1-footer">
                        <span className="blog-card1-date">{blog.date ?? ""}</span>
                        <span className="blog-card1-arrow">Read →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="pagination-info">
            {page + 1} / {data?.totalPages ?? "—"}
          </span>
          <button
            className="pagination-btn"
            disabled={!data || page >= data.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

export default BlogList;