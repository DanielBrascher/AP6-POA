// src/screens/ProfileScreen.js (atualizado)
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { theme } from '../styles/theme';
import StorageService from '../services/StorageService';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalXp: 0,
    groupsCount: 0,
    completedGoals: 0,
  });

  const loadProfile = async () => {
    const currentUser = await StorageService.getCurrentUser();
    
    if (currentUser) {
      // Carregar perfil
      const userProfile = await StorageService.getUserProfile();
      setProfile(userProfile);
      
      // Carregar grupos do usuário
      const groups = await StorageService.getUserGroupsDetails(currentUser.id);
      setUserGroups(groups);
      
      // Carregar conquistas do usuário
      const allAchievements = [];
      for (const group of groups) {
        if (group.achievements) {
          allAchievements.push(...group.achievements.map(ach => ({
            ...ach,
            groupName: group.name,
          })));
        }
      }
      
      // Estatísticas
      setStats({
        totalXp: userProfile?.totalXp || 0,
        groupsCount: groups.length,
        completedGoals: userProfile?.completedGoals || 0,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  if (!profile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
      }
    >
      
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          {profile.avatarUrl ? (
            // Aqui você pode adicionar uma Image component se quiser
            <Text style={styles.avatarText}>{profile.name?.[0] || '?'}</Text>
          ) : (
            <Text style={styles.avatarText}>{profile.name?.[0] || '?'}</Text>
          )}
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
        {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.totalXp}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxBorder]}>
          <Text style={styles.statValue}>{stats.groupsCount}</Text>
          <Text style={styles.statLabel}>Tribos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.completedGoals}</Text>
          <Text style={styles.statLabel}>Metas Pagas</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.editButton} 
        onPress={() => navigation.navigate('EditProfile', { profile })}
        activeOpacity={0.8}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* Seção de Grupos */}
      {userGroups.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Tribos</Text>
          
          {userGroups.map((group) => (
            <TouchableOpacity 
              key={group.id} 
              style={styles.groupCard}
              onPress={() => navigation.navigate('GroupDetails', { 
                groupId: group.id, 
                groupName: group.name,
                role: group.userRole 
              })}
            >
              <View style={styles.groupCardContent}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupRole}>
                  {group.userRole === 'owner' ? '👑 Dono' : '🏃‍♂️ Membro'}
                </Text>
              </View>
              <Text style={styles.arrow}>➔</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Seção de Informações Pessoais */}
      {(profile.email || profile.location || profile.website) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          {profile.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📧 E-mail:</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
          )}
          
          {profile.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Localização:</Text>
              <Text style={styles.infoValue}>{profile.location}</Text>
            </View>
          )}
          
          {profile.website && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🌐 Website:</Text>
              <Text style={styles.infoValue}>{profile.website}</Text>
            </View>
          )}
          
          {profile.createdAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Membro desde:</Text>
              <Text style={styles.infoValue}>
                {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background, 
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
    paddingHorizontal: 20,
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    color: theme.colors.primary,
    fontSize: 14,
    marginTop: 4,
  },
  bio: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  
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
    fontSize: 22,
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

  section: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  
  groupCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupCardContent: {
    flex: 1,
  },
  groupName: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupRole: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  
  infoRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
    width: '100%',
  },
  infoLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
    width: 100,
  },
  infoValue: {
    color: theme.colors.text,
    fontSize: 14,
    flex: 1,
  },
  
  arrow: { 
    color: theme.colors.primary,
    fontSize: 18,
    marginLeft: 10,
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontSize: 16,
  },
});