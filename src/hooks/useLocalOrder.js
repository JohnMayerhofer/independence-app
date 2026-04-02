import { useState, useCallback } from 'react';

function getStorageKey(prefix, context) {
  return `independenceapp_order_${prefix}_${context || 'global'}`;
}

export function useLocalOrder(prefix, context) {
  const key = getStorageKey(prefix, context);

  const [order, setOrderState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setOrder = useCallback(
    (newOrder) => {
      setOrderState(newOrder);
      try {
        localStorage.setItem(key, JSON.stringify(newOrder));
      } catch {
        // localStorage full or unavailable
      }
    },
    [key]
  );

  const applyOrder = useCallback(
    (items, getKey) => {
      if (!order || !order.length) return items;
      const orderMap = new Map(order.map((key, index) => [key, index]));
      return [...items].sort((a, b) => {
        const aKey = getKey(a);
        const bKey = getKey(b);
        const aIdx = orderMap.has(aKey) ? orderMap.get(aKey) : 9999;
        const bIdx = orderMap.has(bKey) ? orderMap.get(bKey) : 9999;
        return aIdx - bIdx;
      });
    },
    [order]
  );

  const resetOrder = useCallback(() => {
    setOrderState(null);
    try {
      localStorage.removeItem(key);
    } catch {}
  }, [key]);

  return { order, setOrder, applyOrder, resetOrder };
}
