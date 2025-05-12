export interface Message {
  id?: string;
  content: string;
  createdAt: number;
  senderId: string;
  roomId: string;
}
