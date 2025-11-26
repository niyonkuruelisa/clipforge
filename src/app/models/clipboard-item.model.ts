export type ClipboardItemType = 'text' | 'image' | 'link' | 'code' | 'file';

export interface ClipboardItem {
  id: string;
  type: ClipboardItemType;
  content: string;
  preview?: string;
  timestamp: Date;
  isPinned?: boolean;
  imageData?: string; // For image type
  fileName?: string; // For file type
  language?: string; // For code type
}
