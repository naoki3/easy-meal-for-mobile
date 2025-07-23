import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

// 食事記録
type MealRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  meals: Meal[];
  memo?: string;
};

type Meal = {
  time: string; // 朝・昼・夜・間食など
  items: MealItem[];
};

type MealItem = {
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

// ユーザー
type User = {
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

function CalendarScreen() {
  const [selected, setSelected] = useState('');
  // ダミーデータ
  const mealData = {
    '2024-07-23': { meal: 'カレーライス', memo: '美味しかった', calorie: 700 },
    '2024-07-24': { meal: 'サラダチキン', memo: 'ヘルシー', calorie: 300 },
  };
  const info = mealData[selected];

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40 }}>
      <Calendar
        onDayPress={day => setSelected(day.dateString)}
        markedDates={{
          [selected]: { selected: true, marked: true, selectedColor: 'orange' },
        }}
      />
      <View style={{ marginTop: 24 }}>
        {selected ? (
          info ? (
            <>
              <Text>【{selected}の記録】</Text>
              <Text>献立: {info.meal}</Text>
              <Text>メモ: {info.memo}</Text>
              <Text>カロリー: {info.calorie} kcal</Text>
            </>
          ) : (
            <Text>この日の記録はありません</Text>
          )
        ) : (
          <Text>日付を選択してください</Text>
        )}
      </View>
    </View>
  );
}

function UploadScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>献立アップロード画面</Text>
    </View>
  );
}

function AIScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>AI解析結果画面</Text>
    </View>
  );
}

function RecommendScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>今日の献立オススメ画面</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="カレンダー" component={CalendarScreen} />
        <Tab.Screen name="アップロード" component={UploadScreen} />
        <Tab.Screen name="AI解析" component={AIScreen} />
        <Tab.Screen name="オススメ" component={RecommendScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 