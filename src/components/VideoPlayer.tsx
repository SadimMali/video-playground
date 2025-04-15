"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function VideoPlayer() {
  const searchParams = useSearchParams();
  const video = searchParams.get("video");
  const decodedVideo = video ? decodeURIComponent(video) : "";
  const subtitle = video?.replace(".mp4", "_en.srt");
  const decodedSubtitle = subtitle ? decodeURIComponent(subtitle) : "";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!video || !videoRef.current) return;

    const savedProgress = localStorage.getItem(video || "");
    if (savedProgress && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedProgress);
    }

    const interval = setInterval(() => {
      if (videoRef.current) {
        localStorage.setItem(
          video || "",
          videoRef.current.currentTime.toString()
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [video]);

  return (
    <div className="">
      <video
        ref={videoRef}
        key={video} //force re-render when the video changes
        controls
        width="100%"
        onTimeUpdate={() => setProgress(videoRef.current?.currentTime || 0)}
      >
        {video && (
          <>
            <source
              src={`/api/video?video=${encodeURIComponent(decodedVideo)}`}
              type="video/mp4"
            />
            <track
              label="English"
              kind="subtitles"
              srcLang="en"
              src={`/api/subtitle?subtitle=${encodeURIComponent(
                decodedSubtitle
              )}`}
              default
            />
          </>
        )}
      </video>
      {video && <p>Progress: {progress.toFixed(2)} seconds</p>}
    </div>
  );
}
