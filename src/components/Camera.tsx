import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera as CameraIcon, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import { Solution } from './Solution';

const WEBCAM_CONFIG = {
  width: 1920,
  height: 1080,
  facingMode: 'environment',
  screenshotQuality: 0.92,
  aspectRatio: 16 / 9,
};

export function Camera() {
  const webcamRef = useRef<Webcam>(null);
  const [solution, setSolution] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const capture = useCallback(async () => {
    setError('');
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('Failed to capture image. Please try again.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(imageSrc);
      setSolution(result);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [webcamRef]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Webcam Feed */}
      <div className="relative w-full h-[70vh] bg-gray-900">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="absolute top-0 left-0 w-full h-full object-cover"
          videoConstraints={WEBCAM_CONFIG}
        />
      </div>

      {/* Capture & Analyze Button */}
      <button
        onClick={capture}
        disabled={isAnalyzing}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <CameraIcon className="w-5 h-5" />
            Capture & Analyze
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Solution Display */}
      {solution && !error && (
        <Solution
          solution={solution}
          isSpeaking={isSpeaking}
          onToggleSpeech={setIsSpeaking}
        />
      )}
    </div>
  );
}
