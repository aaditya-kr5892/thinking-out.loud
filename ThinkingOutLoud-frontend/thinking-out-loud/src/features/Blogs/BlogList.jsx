import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogs, deleteBlog } from "../../api/blogApi";
import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";
import ConfirmationModal from "../../components/ConfirmationModal";

const getSnippet = (htmlContent) => {
  if (!htmlContent) return "";
  const cleanText = htmlContent.replace(/<[^>]*>/g, " "); 
  const decodedText = cleanText
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  const trimmed = decodedText.trim().replace(/\s+/g, " ");
  return trimmed.length > 150 ? trimmed.slice(0, 150) + "..." : trimmed;
};

function BlogList() {
  const [page, setPage] = useState(0);
  const { role } = useAuthStore();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  const handleDeleteBlog = (e, blogId) => {
    e.preventDefault();
    setSelectedBlogId(blogId);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBlogId) {
      deleteMutation.mutate(selectedBlogId);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", page],
    queryFn: () => getBlogs(page),
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] dark:bg-[#121212]">
      <div className="text-neutral-500 dark:text-neutral-400 font-medium animate-pulse text-lg">Loading posts…</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] dark:bg-[#121212]">
      <div className="text-red-500 dark:text-red-400 font-medium text-lg">Could not load posts. Please try again.</div>
    </div>
  );

  const posts = data?.content || [];
  const featuredPost = (page === 0 && posts.length > 0)
    ? posts.reduce((max, p) => (p.id > max.id ? p : max), posts[0])
    : null;
  const feedPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#121212] px-6 py-12 md:py-20 animate-fade-in transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* ── Hero ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">— A space for considered thought</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
              Ideas worth<br /><span className="italic font-light text-neutral-500 dark:text-neutral-400">sitting with.</span>
            </h1>
            <div className="w-16 h-[2px] bg-neutral-300 dark:bg-neutral-700" />
            <p className="text-neutral-600 dark:text-neutral-355 text-lg leading-relaxed max-w-md font-light">
              Long-form writing, honest perspectives, and deep dives into what interests me. Just thinking out loud.
            </p>
          </div>

          <div className="hidden md:flex justify-center md:justify-end">
            <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white/50 dark:bg-[#1c1c1c]/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm text-center max-w-sm space-y-4">
              <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Thinking<span className="italic font-light text-neutral-500 dark:text-neutral-400">OutLoud</span>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Long-form writing, Just thinking out loud</p>
              <div className="h-[1px] bg-neutral-200 dark:bg-neutral-850 w-full" />
              <p className="text-sm text-neutral-500 dark:text-neutral-450 font-light">Quiet thoughts for a loud internet.<br></br> Read at your own pace..</p>
            </div>
          </div>
        </div>


        <div className="flex justify-between items-end border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-12">
          <div className="space-y-1">
            <h2 className="text-xl text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-medium">All Publications</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-medium"></p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 bg-neutral-100 dark:bg-[#1c1c1c] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full shadow-sm">
            Page {page + 1} of {data?.totalPages ?? "—"}
          </span>
        </div>

        {/* ── Featured Banner Article (Page 1 Only) ─────── */}
        {featuredPost && (
          <article className="group bg-white dark:bg-[#1c1c1c] border border-neutral-200/60 dark:border-neutral-800 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-500 ease-out mb-16 p-6">
            <Link to={`/blogs/${featuredPost.id}`} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {featuredPost.imageUrl && (
                <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-850 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  <img 
                    src={featuredPost.imageUrl} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                </div>
              )}
              <div className={`space-y-4 flex flex-col justify-center ${featuredPost.imageUrl ? "lg:col-span-5" : "lg:col-span-12"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Latest Publication</span>
                  </div>
                  {role === "ROLE_ADMIN" && (
                    <button
                      onClick={(e) => handleDeleteBlog(e, featuredPost.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-500 ease-out">
                  {featuredPost.title}
                </h3>
                
                <p className="text-sm text-neutral-500 dark:text-neutral-455 leading-relaxed font-light line-clamp-3">
                  {getSnippet(featuredPost.content)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider pt-4 border-t border-neutral-100 dark:border-neutral-850">
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:translate-x-1.5 transition-transform duration-500 ease-out">Read Essay →</span>
                </div>
              </div>
            </Link>
          </article>
        )}

        {/* ── Card Grid (Remaining Posts) ────────────────── */}
        {feedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {feedPosts.map((blog) => (
              <article 
                key={blog.id} 
                className="group bg-white dark:bg-[#1c1c1c] border border-neutral-200/60 dark:border-neutral-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-500 ease-out flex flex-col h-full"
              >
                <Link to={`/blogs/${blog.id}`} className="flex flex-col h-full">
                  {blog.imageUrl && (
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-850 border-b border-neutral-100 dark:border-neutral-850">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-450 dark:text-neutral-550 font-light font-medium uppercase tracking-wider">Publication</span>
                        {role === "ROLE_ADMIN" && (
                          <button
                            onClick={(e) => handleDeleteBlog(e, blog.id)}
                            className="p-1 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete Post"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-500 ease-out">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-455 leading-relaxed font-light line-clamp-2">
                        {getSnippet(blog.content)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider pt-2 border-t border-neutral-100 dark:border-neutral-850">
                      <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:translate-x-1.5 transition-transform duration-500 ease-out">Read →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          page > 0 && (
            <div className="text-center py-12 text-neutral-400 dark:text-neutral-500 text-sm">
              No further entries found on this page.
            </div>
          )
        )}

        {/* ── Pagination ────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-neutral-200/85 dark:border-neutral-800 pt-8">
          <button
            className="px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-sm font-medium bg-white dark:bg-[#1c1c1c] hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {page + 1} / {data?.totalPages ?? "—"}
          </span>
          
          <button
            className="px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-sm font-medium bg-white dark:bg-[#1c1c1c] hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer"
            disabled={!data || page >= data.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>

        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedBlogId(null); }}
          onConfirm={confirmDelete}
          title="Delete Post"
          message="Are you sure you want to delete this post? This will permanently remove the article and all associated comments."
        />

      </div>
    </div>
  );
}

export default BlogList;
