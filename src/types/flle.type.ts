export type FileItem = {
  type: 'file';
  name: string;
  path: string;
};

export type FolderItem = {
  type: 'folder';
  name: string;
  path: string;
  children: (FileItem | FolderItem)[];
};
