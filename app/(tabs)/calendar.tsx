import React, { useState } from 'react';
import { Alert, Button, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMealRecordsContext } from '../../hooks/useMealRecords';
import type { Meal, MealItem, MealRecord } from '../../types';

const MEAL_TIMES = ['朝', '昼', '夜', '間食'];

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const { records, addRecord, deleteRecord, editRecord, loading } = useMealRecordsContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState<any>(null);
  const [editIdx, setEditIdx] = useState<{ time: string; idx: number } | null>(null);
  const [form, setForm] = useState({
    time: MEAL_TIMES[0],
    name: '',
    calories: '',
    protein: '',
    fat: '',
    carbs: '',
    imageUrl: '',
  });

  const record: MealRecord | undefined = records.find((r: MealRecord) => r.date === selectedDate);
  const markedDates = records.reduce((acc: any, r: MealRecord) => {
    acc[r.date] = { marked: true };
    return acc;
  }, { [selectedDate]: { selected: true, selectedColor: '#4fc3f7' } } as any);

  // 追加・編集モーダルを開く
  const openForm = (item?: any, time?: string, idx?: number) => {
    if (item) {
      setForm({
        time: time || MEAL_TIMES[0],
        name: item.name,
        calories: String(item.calories),
        protein: String(item.nutrients.protein),
        fat: String(item.nutrients.fat),
        carbs: String(item.nutrients.carbs),
        imageUrl: item.imageUrl || '',
      });
      setEditIdx(time && idx !== undefined ? { time, idx } : null);
    } else {
      setForm({ time: MEAL_TIMES[0], name: '', calories: '', protein: '', fat: '', carbs: '', imageUrl: '' });
      setEditIdx(null);
    }
    setModalVisible(true);
  };

  // 追加・編集の保存
  const handleSave = async () => {
    if (!form.name || !form.calories) {
      Alert.alert('エラー', '食事名とカロリーは必須です');
      return;
    }
    const meal = {
      name: form.name,
      calories: Number(form.calories),
      nutrients: {
        protein: Number(form.protein) || 0,
        fat: Number(form.fat) || 0,
        carbs: Number(form.carbs) || 0,
      },
      imageUrl: form.imageUrl || undefined,
    };
    if (editIdx) {
      await editRecord(selectedDate, editIdx.time, editIdx.idx, meal);
    } else {
      await addRecord(selectedDate, meal, form.time);
    }
    setModalVisible(false);
  };

  // 削除
  const handleDelete = async (time: string, idx: number) => {
    await deleteRecord(selectedDate, time, idx);
  };

  // 詳細モーダル
  const openDetail = (item: any) => {
    setModalItem(item);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          style={{ marginBottom: 16, backgroundColor: '#f8fafc' }}
        />
        <Button title="記録を追加" onPress={() => openForm()} />
        <ScrollView style={styles.recordContainer}>
          <Text style={styles.dateText}>{selectedDate} の記録</Text>
          {loading ? (
            <Text>読み込み中...</Text>
          ) : record ? (
            <View>
              {record.meals.map((meal: Meal, i: number) => (
                <View key={i} style={styles.mealBlock}>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  {meal.items.map((item: MealItem, j: number) => (
                    <View key={j} style={styles.cardRow}>
                      <TouchableOpacity
                        style={styles.card}
                        onPress={() => openDetail({ ...item, time: meal.time })}
                        activeOpacity={0.7}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {item.imageUrl && (
                            <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                          )}
                          <View style={{ flex: 1 }}>
                            <Text style={styles.mealItem}>{item.name}：{item.calories}kcal</Text>
                            <Text style={styles.nutrients}>P:{item.nutrients.protein} F:{item.nutrients.fat} C:{item.nutrients.carbs}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.editBtn} onPress={() => openForm(item, meal.time, j)}>
                        <Text style={styles.editBtnText}>編集</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(meal.time, j)}>
                        <Text style={styles.deleteBtnText}>削除</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}
              {record.memo && <Text style={styles.memo}>メモ: {record.memo}</Text>}
            </View>
          ) : (
            <Text>記録がありません</Text>
          )}
        </ScrollView>
        {/* 追加・編集モーダル */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            <View style={styles.modalContentFixed}>
              <ScrollView contentContainerStyle={styles.modalContentScroll}>
                <Text style={styles.modalTitle}>{editIdx ? '記録の編集' : '記録の追加'}</Text>
                <Text style={styles.label}>時間帯</Text>
                <View style={styles.mealTimeRow}>
                  {MEAL_TIMES.map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.mealTimeBtn, form.time === t && styles.mealTimeBtnActive]}
                      onPress={() => setForm(f => ({ ...f, time: t }))}
                    >
                      <Text style={form.time === t ? styles.mealTimeTextActive : styles.mealTimeText}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.label}>食事名</Text>
                <TextInput style={styles.input} value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} />
                <Text style={styles.label}>カロリー (kcal)</Text>
                <TextInput style={styles.input} value={form.calories} onChangeText={v => setForm(f => ({ ...f, calories: v }))} keyboardType="numeric" />
                <Text style={styles.label}>たんぱく質 (g)</Text>
                <TextInput style={styles.input} value={form.protein} onChangeText={v => setForm(f => ({ ...f, protein: v }))} keyboardType="numeric" />
                <Text style={styles.label}>脂質 (g)</Text>
                <TextInput style={styles.input} value={form.fat} onChangeText={v => setForm(f => ({ ...f, fat: v }))} keyboardType="numeric" />
                <Text style={styles.label}>炭水化物 (g)</Text>
                <TextInput style={styles.input} value={form.carbs} onChangeText={v => setForm(f => ({ ...f, carbs: v }))} keyboardType="numeric" />
                <Text style={styles.label}>画像URL</Text>
                <TextInput style={styles.input} value={form.imageUrl} onChangeText={v => setForm(f => ({ ...f, imageUrl: v }))} />
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <Button title="保存" onPress={handleSave} />
                  <View style={{ width: 16 }} />
                  <Button title="キャンセル" onPress={() => setModalVisible(false)} color="#aaa" />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        {/* 詳細モーダル */}
        <Modal
          visible={!!modalItem}
          transparent
          animationType="slide"
          onRequestClose={() => setModalItem(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {modalItem && (
                <>
                  <Text style={styles.modalTitle}>{modalItem.time}の記録詳細</Text>
                  {modalItem.imageUrl && (
                    <Image source={{ uri: modalItem.imageUrl }} style={styles.modalImage} />
                  )}
                  <Text style={styles.modalName}>{modalItem.name}</Text>
                  <Text style={styles.modalCal}>カロリー: {modalItem.calories}kcal</Text>
                  <Text style={styles.modalNutri}>P:{modalItem.nutrients.protein} F:{modalItem.nutrients.fat} C:{modalItem.nutrients.carbs}</Text>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModalItem(null)}>
                    <Text style={styles.closeBtnText}>閉じる</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  recordContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 16,
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealItem: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  nutrients: {
    color: '#666',
    fontSize: 13,
  },
  thumb: {
    width: 48,
    height: 36,
    marginRight: 12,
    borderRadius: 4,
  },
  memo: {
    marginTop: 8,
    color: '#666',
  },
  editBtn: {
    marginLeft: 8,
    backgroundColor: '#4fc3f7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
  },
  modalImage: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalCal: {
    fontSize: 15,
    marginBottom: 2,
  },
  modalNutri: {
    color: '#666',
    marginBottom: 12,
  },
  closeBtn: {
    backgroundColor: '#4fc3f7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalContentFixed: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: Dimensions.get('window').height * 0.7,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentScroll: {
    alignItems: 'center',
    paddingBottom: 16,
  },
}); 