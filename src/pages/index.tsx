"use client";

import Uppy from "@uppy/core";
// For now, if you do not want to install UI components you
// are not using import from lib directly.
import Dashboard from "@uppy/react/lib/Dashboard";
import Tus from "@uppy/tus";
import { useCallback, useState } from "react";
import Compressor from "@uppy/compressor";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

function createUppy() {
  const uppy = new Uppy().use(Tus, { endpoint: "/api/upload" }).use(Compressor);
  return uppy;
}

export default function UppyDashboard() {
  // Important: use an initializer function to prevent the state from recreating.
  const [uppy] = useState(createUppy);

  const uploadRandomFile = useCallback(() => {
    const width = 512;
    const height = 512;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (context) {
      const imageData = context.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.floor(Math.random() * 256); // Red
        data[i + 1] = Math.floor(Math.random() * 256); // Green
        data[i + 2] = Math.floor(Math.random() * 256); // Blue
        data[i + 3] = 255; // Alpha
      }

      context.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          console.log(
            "Original file size:",
            (blob.size / 1024).toFixed(2),
            "KB"
          );

          uppy.addFile({
            name: `${Date.now()}${Math.random()}.jpg`,
            type: "image/jpg",
            data: blob,
          });

          uppy.upload();
        }
      }, "image/jpg");
    }
  }, [uppy]);

  return (
    <>
      <button
        style={{ padding: 20, border: "3px solid red", marginBottom: 20 }}
        onClick={uploadRandomFile}
      >
        Click here to Upload random file programmatically (no compression when
        you check local disk)
      </button>
      <Dashboard theme="dark" uppy={uppy} />
    </>
  );
}
