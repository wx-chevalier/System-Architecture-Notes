import { Entity } from '@core/domain/helpers/entity';
import { Replace } from '@core/domain/helpers/replace';
import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';

import { CharactersLimitError } from '@agreements/domain/errors/characters-limit-error';
import { NotificationHasAlreadyBeenReadError } from '@agreements/domain/errors/notification-has-already-been-read-error';

export type NotificationProps = {
  recipientPartyId: string;
  title: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;
};

export class Notification extends Entity<NotificationProps> {
  public get recipientPartyId(): string {
    return this.props.recipientPartyId;
  }

  public get title(): string {
    return this.props.title;
  }

  public get content(): string {
    return this.props.content;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get readAt(): Date | null {
    return this.props.readAt;
  }

  public static create(
    props: Replace<NotificationProps, { createdAt?: Date; readAt?: Date | null }>,
    id?: string,
  ): Either<DomainError, Notification> {
    if (props.title.length < 3 || props.title.length > 80) {
      const error = new CharactersLimitError('Title must be between 3 and 80 characters');
      return left(error);
    }

    if (props.content.length < 3 || props.content.length > 160) {
      const error = new CharactersLimitError('Content must be between 3 and 160 characters');
      return left(error);
    }

    const notification = new Notification(
      {
        ...props,
        readAt: null,
        createdAt: new Date(),
      },
      id,
    );

    return right(notification);
  }

  public hasBeenRead(): Either<NotificationHasAlreadyBeenReadError, void> {
    if (this.props.readAt !== null) {
      const error = new NotificationHasAlreadyBeenReadError(
        "Cannot mark notification as read if it's already been read",
      );
      return left(error);
    }

    this.props.readAt = new Date();
    return right(undefined);
  }
}
