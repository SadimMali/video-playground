"use client";

import { FolderStructure, getStructure } from "@/components/FolderStructure";
import { Accordion } from "@/components/ui/accordion";
import VideoPlayer from "@/components/VideoPlayer";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function MainPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [structure, setStructure] = useState<any[]>([]);

  const videoUrl = searchParams.get("video") as string | undefined;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Save the current video URL to localStorage whenever it updates
  useEffect(() => {
    if (videoUrl) {
      localStorage.setItem("currentVideo", videoUrl);
    }
  }, [videoUrl]);

  useEffect(() => {
    const fetchStructure = async () => {
      const fetchedStructure = await getStructure();
      setStructure(fetchedStructure);
    };

    // Check if a video URL exists in localStorage
    const storedVideo = localStorage.getItem("currentVideo");

    if (storedVideo) {
      router.push(pathname + "?" + createQueryString("video", storedVideo));
    }

    fetchStructure();
  }, [pathname, router, createQueryString]);

  return (
    <div className="flex h-[calc(100vh-4rem)] py-5">
      {/* Video player section */}
      <div className="flex-1 border-1 flex flex-col">
        <div className="border-b">
          <div className="relative aspect-video overflow-hidden">
            <VideoPlayer />
          </div>
          <div className="mt-4 px-4">
            <h2 className="font-semibold mb-2">
              {videoUrl || "No video selected"}
            </h2>
          </div>
        </div>
      </div>

      {/* Video library section */}
      <div className="w-1/3 overflow-x-hidden h-full">
        <div className="w-full flex items-center justify-between px-4 py-2 border-b">
          <h3 className="text-lg font-semibold">Video library</h3>
          <X className="w-4 h-4" />
        </div>
        <ScrollArea>
          <Accordion type="multiple">
            <FolderStructure
              items={structure}
              videoTitle={videoUrl}
              onVideoSelect={(video) => {
                router.push(pathname + "?" + createQueryString("video", video));
              }}
            />
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  );
}
