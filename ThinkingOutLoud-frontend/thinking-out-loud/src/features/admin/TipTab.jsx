import './css/tiptap.css';
// import React from 'react';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from "@tiptap/extension-underline";
import React from 'react';
import Link from "@tiptap/extension-link";
import { useRef } from "react"

const Tiptap = ({ editor }) => {
  const fileInputRef = useRef(null);
  const cI = "<>";
  const cB = "</>";
  Link.configure({
    openOnClick: false,
  })
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const url = await uploadImage(file)

    editor.chain().focus().setImage({ src: url }).run()
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
    return result.url.replace(
      "/upload/",
      "/upload/w_600,c_limit/"
    )
  }

  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          
        </button> */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          𝗕
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          𝐼
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleUnderline().run()
            console.log('underline active:', editor.isActive('underline'));
            console.log('editor state:', editor.getAttributes('underline'));
          }}
          className={editor.isActive('unerline') ? 'is-active' : ''}
        >
          U̲
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          𝚂̶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'is-active' : ''}
        >
          🖍️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          ⇦≡
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        >
          ⇦≡⇨
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        >
          ≡⇨
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
        >
          ⇔
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          • ≡
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          1. ≡
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          |☰
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          {cI}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          {cB}
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL")
            editor.chain().focus().setLink({ href: url }).run()
          }}
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={editor.isActive('horizontalRule') ? 'is-active' : ''}
        >
          ───
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
        >
          🖼 Image
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={editor.isActive('undo') ? 'is-active' : ''}
        >
          ↺
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={editor.isActive('redo') ? 'is-active' : ''}
        >
          ↻
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().clearContent().run()}
          className={editor.isActive('clear') ? 'is-active' : ''}
        >
          Clear
        </button>
      </div>
    </div >
  )
}

export default Tiptap;
