import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCommentsByBlog, createComment } from "../../api/commentApi";
import CommentItem from "./CommentItem";

function CommentSection({ blogId }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["comments", blogId],
        queryFn: () => getCommentsByBlog(blogId)
    });

    const token = localStorage.getItem("token");
    const [text, setText] = useState("");
    const [replyTarget, setReplyTarget] = useState(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ content, parentId }) =>
            createComment(blogId, content, parentId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
            setText("");
            setReplyTarget(null);
        }
    });

    const handleReply = (item) => {
        const parentId = item.parentId ? item.parentId : item.id;
        setReplyTarget(parentId);
        setText(`@${item.username} `);
    };

    if (isLoading) return <div className="text-zinc-500 font-medium animate-pulse text-sm">Loading comments...</div>;
    if (error) return <div className="text-red-500 font-medium text-sm">Error loading comments</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">Discussion</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-neutral-100 dark:bg-[#1c1c1c] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full">
                    {data ? data.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) : 0}
                </span>
            </div>

            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!text.trim()) return;
                    mutation.mutate({
                        content: text,
                        parentId: replyTarget
                    });
                }}
            >
                <textarea
                    className="w-full min-h-[100px] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50 transition-colors bg-white dark:bg-[#1c1c1c] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 font-light"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={token ? "Share your thoughts on this article..." : "Please login to join the discussion."}
                    disabled={!token}
                />

                <div className="flex items-center justify-between">
                    {replyTarget && (
                        <button 
                            type="button" 
                            className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline cursor-pointer"
                            onClick={() => { setReplyTarget(null); setText(""); }}
                        >
                            Cancel Reply
                        </button>
                    )}
                    <div />
                    <button
                        className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-850 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer ml-auto"
                        type="submit"
                        disabled={!token || !text.trim()}
                    >
                        {replyTarget ? "Post Reply" : "Post Comment"}
                    </button>
                </div>
            </form>

            <div className="divide-y divide-neutral-200/60 pt-4">
                {data.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                    />
                ))}
            </div>
        </div>
    );
}

export default CommentSection;