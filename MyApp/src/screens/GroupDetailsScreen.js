// src/screens/GroupDetailsScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

// Dados fictícios das metas desse grupo específico
const MOCK_GOALS = [
  { id: 'g1', title: 'Codar 1h', xp: 50 },
  { id: 'g2', title: 'Ler documentação', xp: 30 },
  { id: 'g3', title: 'Revisar PR', xp: 20 },
];

// Ranking dos membros do grupo
const MOCK_LEADERBOARD = [
  { id: 'u1', name: 'João (Você)', xp: 450, position: 1 },
  { id: 'u2', name: 'Beatriz', xp: 380, position: 2 },
  { id: 'u3', name: 'Lucas', xp: 210, position: 3 },
];

export default function GroupDetailsScreen({ route, navigation }) {
  // Pegando os dados passados por navegação (com fallbacks seguros)
  const { groupName, role } = route.params || { groupName: 'Tribo', role: 'member' };
  const isOwner = role === 'owner';

  const [activeTab, setActiveTab] = useState('goals'); // 'goals' ou 'leaderboard'

  const handleCheckIn = (goalTitle, xp) => {
    alert(`Boa! Você marcou '${goalTitle}' e ganhou +${xp} XP!`);
  };

  return (
    <View style={styles.container}>
      {/* Header do Grupo */}
      <View style={styles.groupHeader}>
        <Text style={styles.title}>{groupName}</Text>
        <Text style={styles.roleSub}>Você é {isOwner ? '👑 Dono do Grupo' : '🏃‍♂️ Membro'}</Text>
      </View>

      {/* Painel Exclusivo do Dono (Só aparece se for owner) */}
      {isOwner && (
        <View style={styles.adminCard}>
          <View>
            <Text style={styles.adminTitle}>Painel de Gerenciamento</Text>
            <Text style={styles.adminSub}>Ajuste os objetivos e valores de XP</Text>
          </View>
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => navigation.navigate('ManageGoals')}
          >
            <Text style={styles.adminButtonText}>Configurar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Abas de Navegação Interna */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'goals' && styles.tabActive]} 
          onPress={() => setActiveTab('goals')}
        >
          <Text style={[styles.tabText, activeTab === 'goals' && styles.tabTextActive]}>Metas Diárias</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leaderboard' && styles.tabActive]} 
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.tabTextActive]}>Ranking</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Dinâmico baseado na Aba Selecionada */}
      {activeTab === 'goals' ? (
        <FlatList
          data={MOCK_GOALS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.goalCard}>
              <View>
                <Text style={styles.goalTitle}>{item.title}</Text>
                <Text style={styles.goalXp}>+{item.xp} XP</Text>
              </View>
              <TouchableOpacity 
                style={styles.checkInButton}
                onPress={() => handleCheckIn(item.title, item.xp)}
              >
                <Text style={styles.checkInButtonText}>Concluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={MOCK_LEADERBOARD}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.leaderboardCard}>
              <View style={styles.rankContainer}>
                <Text style={[styles.rankText, item.position === 1 && styles.rankFirst]}>
                  #{item.position}
                </Text>
                <Text style={styles.memberName}>{item.name}</Text>
              </View>
              <Text style={styles.memberXp}>{item.xp} XP</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  groupHeader: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  title: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  roleSub: { color: theme.colors.textMuted, fontSize: 14, marginTop: 4 },
  
  // Card do Admin
  adminCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminTitle: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
  adminSub: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  adminButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  adminButtonText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  
  // Abas (Tabs)
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, borderBottomWidth: 1, borderColor: theme.colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: theme.colors.primary },
  tabText: { color: theme.colors.textMuted, fontWeight: '600', fontSize: 15 },
  tabTextActive: { color: theme.colors.primary },

  // Listas
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },

  // Card de Metas
  goalCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  goalTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  goalXp: { color: theme.colors.primary, fontSize: 14, fontWeight: '600', marginTop: 4 },
  checkInButton: { backgroundColor: '#2C2C2C', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border },
  checkInButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 14 },

  // Card do Ranking
  leaderboardCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rankContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankText: { color: theme.colors.textMuted, fontWeight: 'bold', fontSize: 16 },
  rankFirst: { color: '#FFD700' }, // O primeiro lugar ganha um número dourado
  memberName: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  memberXp: { color: theme.colors.secondary, fontWeight: 'bold', fontSize: 15 },
});