import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
// @ts-ignore
import "react-quill-new/dist/quill.snow.css";
// @ts-ignore
import "./rich-text-editor.css";

type Props = {
  value: string;
  onChange: (content: string) => void;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

export default function RichTextEditor({ value, onChange }: Props) {
  const [editorValue, setEditorValue] = useState(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  return (
    <div className="rte-dark">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
        modules={modules}
        placeholder="Write a detailed product description here..."
      />
    </div>
  );
}
