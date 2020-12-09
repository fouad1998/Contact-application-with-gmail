import { RcFile } from 'antd/lib/upload/interface';

export interface UploadSelection {
  filename: string;
  size: number;
  content: string;
  type: string;
  id: string;
  file: RcFile;
}
