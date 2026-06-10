// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { theme } from '../styles/theme';

// Dados fictícios para simular o banco de dados/API
const MOCK_GROUPS = [
  { id: 'all', name: 'Todos' },
  { id: '1', name: 'Devs 🚀' },
  { id: '2', name: 'Estudos 📚' },
  { id: '3', name: 'Hábitos 🏃‍♂️' },
];

const MOCK_FEED = [
  {
    id: '1',
    user: 'João',
    action: "concluiu 'Estudar React Native'",
    groupName: 'Devs 🚀',
    groupId: '1',
    xp: 50,
    time: 'Há 5 min',
  },
  {
    id: '2',
    user: 'Ana',
    action: "completou 'Leitura de 30 páginas'",
    groupName: 'Estudos 📚',
    groupId: '2',
    xp: 30,
    time: 'Há 20 min',
  },
  {
    id: '3',
    user: 'Carlos',
    action: "pagou o 'Treino do Dia'",
    groupName: 'Hábitos 🏃‍♂️',
    groupId: '3',
    xp: 40,
    time: 'Há 1 hora',
  },
  {
    id: '4',
    user: 'Beatriz',
    action: "codou por 2 horas seguidas",
    groupName: 'Devs 🚀',
    groupId: '1',
    xp: 60,
    time: 'Há 2 horas',
  },
];

export default function HomeScreen({ navigation }) {
  const [selectedGroup, setSelectedGroup] = useState('all');

  // Filtra o feed baseado no grupo selecionado no menu superior
  const filteredFeed = selectedGroup === 'all' 
    ? MOCK_FEED 
    : MOCK_FEED.filter(item => item.groupId === selectedGroup);

  return (
    <View style={styles.container}>
      {/* Header fixo */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Feed Geral</Text>
        <Text style={styles.headerSubtitle}>Acompanhe a evolução da sua tribo</Text>
      </View>

      {/* Menu Seletor de Grupos (Horizontal) */}
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
          {MOCK_GROUPS.map((group) => {
            const isSelected = selectedGroup === group.id;
            return (
              <TouchableOpacity
                key={group.id}
                style={[styles.groupChip, isSelected && styles.groupChipActive]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <Text style={[styles.groupChipText, isSelected && styles.groupChipTextActive]}>
                  {group.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista do Feed */}
      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma atividade recente por aqui.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.feedCard}>
            {/* Clique no Avatar leva para o Perfil */}
            <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.user[0]}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.feedContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.feedText}>
                  <Text style={styles.userName}>{item.user}</Text> {item.action} no grupo{' '}
                  <Text style={styles.groupTag}>{item.groupName}</Text>
                </Text>
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={styles.xpText}>+{item.xp} XP</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60, // Dá espaço para a barra de status do celular
    paddingBottom: theme.spacing.sm,
  },
  headerTitle: { 
    color: theme.colors.text, 
    fontSize: 28, 
    fontWeight: 'bold' 
  },
  headerSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  selectorContainer: {
    marginVertical: theme.spacing.md,
  },
  selectorScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: 10,
  },
  groupChip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  groupChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  groupChipText: {
    color: theme.colors.textMuted,
    fontWeight: '600',
    fontSize: 14,
  },
  groupChipTextActive: {
    color: '#000', // Texto preto no chip laranja destacado dá excelente contraste
    fontWeight: 'bold',
  },
  feedList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
  },
  feedCard: { 
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.md, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedContent: { 
    flex: 1, 
    marginLeft: 12,
  },
  cardHeader: {
    marginBottom: 6,
  },
  feedText: { 
    color: theme.colors.text, 
    fontSize: 14,
    lineHeight: 20,
  },
  userName: { 
    fontWeight: 'bold',
  },
  groupTag: { 
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpText: { 
    color: theme.colors.primary, 
    fontWeight: 'bold', 
    fontSize: 14,
  },
  timeText: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});