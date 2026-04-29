import { useRef } from 'react';
import { Image, Camera, X } from 'lucide-react';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImagePicker({ images, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length && images.length < 9; i++) {
      const url = URL.createObjectURL(files[i]);
      onChange([...images, url]);
    }
  };

  return (
    <div className="mt-3">
      {images.length > 0 && (
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {images.map((uri, i) => (
            <div key={i} className="relative">
              <img src={uri} className="w-[72px] h-[72px] rounded-lg object-cover" alt="" />
              <button
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 bg-white rounded-full"
              >
                <X size={18} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      {images.length < 9 && (
        <div className="flex gap-4">
          <input ref={cameraRef} type="file" accept="image/*" capture="environment"
            className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <button onClick={() => cameraRef.current?.click()}
            className="flex items-center gap-1 text-sm text-gray-500">
            <Camera size={22} /> 拍照
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple
            className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1 text-sm text-gray-500">
            <Image size={22} /> 相册
          </button>
        </div>
      )}
    </div>
  );
}
