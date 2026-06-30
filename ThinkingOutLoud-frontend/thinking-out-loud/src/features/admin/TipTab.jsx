import React, { useRef } from 'react';
import Link from "@tiptap/extension-link";

const Tiptap = ({ editor }) => {
  const fileInputRef = useRef(null);

  if (!editor) return null;

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = await uploadImage(file);
    editor.chain().focus().setImage({ src: url }).run();
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
    return result.url.replace(
      "/upload/",
      "/upload/w_600,c_limit/"
    );
  };

  const btnClass = (isActive, disabled = false) => `
    px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center min-w-[32px] h-8
    ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
    ${isActive
      ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-950 shadow-sm'
      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
    }
  `.trim();

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-3 flex flex-wrap gap-1.5 items-center transition-colors">

      <button
        type="button"
        title="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive('heading', { level: 1 }))}
      >
        H1
      </button>
      <button
        type="button"
        title="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
      >
        H2
      </button>
      <button
        type="button"
        title="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
      >
        H3
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

      <button
        type="button"
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
      >
        B
      </button>
      <button
        type="button"
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
      >
        I
      </button>
      <button
        type="button"
        title="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive('underline'))}
      >
        U
      </button>
      <button
        type="button"
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive('strike'))}
      >
        S
      </button>
      <button
        type="button"
        title="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btnClass(editor.isActive('highlight'))}
      >
        🖍️
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

      <button
        type="button"
        title="Align Left"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={btnClass(editor.isActive({ textAlign: 'left' }))}
      >
        ⇦≡
      </button>
      <button
        type="button"
        title="Align Center"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={btnClass(editor.isActive({ textAlign: 'center' }))}
      >
        ⇦≡⇨
      </button>
      <button
        type="button"
        title="Align Right"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={btnClass(editor.isActive({ textAlign: 'right' }))}
      >
        ≡⇨
      </button>
      <button
        type="button"
        title="Justify"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={btnClass(editor.isActive({ textAlign: 'justify' }))}
      >
        ⇔
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

      <button
        type="button"
        title="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
      >
        • ≡
      </button>
      <button
        type="button"
        title="Ordered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
      >
        1. ≡
      </button>
      <button
        type="button"
        title="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
      >
        |☰
      </button>
      <button
        type="button"
        title="Inline Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btnClass(editor.isActive('code'))}
      >
        &lt;&gt;
      </button>
      <button
        type="button"
        title="Code Block"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClass(editor.isActive('codeBlock'))}
      >
        &lt;/&gt;
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

      <button
        type="button"
        title="Insert Link"
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={btnClass(false)}
      >
        🔗
      </button>
      <button
        type="button"
        title="Horizontal Rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btnClass(editor.isActive('horizontalRule'))}
      >
        ───
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageUpload}
      />
      <button
        type="button"
        title="Insert Image"
        onClick={() => fileInputRef.current.click()}
        className={btnClass(false)}
      >
        🖼️ Image
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

      <button
        type="button"
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={btnClass(editor.isActive('undo'), !editor.can().undo())}
      >
        ↺
      </button>
      <button
        type="button"
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={btnClass(editor.isActive('redo'), !editor.can().redo())}
      >
        ↻
      </button>
      <button
        type="button"
        title="Clear Editor Content"
        onClick={() => editor.chain().focus().clearContent().run()}
        className={btnClass(false)}
      >
        Clear
      </button>
    </div>
  );
};

export default Tiptap;

