import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMealRecordsContext } from '../../hooks/useMealRecords';
import type { Meal, MealItem, MealRecord } from '../../types';

const recipeDB = [
  {
    id: '1',
    name: 'サバの塩焼き定食',
    description: 'たんぱく質・脂質バランス良好。ご飯・味噌汁・小鉢付き。',
    calories: 600,
    protein: 30,
    fat: 20,
    carbs: 60,
    image: require('@/assets/images/32932229_s.jpg'),
  },
  {
    id: '2',
    name: '鶏むね肉のサラダ',
    description: '低カロリー高たんぱく。野菜たっぷり。',
    calories: 350,
    protein: 25,
    fat: 5,
    carbs: 15,
    image: require('@/assets/images/31508272_s.jpg'),
  },
  {
    id: '3',
    name: '納豆ご飯と味噌汁',
    description: '手軽で栄養バランスも良い和朝食。',
    calories: 400,
    protein: 15,
    fat: 8,
    carbs: 60,
    image: require('@/assets/images/24579238_s.jpg'),
  },
];

const target = {
  calories: 1800,
  protein: 60,
  fat: 50,
  carbs: 250,
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

const MEAL_TIMES = ['朝', '昼', '夜'];

export default function SuggestScreen() {
  // 記録データ取得
  const { records } = useMealRecordsContext();
  const today = getToday();
  const todayRecord: MealRecord | undefined = records.find((r: MealRecord) => r.date === today);
  let sum = { calories: 0, protein: 0, fat: 0, carbs: 0 };
  if (todayRecord) {
    todayRecord.meals.forEach((meal: Meal) => {
      meal.items.forEach((item: MealItem) => {
        sum.calories += item.calories || 0;
        sum.protein += item.nutrients.protein || 0;
        sum.fat += item.nutrients.fat || 0;
        sum.carbs += item.nutrients.carbs || 0;
      });
    });
  }

  // 朝・昼・夜ごとにおすすめを選出（サンプル：単純にDBから順番に）
  const suggestions = MEAL_TIMES.map((time, idx) => recipeDB[idx % recipeDB.length]);

  // 合計値
  const total = suggestions.reduce(
    (acc, r) => ({
      calories: acc.calories + r.calories,
      protein: acc.protein + r.protein,
      fat: acc.fat + r.fat,
      carbs: acc.carbs + r.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>本日のおすすめ食事</Text>
        {MEAL_TIMES.map((time, idx) => (
          <View key={time} style={styles.suggestionBlock}>
            <Text style={styles.mealTime}>{time}</Text>
            <Image source={suggestions[idx].image} style={styles.suggestionImage} />
            <Text style={[styles.suggestionName, { width: '100%', flexWrap: 'wrap' }]}>{suggestions[idx].name}</Text>
            <Text style={[styles.suggestionDesc, { width: '100%', flexWrap: 'wrap' }]}>{suggestions[idx].description}</Text>
            <Text style={[styles.suggestionCal, { width: '100%' }]}>カロリー: {suggestions[idx].calories}kcal</Text>
            <Text style={[styles.suggestionCal, { width: '100%' }]}>P:{suggestions[idx].protein} F:{suggestions[idx].fat} C:{suggestions[idx].carbs}</Text>
          </View>
        ))}
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>本日のおすすめ合計</Text>
          <Text>カロリー: {total.calories} kcal</Text>
          <Text>たんぱく質: {total.protein} g</Text>
          <Text>脂質: {total.fat} g</Text>
          <Text>炭水化物: {total.carbs} g</Text>
        </View>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>本日の摂取量（記録合計）</Text>
          <Text>カロリー: {sum.calories} / {target.calories} kcal</Text>
          <Text>たんぱく質: {sum.protein} / {target.protein} g</Text>
          <Text>脂質: {sum.fat} / {target.fat} g</Text>
          <Text>炭水化物: {sum.carbs} / {target.carbs} g</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  suggestionBlock: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  suggestionImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  suggestionName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  suggestionDesc: {
    color: '#666',
    marginTop: 4,
    marginBottom: 4,
  },
  suggestionCal: {
    color: '#333',
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mealTime: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#1976d2',
  },
}); 