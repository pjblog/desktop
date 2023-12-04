import Api from '../../service';
import update from 'immutability-helper';
import { PropsWithChildren, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ICategory } from '../../service/category.type';
import { useRequest } from 'ahooks';
import { useMessage } from '../../main';

export function DNDProvider(props: PropsWithChildren) {
  return <DndProvider backend={HTML5Backend}>
    {props.children}
  </DndProvider>
}

export function useCards(cards: ICategory[], setCards: (data?: ICategory[]) => void) {
  const msg = useMessage();
  const { runAsync } = useRequest(Api.Category.updateOrders.bind(Api.Category) as typeof Api.Category.updateOrders, {
    manual: true,
  })
  const findCard = useCallback((id: number) => {
    const index = cards.findIndex(card => card.id === id);
    if (index <= -1) return;
    return {
      card: cards[index],
      index,
    }
  }, [cards]);

  const moveCard = useCallback((id: number, index: number) => {
    const current = findCard(id);
    if (current) {
      const categories = update(cards, {
        $splice: [
          [current.index, 1],
          [index, 0, current.card],
        ]
      })
      setCards(categories);
    }
  }, [findCard, cards, setCards]);

  const submit = useCallback(() => {
    runAsync(cards.map(category => category.id))
      .then(() => msg.success('保存分类排序成功'))
      .catch(e => msg.error(e.message))
  }, [cards, runAsync, msg])

  return {
    find: findCard,
    move: moveCard,
    change: submit,
  }
}