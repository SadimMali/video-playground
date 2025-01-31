"use client"

import MainVideoCard from "@/components/VideoCard";

export default function page() {
  const data = {
    id: 1,
    title: "Flutter & Dart – The Complete Guide [2025 Edition]",
    channel: "Maximilian Schwarzmüller",
    time: "30 total hour",
    image: "/thumbnail.png",
    href: "watch/"
  };
  return (
    <div className="w-full h-full px-10 py-10">
      <div className="max-w-xs">
        <MainVideoCard
          channel={data.channel}
          time={data.time}
          views="0"
          title={data.title}
          image={data.image}
          href={data.href}
        />
      </div>
    </div>
  );
}

