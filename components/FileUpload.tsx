"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
}

export default function FileUpload({ label = "Upload file", accept = "image/*,.pdf", multiple = false, onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    const updated = multiple ? [...files, ...arr] : arr;
    setFiles(updated);
    onFilesChange?.(updated);
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${dragging ? "border-tertiary bg-blue-50" : "border-gray-200 hover:border-gray-400 bg-gray-50"}`}
      >
        <Upload size={20} className="text-secondary" />
        <p className="text-sm text-secondary text-center">
          <span className="text-tertiary font-medium">{label}</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400">PDF, JPG, PNG supported</p>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="flex flex-col gap-1">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <FileText size={14} className="text-secondary shrink-0" />
              <span className="text-sm text-primary flex-1 truncate">{file.name}</span>
              <span className="text-xs text-secondary">{(file.size / 1024).toFixed(0)} KB</span>
              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-secondary hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
