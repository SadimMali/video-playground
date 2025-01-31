import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { FileItem, FolderItem } from '@/types/flle.type';


export async function GET() {
  const baseDir = path.join(process.cwd(), 'videos');

  const listFiles = (dir: string): (FileItem | FolderItem)[] => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    return items.map((item) => {
      if (item.isDirectory()) {
        return {
          type: 'folder',
          name: item.name,
          path: path.relative(baseDir, path.join(dir, item.name)),
          children: listFiles(path.join(dir, item.name)),
        };
      } else if (item.isFile() && item.name.endsWith('.mp4')) {
        return {
          type: 'file',
          name: item.name,
          path: path.relative(baseDir, path.join(dir, item.name)),
        };
      }
      return null;
    }).filter(Boolean) as (FileItem | FolderItem)[];
  };

  const structure = listFiles(baseDir);
  return NextResponse.json(structure);
}