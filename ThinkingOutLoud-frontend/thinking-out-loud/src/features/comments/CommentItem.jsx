import React, { useState } from "react";
import { useAuthStore } from "../auth/authStore";

function highlightMentions(text) {
  const mentionRegex = /(@\w+)/g;
  const splitParts = text.split(mentionRegex);

  return splitParts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span key={index} className="text-blue-600 dark:text-blue-400 font-medium">
          {part}
        </span>
      );
    }
    return part;
  });
}

function CommentItem({ comment, onReply, onDelete }) {
  const [showReplies, setShowReplies] = useState(false);
  const { user, role } = useAuthStore();
  const replyCount = comment.replies?.length || 0;

  const getInitials = (name) =>
    name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="py-6 space-y-4">

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-900 flex items-center justify-center text-xs font-bold shadow-sm">
          {getInitials(comment.username)}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">{comment.username}</span>
            {comment.isAuthor && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded uppercase tracking-wider scale-90">
                Author
              </span>
            )}
          </div>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric"
            })}
          </span>
        </div>
      </div>

      <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed font-light pl-12">{highlightMentions(comment.content)}</p>

      <div className="flex items-center gap-4 pl-12">
        <button
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
          onClick={() => onReply(comment)}
        >
          Reply
        </button>

        {replyCount > 0 && (
          <button
            className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors cursor-pointer"
            onClick={() => setShowReplies(prev => !prev)}
          >
            {showReplies ? "Hide replies" : `Show ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
          </button>
        )}

        {(role === "ROLE_ADMIN" || (user && user === comment.username)) && (
          <button
            className="text-xs font-semibold text-red-500 hover:text-red-750 transition-colors cursor-pointer animate-fade-in"
            onClick={() => onDelete(comment.id)}
          >
            Delete
          </button>
        )}
      </div>

      {showReplies && (
        <div className="pl-12 mt-4 space-y-6 border-l-2 border-neutral-100 dark:border-neutral-800 ml-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="space-y-3 pt-2">

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 dark:bg-[#1c1c1c] dark:text-neutral-300 flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {getInitials(reply.username)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">{reply.username}</span>
                    {reply.isAuthor && (
                      <span className="text-[8px] font-bold px-1 py-0.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded uppercase tracking-wider scale-90">
                        Author
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    {new Date(reply.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed font-light pl-11">{highlightMentions(reply.content)}</p>

              <div className="pl-11 flex items-center gap-4">
                <button 
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer" 
                  onClick={() => onReply({ ...reply, parentId: comment.id })}
                >
                  Reply
                </button>
                {(role === "ROLE_ADMIN" || (user && user === reply.username)) && (
                  <button
                    className="text-xs font-semibold text-red-500 hover:text-red-750 transition-colors cursor-pointer animate-fade-in"
                    onClick={() => onDelete(reply.id)}
                  >
                    Delete
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default CommentItem;