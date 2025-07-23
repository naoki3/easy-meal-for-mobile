import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMealRecordsContext } from '../../hooks/useMealRecords';
import type { Meal, MealItem, MealRecord } from '../../types';

const screenWidth = Dimensions.get('window').width;

export default function StatScreen() {
  const { records } = useMealRecordsContext();

  // 日付順にソート（新→旧）
  const sorted: MealRecord[] = [...records].sort((a: MealRecord, b: MealRecord) => a.date.localeCompare(b.date));
  // 直近7日分だけ取得
  const last7: MealRecord[] = sorted.slice(-7);
  const labels = last7.map((r: MealRecord) => r.date.slice(5)); // MM-DD
  const calData = last7.map((r: MealRecord) => r.meals.reduce((sum: number, meal: Meal) => sum + meal.items.reduce((s: number, i: MealItem) => s + (i.calories || 0), 0), 0));
  const proteinData = last7.map((r: MealRecord) => r.meals.reduce((sum: number, meal: Meal) => sum + meal.items.reduce((s: number, i: MealItem) => s + (i.nutrients.protein || 0), 0), 0));
  const fatData = last7.map((r: MealRecord) => r.meals.reduce((sum: number, meal: Meal) => sum + meal.items.reduce((s: number, i: MealItem) => s + (i.nutrients.fat || 0), 0), 0));
  const carbData = last7.map((r: MealRecord) => r.meals.reduce((sum: number, meal: Meal) => sum + meal.items.reduce((s: number, i: MealItem) => s + (i.nutrients.carbs || 0), 0), 0));

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(76, 195, 247, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#4fc3f7',
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>カロリー推移グラフ</Text>
        <LineChart
          data={{
            labels: labels.length > 0 ? labels : [''],
            datasets: [
              {
                data: calData.length > 0 ? calData : [0],
                color: (opacity = 1) => `rgba(76, 195, 247, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        <Text style={styles.caption}>直近{labels.length}日間の摂取カロリー</Text>

        <Text style={styles.title}>たんぱく質推移グラフ</Text>
        <LineChart
          data={{
            labels: labels.length > 0 ? labels : [''],
            datasets: [
              {
                data: proteinData.length > 0 ? proteinData : [0],
                color: (opacity = 1) => `rgba(76, 180, 100, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(76, 180, 100, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
        <Text style={styles.caption}>直近{labels.length}日間のたんぱく質摂取量</Text>

        <Text style={styles.title}>脂質推移グラフ</Text>
        <LineChart
          data={{
            labels: labels.length > 0 ? labels : [''],
            datasets: [
              {
                data: fatData.length > 0 ? fatData : [0],
                color: (opacity = 1) => `rgba(247, 195, 76, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(247, 195, 76, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
        <Text style={styles.caption}>直近{labels.length}日間の脂質摂取量</Text>

        <Text style={styles.title}>炭水化物推移グラフ</Text>
        <LineChart
          data={{
            labels: labels.length > 0 ? labels : [''],
            datasets: [
              {
                data: carbData.length > 0 ? carbData : [0],
                color: (opacity = 1) => `rgba(76, 120, 247, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(76, 120, 247, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
        <Text style={styles.caption}>直近{labels.length}日間の炭水化物摂取量</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  chart: {
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  caption: {
    marginTop: 12,
    color: '#666',
  },
}); 