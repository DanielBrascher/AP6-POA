// src/screens/GroupsScreen.js
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { theme } from '../styles/theme';
import StorageService from '../services/StorageService';
import { useFocusEffect } from '@react-navigation/native';

export default function GroupsScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadGroups = async () => {
    const currentUser = await StorageService.getCurrentUser();
    if (currentUser) {
      const userGroups = await StorageService.getUserGroupsDetails(currentUser.id);
      setGroups(userGroups);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Meus Grupos</Text>
        <Text style={styles.subtitle}>Gerencie ou entre em grupos de foco</Text>
      </View>

      <TouchableOpacity 
        style={styles.createButton} 
        onPress={() => navigation.navigate('CreateGroup')}
        activeOpacity={0.8}
      >
        <Text style={styles.createButtonText}>+ Criar Novo Grupo</Text>
      </TouchableOpacity>

      <FlatList 
        data={groups}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Você ainda não faz parte de nenhum grupo.</Text>
        }
        renderItem={({ item }) => {
          const isOwner = item.userRole === 'owner';
          
          return (
            <TouchableOpacity 
              style={styles.groupCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('GroupDetails', { 
                groupId: item.id, 
                groupName: item.name,
                role: item.userRole 
              })}
            >
              <View style={styles.cardInfo}>
                <Text style={styles.groupName}>{item.name}</Text>
                
                <View style={styles.badgeRow}>
                  <View style={[styles.roleBadge, isOwner ? styles.badgeOwner : styles.badgeMember]}>
                    <Text style={[styles.roleBadgeText, isOwner && styles.roleBadgeTextOwner]}>
                      {isOwner ? 'Dono' : 'Membro'}
                    </Text>
                  </View>
                  <Text style={styles.membersCount}>{item.members?.length || 0} integrantes</Text>
                </View>
              </View>

              <Text style={styles.arrow}>➔</Text>
            </TouchableOpacity>
          );
        }}
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
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  title: { 
    color: theme.colors.text, 
    fontSize: 28, 
    fontWeight: 'bold' 
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  createButton: { 
    backgroundColor: theme.colors.primary, 
    padding: theme.spacing.md, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4, // Sombra para Android
  },
  createButtonText: { 
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16 
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 20,
  },
  groupCard: { 
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.md, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardInfo: {
    flex: 1,
  },
  groupName: { 
    color: theme.colors.text, 
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOwner: {
    backgroundColor: theme.colors.primary,
  },
  badgeMember: {
    backgroundColor: theme.colors.border,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
  },
  roleBadgeTextOwner: {
    color: '#000',
  },
  membersCount: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  arrow: { 
    color: theme.colors.primary,
    fontSize: 18,
    marginLeft: 10,
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});