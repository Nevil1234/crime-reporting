import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, PlayCircle, PauseCircle } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        onRecordingComplete(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access your microphone. Please check your permissions.");
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Play/pause recorded audio
  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioBlob) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle audio player events
  useEffect(() => {
    if (audioBlob && !audioPlayerRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
    }
  }, [audioBlob]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!audioBlob ? (
        <>
          <Button
            variant="outline"
            size="lg"
            className={`rounded-full h-16 w-16 ${isRecording ? 
              'bg-red-500 hover:bg-red-600' : 
              'bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
            }`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <Square className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-red-600 dark:text-red-400" />
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            {isRecording ? 
              `Recording... ${formatTime(recordingTime)}` : 
              'Tap to start recording'}
          </p>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full h-16 w-16 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <PauseCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <PlayCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            )}
          </Button>
          <div className="flex items-center space-x-2 mt-3">
            <p className="text-sm font-medium">
              {isPlaying ? 'Playing...' : 'Voice recording saved'}
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 text-xs text-red-600 hover:text-red-700 p-0"
              onClick={() => {
                setAudioBlob(null);
                if (audioPlayerRef.current) {
                  audioPlayerRef.current.pause();
                  audioPlayerRef.current = null;
                }
              }}
            >
              Record again
            </Button>
          </div>
        </>
      )}
    </div>
  );
}