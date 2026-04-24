"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { Node } from "@tiptap/core";
import type { MediaLibraryAsset } from "@/types";

const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      poster: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      {
        ...HTMLAttributes,
        controls: "true",
        class:
          "my-4 w-full overflow-hidden rounded-[18px] border border-brown/15 bg-black/85",
      },
    ];
  },
});

function ToolbarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${
        active
          ? "border-transparent bg-brown text-white"
          : "border-brown/15 bg-white text-brown hover:bg-brown/5"
      }`}
    >
      {label}
    </button>
  );
}

interface BlogRichTextEditorProps {
  initialValue: string;
  mediaLibrary: MediaLibraryAsset[];
  onChange: (html: string) => void;
}

export default function BlogRichTextEditor({
  initialValue,
  mediaLibrary,
  onChange,
}: BlogRichTextEditorProps) {
  const imageAssets = useMemo(
    () => mediaLibrary.filter((asset) => asset.kind === "image"),
    [mediaLibrary],
  );
  const videoAssets = useMemo(
    () => mediaLibrary.filter((asset) => asset.kind === "video"),
    [mediaLibrary],
  );
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: false,
      }),
      VideoNode,
    ],
    content: initialValue || "<p></p>",
    immediatelyRender: false,
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] rounded-[18px] border border-brown/12 bg-white px-4 py-3 text-[15px] leading-8 text-dark outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-[18px] border border-brown/10 bg-cream/35 p-3">
        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          label="B"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="I"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="U"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="Bullet"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Number"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (!url) {
              return;
            }

            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        />
        <ToolbarButton
          label="Unlink"
          onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
        />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} />
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} />
      </div>

      <EditorContent editor={editor} />

      <div className="rounded-[18px] border border-brown/10 bg-white p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          Insert from media library
        </p>
        <div className="mt-3 grid gap-4 xl:grid-cols-2">
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Images</p>
            <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
              {imageAssets.length === 0 ? (
                <p className="text-sm text-muted">No image assets available.</p>
              ) : (
                imageAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between gap-3 rounded-[14px] border border-brown/10 p-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.label || "asset image"}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <p className="truncate text-sm text-dark">{asset.label || asset.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setImage({
                            src: asset.url,
                            alt: asset.altText || asset.label || "Blog image",
                            title: asset.label || undefined,
                          })
                          .run()
                      }
                      className="rounded-full border border-brown/15 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-brown hover:bg-brown/5"
                    >
                      Insert
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Videos</p>
            <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
              {videoAssets.length === 0 ? (
                <p className="text-sm text-muted">No video assets available.</p>
              ) : (
                videoAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between gap-3 rounded-[14px] border border-brown/10 p-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.altText || asset.label || "asset video"}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <p className="truncate text-sm text-dark">{asset.label || asset.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .insertContent({
                            type: "video",
                            attrs: {
                              src: asset.url,
                              poster: asset.thumbnailUrl || undefined,
                            },
                          })
                          .run()
                      }
                      className="rounded-full border border-brown/15 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-brown hover:bg-brown/5"
                    >
                      Insert
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
