import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CirclePlay } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileItem, FolderItem } from "@/types/flle.type";

export async function getStructure(): Promise<(FileItem | FolderItem)[]> {
  const res = await fetch("http://localhost:3000/api/list");
  return res.json();
}

export const FolderStructure = ({
  items,
  videoTitle,
  onVideoSelect,
  level = 0,
}: {
  items: (FileItem | FolderItem)[];
  videoTitle: string | undefined;
  onVideoSelect: (video: string) => void;
  level?: number;
}) => {


  return (
    <>
      {items.map((item, index) => {
        if (item.type === "folder") {
          return (
            <AccordionItem
              value={`${level}-${index}-${item.name}`}
              key={`${level}-${index}-${item.name}`}
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2 px-4">
                  <span className="text-[1.1rem] font-semibold">
                    {item.name}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="w-full">
                  <FolderStructure
                    items={item.children}
                    videoTitle={videoTitle}
                    onVideoSelect={onVideoSelect}
                    level={level + 1}
                  />
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          );
        } else if (item.type === "file") {
          return (
            <AccordionItem
              value={`${level}-${index}-${item.name}`}
              key={`${level}-${index}-${item.name}`}
            >
              <div
                onClick={() => onVideoSelect(item.path)}
                className={cn(
                  "flex items-center gap-2 py-5 cursor-pointer hover:bg-slate-300 text-sm px-4",
                  item.path === videoTitle  && "bg-slate-300"
                )}
              >
                <CirclePlay className="max-h-4 max-w-4 text-muted-foreground" />
                <span>{item.name}</span>
              </div>
            </AccordionItem>
          );
        }
        return null;
      })}
    </>
  );
};
