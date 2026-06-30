import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; 
import { getBlogById } from "../../api/blogApi";             
import { useAuthStore } from "../auth/authStore";
import Tiptap from "./TipTab";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";

const CustomCodeBlock = CodeBlock.extend({
    addKeyboardShortcuts() {
        return {
            Tab: ({ editor }) => {
                if (!editor.isActive("codeBlock")) {
                    return false;
                }
                return editor.commands.insertContent("  ");
            },
            Enter: ({ editor }) => {
                if (!editor.isActive("codeBlock")) {
                    return false;
                }
                const { state } = editor.view;
                const { selection } = state;
                const { $from } = selection;
                
                const textBeforeCursor = $from.parent.textContent.slice(0, $from.parentOffset);
                const lastLine = textBeforeCursor.split("\n").pop() || "";
                const match = lastLine.match(/^([ \t]+)/);
                const indent = match ? match[1] : "";
                
                return editor.commands.insertContent("\n" + indent);
            },
        };
    },
});

function AdminEditor() {
    const { id } = useParams();          
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

    const { data: existingBlog } = useQuery({
        queryKey: ["blog", id],
        queryFn: () => getBlogById(id),
        enabled: isEdit,
    });

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setLoading(true);
        const url = await uploadImage(file);
        setImageUrl(url);
    };

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
        );

        const result = await res.json();
        setLoading(false);
        return result.url.replace(
            "/upload/",
            "/upload/w_400,c_limit/"
        );
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, 
            }),
            CustomCodeBlock,
            Highlight,
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image,
        ],
        content: !isEdit ? (localStorage.getItem("blogDraft") || "") : "",
        onUpdate({ editor }) {
            setContent(editor.getHTML());
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
            <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-6">
                <div className="text-center space-y-3 max-w-sm">
                    <h2 className="text-2xl font-bold text-neutral-900">Access Denied</h2>
                    <p className="text-neutral-500 text-sm font-light">You are not authorized to view the administrator panel.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            content: editor.getHTML(),
            imageUrl,
        };
        try {
            if (isEdit) {
                await api.patch(`/blogs/${id}`, payload);
                setSuccess("success");
                setTimeout(() => navigate(`/blogs/${id}`), 1200);
            } else {
                await api.post("/blogs", payload);
                setSuccess("success");
                setTitle("");
                setImageUrl("");
                editor.commands.clearContent();
                localStorage.removeItem("blogTitle");
                localStorage.removeItem("blogDraft");
            }
        } catch (err) {
            console.error("Blog action failed", err);
            setSuccess("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] dark:bg-[#0d0d0c] px-6 py-12 animate-fade-in transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
                    <div className="space-y-1">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                            {isEdit ? "Edit Post" : "Create New Post"}
                        </h2>
                        <span className="text-xs text-neutral-400 font-light block">
                            ThinkingOutLoud · Admin Panel · {isEdit ? `Edit Article #${id}` : "Composer"}
                        </span>
                    </div>
                    {isEdit && (
                        <button
                            type="button"
                            className="text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-full shadow-sm transition-colors cursor-pointer"
                            onClick={() => navigate(`/blogs/${id}`)}
                        >
                            ← Back to Post
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-6">
                            <input
                                type="text"
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl px-6 py-4 text-xl md:text-2xl font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50 transition-colors shadow-sm placeholder-neutral-300 dark:placeholder-neutral-600"
                                placeholder="Post title..."
                                value={title}
                                onChange={(e) => {
                                    const value = e.target.value; 
                                    setTitle(value);
                                    if (!isEdit) localStorage.setItem("blogTitle", value);
                                }}
                                required
                            />

                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                                <Tiptap editor={editor} />
                                <div className="p-6 min-h-[300px]">
                                    <EditorContent editor={editor} className="outline-none min-h-[280px]" />
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block border-b border-neutral-100 dark:border-neutral-850 pb-2">
                                    Cover Image
                                </span>
                                
                                {imageUrl && (
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
                                        <img src={imageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="flex flex-col items-center justify-center">
                                    {loading ? (
                                        <span className="text-xs text-neutral-400 animate-pulse py-2">Uploading file to Cloudinary…</span>
                                    ) : (
                                        imageUrl && <span className="text-xs text-emerald-600 font-semibold py-1">Cover image ready</span>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <button
                                        className="w-full mt-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 dark:text-neutral-200 dark:border-neutral-700 py-3 px-4 rounded-xl transition-colors cursor-pointer"
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {imageUrl ? "Change Cover Image" : "Upload Cover Image"}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block border-b border-neutral-100 dark:border-neutral-850 pb-2">
                                    {isEdit ? "Update Changes" : "Post Control"}
                                </span>
                                <div className="space-y-3">
                                    <button 
                                        type="submit" 
                                        className="w-full text-xs font-bold uppercase tracking-wider bg-neutral-950 dark:bg-white hover:bg-neutral-850 dark:hover:bg-neutral-100 text-white dark:text-neutral-950 py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer"
                                    >
                                        {isEdit ? "Update Post" : "Publish Post"}
                                    </button>

                                    {success && (
                                        <div className={`text-xs font-medium p-3 rounded-lg text-center ${
                                            success === "success" 
                                                ? "bg-emerald-50 border border-emerald-100 text-emerald-700" 
                                                : "bg-red-50 border border-red-100 text-red-700"
                                        }`}>
                                            {success === "success"
                                                ? isEdit ? "Updated — redirecting…" : "Post published successfully!"
                                                : isEdit ? "Error: Update failed" : "Error: Publish failed"}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </aside>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminEditor;
