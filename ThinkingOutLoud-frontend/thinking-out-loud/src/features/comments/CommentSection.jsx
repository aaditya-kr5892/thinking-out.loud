import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCommentsByBlog, createComment } from "../../api/commentApi";
import CommentItem from "./CommentItem";
import './css/comments.css';


function CommentSection({ blogId }) {

    const { data, isLoading, error } = useQuery({
        queryKey: ["comments", blogId],
        queryFn: () => getCommentsByBlog(blogId)
    });

    // localStorage.setItem("token", data.token)
    const token = localStorage.getItem("token")
    const [text, setText] = useState("");
    const [replyTarget, setReplyTarget] = useState(null);   // NEW STATE

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ content, parentId }) =>
            createComment(blogId, content, parentId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
            setText("");
            setReplyTarget(null);   // reset reply state
        }
    });

    const handleReply = (item) => {
        const parentId = item.parentId ? item.parentId : item.id;

        console.log("Reply clicked", {
            item,
            computedParentId: parentId
        });

        setReplyTarget(parentId);
        setText(`@${item.username} `);
    };

    if (isLoading) return <div>Loading comments...</div>;
    if (error) return <div>Error loading comments</div>;

    return (
        <div className="comment-section">

            <h3>Comments</h3>

            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    console.log("Submitting comment", {
                        content: text,
                        parentId: replyTarget,
                        blogId
                    });

                    mutation.mutate({
                        content: text,
                        parentId: replyTarget
                    });
                }}
            >
                <textarea
                    className="comment-text-area"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a comment..."
                />

                <button
                    className="sub-btn"
                    type="submit"
                    disabled={!token}
                >
                    {replyTarget ? "Post Reply" : "Post Comment"}
                </button>

            </form>

            {data.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                />
            ))}

        </div>
    );
}

export default CommentSection;