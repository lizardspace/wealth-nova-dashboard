import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { Quill } from 'react-quill';
import { useMemo } from 'react';

// Configuration des modules
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};

// Configuration des formats
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'link', 'image'
];

// Chargement dynamique sans SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Chargement de l'éditeur...</p>
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="h-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Rédigez votre contenu ici...'}
        className="h-[400px] mb-8"
      />
    </div>
  );
}