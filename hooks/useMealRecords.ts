import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import type { MealItem, MealRecord } from '../types';

const STORAGE_KEY = 'meal_records';

// Context定義
const MealRecordsContext = createContext<any>(null);

export function useMealRecordsContext() {
  return useContext(MealRecordsContext);
}

export function MealRecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // データの読み込み
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setRecords(JSON.parse(json));
        }
      } catch (e) {
        // エラー処理
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // データの保存
  const saveRecords = useCallback(async (newRecords: MealRecord[]) => {
    setRecords(newRecords);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
  }, []);

  // 記録の追加（時間帯指定）
  const addRecord = useCallback(async (date: string, meal: MealItem, time: string = '記録') => {
    const today = records.find(r => r.date === date);
    let newRecords: MealRecord[];
    if (today) {
      let mealBlock = today.meals.find(m => m.time === time);
      if (mealBlock) {
        mealBlock.items.push(meal);
      } else {
        today.meals.push({ time, items: [meal] });
      }
      newRecords = [...records];
    } else {
      const newRecord: MealRecord = {
        id: Date.now().toString(),
        date,
        meals: [{ time, items: [meal] }],
      };
      newRecords = [newRecord, ...records];
    }
    await saveRecords(newRecords);
  }, [records, saveRecords]);

  // 記録の削除
  const deleteRecord = useCallback(async (date: string, time: string, itemIdx: number) => {
    const todayIdx = records.findIndex(r => r.date === date);
    if (todayIdx === -1) return;
    const today = records[todayIdx];
    const mealBlock = today.meals.find(m => m.time === time);
    if (!mealBlock) return;
    mealBlock.items.splice(itemIdx, 1);
    // itemsが空ならmeal自体も削除
    if (mealBlock.items.length === 0) {
      today.meals = today.meals.filter(m => m.time !== time);
    }
    // mealsが空ならrecord自体も削除
    let newRecords = [...records];
    if (today.meals.length === 0) {
      newRecords.splice(todayIdx, 1);
    }
    await saveRecords(newRecords);
  }, [records, saveRecords]);

  // 記録の編集
  const editRecord = useCallback(async (date: string, time: string, itemIdx: number, newMeal: MealItem) => {
    const todayIdx = records.findIndex(r => r.date === date);
    if (todayIdx === -1) return;
    const today = records[todayIdx];
    const mealBlock = today.meals.find(m => m.time === time);
    if (!mealBlock) return;
    mealBlock.items[itemIdx] = newMeal;
    await saveRecords([...records]);
  }, [records, saveRecords]);

  return React.createElement(MealRecordsContext.Provider, {
    value: { records, loading, addRecord, deleteRecord, editRecord },
    children
  });
} 