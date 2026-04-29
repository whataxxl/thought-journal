import { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, X } from 'lucide-react';

interface Props {
  audioUri: string | null;
  onChange: (uri: string | null) => void;
}

export default function AudioRecorder({ audioUri, onChange }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onChange(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = window.setInterval(() => setElapsed((p) => p + 1), 1000);
    } catch { /* denied */ }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (audioUri) {
    return (
      <div className="flex items-center gap-1.5">
        <Mic size={16} className="text-coral" />
        <span className="text-sm text-chocolate/60 flex-1">已保存</span>
        <button onClick={() => onChange(null)}><X size={18} className="text-chocolate/40" /></button>
      </div>
    );
  }

  return (
    <button onClick={isRecording ? stopRecording : startRecording}
      className="flex items-center gap-1 text-sm text-chocolate/60">
      {isRecording ? <StopCircle size={22} className="text-coral" /> : <Mic size={22} />}
      <span className={isRecording ? 'text-coral font-semibold' : ''}>
        {isRecording ? `录音中 ${formatTime(elapsed)}` : '语音'}
      </span>
    </button>
  );
}
