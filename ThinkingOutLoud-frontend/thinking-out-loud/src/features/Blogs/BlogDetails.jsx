import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "../../api/blogApi";
import DOMPurify from "dompurify";
import CommentSection from "../comments/CommentSection";
import { useAuthStore } from "../auth/authStore";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] dark:bg-[#121212]">
      <div className="text-zinc-500 dark:text-zinc-400 font-medium animate-pulse text-lg">Loading post…</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] dark:bg-[#121212]">
      <div className="text-red-500 dark:text-red-400 font-medium text-lg">Could not load post.</div>
    </div>
  );

  const sanitizedContent = DOMPurify.sanitize(data.content);

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#121212] pb-24 animate-fade-in transition-colors duration-300">
      
      {data.imageUrl && (
        <div className="w-full max-h-[500px] overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
          <img
            className="w-full h-full object-cover max-h-[500px]"
            src={data.imageUrl}
            alt={data.title}
          />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 mt-12 md:mt-16">
        
        <header className="border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-12 space-y-4">
          <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">ThinkingOutLoud</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight tracking-tight">
            {data.title}
          </h1>

          <div className="flex items-center justify-between pt-4">
            <time className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
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
                className="text-xs font-semibold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-850 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 px-4 py-2 rounded-full shadow-sm transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/editor/${id}`)}
              >
                Edit Post
              </button>
            )}
          </div>
        </header>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-800 my-16" />
        <CommentSection blogId={id} />

      </article>
    </div>
  );
}

export default BlogDetails;

