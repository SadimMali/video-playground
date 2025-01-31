"use client"

import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";



export default function MainVideoCard({
    title,
    channel,
    views,
    time,
    image,
    href,
  }: {
    title: string;
    channel: string;
    views: string;
    time: string;
    image: string;
    href: string;

  }) {
    const router = useRouter();
    const handleVideoCardClick = ()=> {
        router.push(href)
    }
    return (
      <div className="group cursor-pointer" onClick={handleVideoCardClick}>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-3">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="font-medium mb-1 line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{channel}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <span>{views} views</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
    );
  }