import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CirclePlay, X } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import VideoPlayer from "@/components/VideoPlayer";
import { cn } from "@/lib/utils";
import { FileItem, FolderItem } from "@/types/flle.type";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function getStructure(): Promise<(FileItem | FolderItem)[]> {
  const res = await fetch("http://localhost:3000/api/list");
  return res.json();
}

export default async function Home(props: { searchParams: SearchParams }) {
  //Next15 searchParams
  const searchParams = await props.searchParams;
  const videoTitle = searchParams.video;

  const structure = await getStructure();

  const renderStructure = (items: (FileItem | FolderItem)[], level = 0) => {
    return items.map((item, index) => {
      if (item.type === "folder") {
        return (
          <AccordionItem
            value={`${level}-${index}-${item.name}`}
            key={`${level}-${index}-${item.name}`}
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2 px-4">
                {/* <FolderIcon className="h-4 w-4 text-muted-foreground" /> */}
                <span className="text-[1.1rem] font-semibold">{item.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="">
                <Accordion type="multiple" className="w-full">
                  {renderStructure(item.children, level + 1)}
                </Accordion>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      } else if (item.type === "file") {
        return (
          <AccordionItem
            value={`${level}-${index}-${item.name}`}
            key={`${level}-${index}-${item.name}`}
          >
            <Link
              href={`/?video=${encodeURIComponent(
                item.path
              )}&subtitle=${encodeURIComponent(
                item.path.replace(".mp4", "_en.srt")
              )}`}
            >
              <div
                className={cn(
                  "flex items-center gap-2 py-5 cursor-pointer hover:bg-slate-300 text-sm px-4",
                  item.path === videoTitle && "bg-slate-300"
                )}
              >
                <CirclePlay className="max-h-4 max-w-4 text-muted-foreground" />
                <span>{item.name}</span>
              </div>
            </Link>
          </AccordionItem>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] py-5">
      {/* video player section */}
      <div className="flex-1 border-1 flex flex-col">
        <div className="border-b">
          <div className="relative aspect-video overflow-hidden">
            <VideoPlayer />
          </div>
          <div className="mt-4 px-4">
            <h2 className="font-semibold mb-2">{videoTitle}</h2>
          </div>
        </div>
      </div>
      {/* left list */}
      <div className="w-1/3 overflow-x-hidden h-full">
        <div className="w-full flex items-center justify-between px-4 py-2 border-b">
          <h3 className=" text-lg font-semibold">Video library</h3>
          <X className="w-4 h-4" />
        </div>
        <ScrollArea>
          <Accordion type="multiple" className="">
            {renderStructure(structure)}
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  );
}
