export type NotificationDTO = {
  recipientPartyId: string;
  title: string;
  content: string;
};

export interface INotificationService {
  send(notificationDTO: NotificationDTO): Promise<void>;
}
