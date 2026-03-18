import React, { useState } from "react";
import './css/comments.css';

function highlightMentions(text) {
  const parts = text.split(/(@\w+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span key={index} className="mention">
          {part}
        </span>
      );
    }
    return part;
  });
}

function CommentItem({ comment, onReply, currentUserId }) {
  const [showReplies, setShowReplies] = useState(false);
  const replyCount = comment.replies?.length || 0;

  const getInitials = (name) =>
    name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="comment">

      <div className="comment-header">
        <div className="comment-avatar">{getInitials(comment.username)}</div>
        <span className="comment-username">{comment.username}</span>
        {comment.isAuthor && <span className="author-badge">AUTHOR</span>}
        <span className="comment-time">
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        </span>
      </div>

      <p className="comment-text">{highlightMentions(comment.content)}</p>

      <div className="comment-actions">
        <button
          className="comment-reply-btn"
          onClick={() => onReply(comment)}
        >
          Reply
        </button>

      </div>

      {replyCount > 0 && (
        <button
          className="toggle-replies-btn"
          onClick={() => setShowReplies(prev => !prev)}
        >
          {showReplies ? "▲ Hide replies" : `▼ ${replyCount}  ${replyCount === 1 ? "reply" : "replies"}`}
        </button>
      )}

      {showReplies && (
        <div className="reply-container">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="reply">

              <div className="reply-header">
                <div className="reply-avatar">{getInitials(reply.username)}</div>
                <span className="reply-username">{reply.username}</span>

                {reply.isAuthor && <span className="author-badge">AUTHOR</span>}
                <span className="reply-time">
                  {new Date(reply.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </span>
              </div>

              <p className="reply-text">{highlightMentions(reply.content)}</p>

              <div className="comment-actions">

                <button className="comment-reply-btn" onClick={() => onReply({ ...reply, parentId: comment.id })}>Reply</button>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default CommentItem;