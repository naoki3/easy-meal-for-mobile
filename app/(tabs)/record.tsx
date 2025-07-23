import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMealRecordsContext } from '../../hooks/useMealRecords';
import type { Meal, MealItem, MealRecord } from '../../types';

const MEAL_TIMES = ['朝', '昼', '夜', '間食'];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function RecordScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [mealTime, setMealTime] = useState(MEAL_TIMES[0]);
  const { records, addRecord, deleteRecord, loading } = useMealRecordsContext();

  const today = getToday();
  const todayRecord: MealRecord | undefined = records.find((r: MealRecord) => r.date === today);

  // 時間帯ごとにまとめて表示
  const todayMeals: Meal[] = todayRecord?.meals || [];

  // 日付が変わったら入力欄を初期化
  useEffect(() => {
    setName('');
    setCalories('');
    setProtein('');
    setFat('');
    setCarbs('');
    setMealTime(MEAL_TIMES[0]);
    setImage(null);
  }, [today]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddRecord = async () => {
    if (!name || !calories) {
      Alert.alert('エラー', '食事名とカロリーは必須です');
      return;
    }
    const item: MealItem = {
      name,
      calories: Number(calories),
      nutrients: {
        protein: Number(protein) || 0,
        fat: Number(fat) || 0,
        carbs: Number(carbs) || 0,
      },
      imageUrl: image || undefined,
    };
    await addRecord(today, item, mealTime);
    setName('');
    setCalories('');
    setProtein('');
    setFat('');
    setCarbs('');
    setImage(null);
  };

  const handleDelete = async (time: string, idx: number) => {
    await deleteRecord(today, time, idx);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>食事記録の追加</Text>
        <Text style={styles.label}>時間帯</Text>
        <View style={styles.mealTimeRow}>
          {MEAL_TIMES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.mealTimeBtn, mealTime === t && styles.mealTimeBtnActive]}
              onPress={() => setMealTime(t)}
            >
              <Text style={mealTime === t ? styles.mealTimeTextActive : styles.mealTimeText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>写真</Text>
        <Button title="写真を選択" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Text style={styles.label}>食事名</Text>
        <TextInput
          style={styles.input}
          placeholder="食事名"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>カロリー (kcal)</Text>
        <TextInput
          style={styles.input}
          placeholder="カロリー (kcal)"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
        <Text style={styles.label}>たんぱく質 (g)</Text>
        <TextInput
          style={styles.input}
          placeholder="たんぱく質 (g)"
          value={protein}
          onChangeText={setProtein}
          keyboardType="numeric"
        />
        <Text style={styles.label}>脂質 (g)</Text>
        <TextInput
          style={styles.input}
          placeholder="脂質 (g)"
          value={fat}
          onChangeText={setFat}
          keyboardType="numeric"
        />
        <Text style={styles.label}>炭水化物 (g)</Text>
        <TextInput
          style={styles.input}
          placeholder="炭水化物 (g)"
          value={carbs}
          onChangeText={setCarbs}
          keyboardType="numeric"
        />
        <Button title="記録する" onPress={handleAddRecord} />

        <Text style={styles.subtitle}>本日の記録</Text>
        {loading ? (
          <Text>読み込み中...</Text>
        ) : todayMeals.length === 0 ? (
          <Text>まだ記録がありません</Text>
        ) : (
          todayMeals.map((meal: Meal, mIdx: number) => (
            <View key={meal.time} style={styles.mealBlock}>
              <Text style={styles.mealTime}>{meal.time}</Text>
              {meal.items.map((item: MealItem, idx: number) => (
                <View key={idx} style={styles.recordBlock}>
                  {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.thumb} />}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recordName}>{item.name}：{item.calories}kcal</Text>
                    <Text style={styles.nutrients}>P:{item.nutrients.protein} F:{item.nutrients.fat} C:{item.nutrients.carbs}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(meal.time, idx)} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>削除</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'stretch',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mealTimeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  mealTimeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  mealTimeBtnActive: {
    backgroundColor: '#4fc3f7',
  },
  mealTimeText: {
    color: '#333',
  },
  mealTimeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  image: {
    width: 200,
    height: 150,
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  mealBlock: {
    marginBottom: 12,
  },
  mealTime: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  recordBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  thumb: {
    width: 48,
    height: 36,
    marginRight: 12,
    borderRadius: 4,
  },
  recordName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  nutrients: {
    color: '#666',
    fontSize: 13,
  },
  deleteBtn: {
    marginLeft: 8,
    backgroundColor: '#e57373',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    color: '#1976d2',
    marginBottom: 2,
    marginLeft: 2,
    fontWeight: 'bold',
  },
}); 