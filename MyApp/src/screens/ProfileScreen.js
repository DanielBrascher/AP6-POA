// src/screens/ProfileScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

export default function ProfileScreen({ navigation }) {
  // Dados fictícios do perfil do usuário
  const userProfile = {
    name: 'João Silva',
    username: '@joaosilva',
    totalXp: 1250,
    groupsCount: 3,
    completedGoals: 42,
    recentAchievements: [
      { id: '1', title: 'Foco Total ⚡', desc: 'Completou 5 metas em um único dia' },
      { id: '2', title: 'Rato de Código 💻', desc: 'Acumulou 500 XP no grupo Devs' },
    ]
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Bloco do Avatar e Nome */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{userProfile.name[0]}</Text>
        </View>
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.username}>{userProfile.username}</Text>
      </View>

      {/* Grid de Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{userProfile.totalXp}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxBorder]}>
          <Text style={styles.statValue}>{userProfile.groupsCount}</Text>
          <Text style={styles.statLabel}>Tribos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{userProfile.completedGoals}</Text>
          <Text style={styles.statLabel}>Metas Pagas</Text>
        </View>
      </View>

      {/* Botão de Editar Perfil */}
      <TouchableOpacity 
        style={styles.editButton} 
        onPress={() => navigation.navigate('EditProfile')}
        activeOpacity={0.8}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* Seção de Conquistas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
        
        {userProfile.recentAchievements.map((badge) => (
          <View key={badge.id} style={styles.badgeCard}>
            <View style={styles.badgeIconContainer}>
              <Text style={styles.badgeIcon}>🏆</Text>
            </View>
            <View style={styles.badgeTextContainer}>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background, 
  },
  contentContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  avatarLarge: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: theme.colors.surface, 
    marginBottom: 16, 
    borderWidth: 2, 
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: { 
    color: theme.colors.text, 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  username: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  
  // Container de Estatísticas (Estilo Dashboard)
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
    width: '90%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBoxBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },

  editButton: { 
    backgroundColor: 'transparent', 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '90%',
    alignItems: 'center',
    marginBottom: 32,
  },
  editButtonText: { 
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 14,
  },

  // Seção de Conquistas/Badges
  section: {
    width: '90%',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  badgeCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  badgeIconContainer: {
    backgroundColor: theme.colors.background,
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  badgeIcon: {
    fontSize: 20,
  },
  badgeTextContainer: {
    flex: 1,
  },
  badgeTitle: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  badgeDesc: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});