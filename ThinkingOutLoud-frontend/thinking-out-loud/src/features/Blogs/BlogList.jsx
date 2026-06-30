import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../../api/blogApi";
import { Link } from "react-router-dom";

function BlogList() {
  const [page, setPage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", page],
    queryFn: () => getBlogs(page),
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] dark:bg-[#0d0d0c]">
      <div className="text-neutral-500 dark:text-neutral-400 font-medium animate-pulse text-lg">Loading posts…</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] dark:bg-[#0d0d0c]">
      <div className="text-red-500 dark:text-red-400 font-medium text-lg">Could not load posts. Please try again.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#0d0d0c] px-6 py-12 md:py-20 animate-fade-in transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">— A space for considered thought</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
              Ideas worth<br /><span className="italic font-light text-neutral-500 dark:text-neutral-400">sitting with.</span>
            </h1>
            <div className="w-16 h-[2px] bg-neutral-300 dark:bg-neutral-700" />
            <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed max-w-md font-light">
              Long-form writing, honest takes, and the occasional
              half-baked theory. No algorithmic pressure.
              Just thinking out loud.
            </p>
          </div>

          <div className="hidden md:flex justify-center md:justify-end">
            <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm text-center max-w-sm space-y-4">
              <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Thinking<span className="italic font-light text-neutral-500 dark:text-neutral-400">OutLoud</span>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Est. 2026 · Long-form writing</p>
              <div className="h-[1px] bg-neutral-200 dark:bg-neutral-850 w-full" />
              <p className="text-sm text-neutral-500 dark:text-neutral-450 font-light">Slow media in a fast world. Read articles at your own pace.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Latest Posts</h2>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 px-3 py-1 rounded-full shadow-sm">
            Page {page + 1} of {data?.totalPages ?? "—"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {data?.content?.map((blog) => (
            <article 
              key={blog.id} 
              className="group bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-500 ease-out flex flex-col h-full"
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
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-500 ease-out">
                    {blog.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider pt-2 border-t border-neutral-50 dark:border-neutral-850">
                    <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:translate-x-1.5 transition-transform duration-500 ease-out">Read →</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200/85 dark:border-neutral-800 pt-8">
          <button
            className="px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-sm font-medium bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {page + 1} / {data?.totalPages ?? "—"}
          </span>
          
          <button
            className="px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-sm font-medium bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer"
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

