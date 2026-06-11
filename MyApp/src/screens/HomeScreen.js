// src/screens/HomeScreen.js (atualizado)
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, RefreshControl } from 'react-native';
import { theme } from '../styles/theme';
import StorageService from '../services/StorageService';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [groups, setGroups] = useState([{ id: 'all', name: 'Todos' }]);
  const [feed, setFeed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const currentUser = await StorageService.getCurrentUser();
    
    if (currentUser) {
      // Buscar grupos que o usuário participa
      const userGroups = await StorageService.getUserGroupsDetails(currentUser.id);
      
      const groupOptions = [
        { id: 'all', name: 'Todos' },
        ...userGroups.map(g => ({ id: g.id, name: g.name }))
      ];
      setGroups(groupOptions);
      
      // Buscar feed
      let feedData = await StorageService.getFeed();
      
      // Ordenar por timestamp (mais recente primeiro)
      feedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Formatar os dados do feed
      const formattedFeed = feedData.map(item => ({
        ...item,
        time: formatTimeAgo(item.timestamp),
      }));
      
      setFeed(formattedFeed);
    }
  };
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    return `Há ${diffDays} d`;
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Filtra o feed baseado no grupo selecionado
  const filteredFeed = selectedGroup === 'all' 
    ? feed 
    : feed.filter(item => item.groupId === selectedGroup);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Feed Geral</Text>
        <Text style={styles.headerSubtitle}>Acompanhe a evolução da sua tribo</Text>
      </View>

      {/* Menu Seletor de Grupos (Horizontal) */}
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
          {groups.map((group) => {
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma atividade recente por aqui.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.feedCard}>
            <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.user?.[0] || '?'}</Text>
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
    paddingTop: 60,
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
    color: '#000',
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