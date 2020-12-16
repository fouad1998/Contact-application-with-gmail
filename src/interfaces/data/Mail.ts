import { Attachment } from "./Attachment";

export interface Mail {
    id: string;
    email: string;
    text: string;
    html: string;
    isSender: boolean
    attachments: Array<Attachment>
}