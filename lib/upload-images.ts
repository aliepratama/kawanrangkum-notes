// lib/upload-images.ts

import { Editor, Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

// --- Fungsi untuk meng-upload file ke API Route Anda ---
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.url; // Mengembalikan URL dari Cloudinary
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// --- Ekstensi Tiptap Kustom ---
export const Uploader = Extension.create({
  name: "uploader",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("uploader"),
        props: {
          handlePaste: (view, event) => {
            const items = event.clipboardData?.items;
            if (!items) return false;

            for (let i = 0; i < items.length; i++) {
              const file = items[i].getAsFile();
              if (file && file.type.startsWith("image/")) {
                uploadFile(file).then((url) => {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: url });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                });
                return true; // Mencegah paste default
              }
            }
            return false;
          },
          handleDrop: (view, event) => {
            const files = event.dataTransfer?.files;
            if (!files) return false;

            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              if (file.type.startsWith("image/")) {
                uploadFile(file).then((url) => {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: url });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                });
                return true; // Mencegah drop default
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});