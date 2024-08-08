import { OwingItem, OwingItemProps } from '@agreements/domain/value-objects/owing-item';

type MakeOwingItem = Partial<OwingItemProps>;

export const makeOwingItem = (props?: MakeOwingItem): OwingItem => {
  return OwingItem.create({ amount: 20, isCurrency: true, ...props }).value as OwingItem;
};
