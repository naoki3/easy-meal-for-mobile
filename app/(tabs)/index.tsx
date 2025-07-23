import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* トップ画像＋オーバーレイ＋タイトル */}
        <View style={styles.imageWrapper}>
          <Image source={require('@/assets/images/bread-2178874_1280.jpg')} style={styles.logo} />
          <View style={styles.overlay} />
          <Text style={styles.title}>かんたん食事管理アプリ</Text>
        </View>
        <Text style={styles.desc}>
          このアプリは、毎日の食事を手軽に記録・管理できるモバイルアプリです。
          カレンダーで過去の食事やカロリー、栄養素を振り返ったり、
          写真やテキストで食事を記録したり、
          あなたに合った「本日のおすすめ食事」も提案します。
        </Text>
        {/* サブイメージ1 */}
        <Image source={require('@/assets/images/6b9762813927be424c17f12b886982de.jpg')} style={styles.subImage} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>主な機能</Text>
          <Text style={styles.bullet}>・カレンダーで食事履歴を確認</Text>
          <Text style={styles.bullet}>・写真やテキストで食事を記録</Text>
          <Text style={styles.bullet}>・カロリー・栄養素の自動集計</Text>
          <Text style={styles.bullet}>・本日のおすすめ食事を提案</Text>
          <Text style={styles.bullet}>・グラフで栄養バランスを可視化</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>こんな方におすすめ</Text>
          <Text style={styles.bullet}>・健康管理やダイエットをしたい</Text>
          <Text style={styles.bullet}>・日々の食事を簡単に記録したい</Text>
          <Text style={styles.bullet}>・栄養バランスを意識したい</Text>
        </View>
        {/* サブイメージ2（フッター的） */}
        <Image source={require('@/assets/images/bcc964483de0b7667288698491019f4a_t.jpeg')} style={styles.splash} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  imageWrapper: {
    width: '100%',
    height: 140,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
  },
  title: {
    color: '#222',
    zIndex: 1,
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  desc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  subImage: {
    width: '90%',
    height: 80,
    borderRadius: 12,
    marginBottom: 18,
    resizeMode: 'cover',
  },
  section: {
    width: '100%',
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#1976d2',
  },
  bullet: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    marginBottom: 2,
  },
  splash: {
    width: 100,
    height: 100,
    marginTop: 16,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});
