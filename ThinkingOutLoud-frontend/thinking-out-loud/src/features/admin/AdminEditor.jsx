import React from "react";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; 
import { getBlogById } from "../../api/blogApi";             
import { useAuthStore } from "../auth/authStore";
import './css/admin.css';
import Tiptap from "./TipTab";
import './css/tiptap.css';
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { useRef } from "react"

function AdminEditor() {
    const { id } = useParams();          // undefined = create, defined = edit
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const role = useAuthStore((state) => state.role);
    const [success, setSuccess] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [title, setTitle] = useState(
        !isEdit ? (localStorage.getItem("blogTitle") || "") : ""  
    );
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [seeded, setSeeded] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const savedDraft = localStorage.getItem("blogDraft");
    const { data: existingBlog } = useQuery({
        queryKey: ["blog", id],
        queryFn: () => getBlogById(id),
        enabled: isEdit,               // skip query entirely in create mode
    });

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return
        setLoading(true);
        const url = await uploadImage(file)

        setImageUrl(url);
    }
    const uploadImage = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "blog_images");
        data.append("cloud_name", "dihw4kgjz");

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dihw4kgjz/image/upload",
            {
                method: "POST",
                body: data,
            }
        )

        const result = await res.json();
        setLoading(false);
        return result.url.replace(
            "/upload/",
            "/upload/w_400,c_limit/"
        )
    }
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image,
        ],
        content: !isEdit ? (localStorage.getItem("blogDraft") || "") : "",
        onUpdate({ editor }) {
            setContent(editor.getHTML());

            const html = editor.getHTML()
            if (!isEdit) {
                localStorage.setItem("blogDraft", editor.getHTML());        
            }
        },
        onCreate() {
            setEditorReady(true);
        },
    });

    useEffect(() => {
        if (isEdit && existingBlog && editorReady && !seeded) {
            setTitle(existingBlog.title ?? "");
            setImageUrl(existingBlog.imageUrl ?? "");
            editor.commands.setContent(existingBlog.content ?? "");
            setSeeded(true);
        }
    }, [isEdit, existingBlog, editorReady, seeded]);



    if (role !== "ROLE_ADMIN") {
        return (
            <div className="admin-denied">
                <h2>Access Denied</h2>
                <p>You are not authorized to access this page.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {                // ✦ payload was used but never defined
            title,
            content: editor.getHTML(),
            imageUrl,
        };
        try {
            if (isEdit) {
                // PATCH /api/blogs/{id}
                await api.patch(`/blogs/${id}`, payload);
                setSuccess("success");
                setTimeout(() => navigate(`/blogs/${id}`), 1200);
            } else {
                // POST /api/blogs
                await api.post("/blogs", payload);
                setSuccess("success");
                setTitle("");
                setImageUrl("");
                editor.commands.clearContent();
                localStorage.removeItem("blogTitle");
                localStorage.removeItem("blogDraft");
            }
        } catch (err) {
            console.error("Blog creation failed", err);
            setSuccess("error");
        }
    };

    return (
        <div className="admin-page">

            {/* Header */}
            <div className="admin-header">
                <div className="admin-header-left">
                    <h2 className="admin-page-title">{isEdit ? "Edit Post" : "New Post"}</h2>
                    <span className="admin-breadcrumb">ThinkingOutLoud · Admin · {isEdit ? `Edit #${id}` : "Editor"}</span>
                </div>
                {isEdit && (
                    <button
                        type="button"
                        className="blog-edit-btn"
                        onClick={() => navigate(`/blogs/${id}`)}
                    >
                        ← Back to post
                    </button>
                )}
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
                <div className="admin-layout">

                    {/* ── Left: Editor ── */}
                    <div>
                        <input
                            type="text"
                            className="admin-title-input"
                            placeholder="Post title..."
                            value={title}
                            onChange={(e) => {
                                const value = e.target.value; setTitle(value);
                                localStorage.setItem("blogTitle", value);
                            }}
                        />

                        <div className="admin-editor-wrap">
                            <div className="card">
                                <Tiptap editor={editor} />
                                <EditorContent editor={editor} className="tiptap" />
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Sidebar ── */}
                    <aside className="admin-sidebar">
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <span className="admin-card-label">Choose Header image</span>
                            </div>
                            {loading && <div className="uploading">Uploading…</div>}
                            {!loading && imageUrl && <div className="uploaded">Uploaded</div>}
                            <div className="admin-card-body">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleImageUpload}
                                />
                                <button
                                    className="admin-publish-btn"
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {isEdit ? "Replace Image" : "Choose Image"}
                                </button>
                            </div>

                        </div>

                        {/* Publish card */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <span className="admin-card-label">{isEdit ? "Save Changes" : "Publish"}</span>
                            </div>
                            <div className="admin-card-body">
                                <button type="submit" className="admin-publish-btn">
                                    {isEdit ? "Update Post" : "Publish Post"}
                                </button>

                                {success && (
                                    <div className={`admin-status ${success}`}>
                                        {success === "success"
                                            ? isEdit ? "Updated — redirecting…" : "Posted successfully"
                                            : isEdit ? "Update failed" : "Failed to publish"}
                                    </div>
                                )}
                            </div>
                        </div>

                    </aside>
                </div>
            </form>
        </div>
    );
}

export default AdminEditor;