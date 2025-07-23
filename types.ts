// アプリ全体で使う型定義

export type MealRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  meals: Meal[];
  memo?: string;
};

export type Meal = {
  time: string; // 朝・昼・夜・間食など
  items: MealItem[];
};

export type MealItem = {
  name: string;
  calories: number;
  nutrients: {
    protein: number;
    fat: number;
    carbs: number;
    [key: string]: number;
  };
  imageUrl?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  calorieGoal: number;
  nutrientGoals: {
    protein: number;
    fat: number;
    carbs: number;
    [key: string]: number;
  };
}; 