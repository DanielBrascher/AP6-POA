// src/screens/GroupDetailsScreen.js (corrigido com RefreshControl)
import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  RefreshControl  // Adicionar esta importação
} from 'react-native';
import { theme } from '../styles/theme';
import StorageService from '../services/StorageService';
import { useFocusEffect } from '@react-navigation/native';

export default function GroupDetailsScreen({ route, navigation }) {
  const { groupId, groupName: initialGroupName, role: initialRole } = route.params || {};
  const [group, setGroup] = useState(null);
  const [goals, setGoals] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('goals');
  const [isOwner, setIsOwner] = useState(initialRole === 'owner');
  const [refreshing, setRefreshing] = useState(false);

  const loadGroupData = async () => {
    try {
      const groups = await StorageService.getGroups();
      const foundGroup = groups.find(g => g.id === groupId);
      
      if (foundGroup) {
        setGroup(foundGroup);
        setGoals(foundGroup.goals || []);
        
        // Carregar ranking com nomes reais dos usuários
        if (foundGroup.members && foundGroup.members.length > 0) {
          const currentUser = await StorageService.getCurrentUser();
          const allUsers = await StorageService.getUsers();
          const userProfiles = {};
          
          // Buscar todos os perfis dos membros
          for (const member of foundGroup.members) {
            let userProfile = await StorageService.getUserProfileById?.(member.userId);
            
            if (!userProfile) {
              const user = allUsers.find(u => u.id === member.userId);
              if (user) {
                userProfile = {
                  id: user.id,
                  name: user.name,
                  username: user.username,
                  totalXp: 0,
                };
              } else {
                // Para os membros padrão (João, Ana, Carlos, Beatriz), usar nomes fictícios
                const defaultNames = {
                  'user1': 'João',
                  'user2': 'Ana',
                  'user3': 'Carlos',
                  'user4': 'Beatriz',
                  'user5': 'Pedro',
                };
                
                userProfile = {
                  id: member.userId,
                  name: defaultNames[member.userId] || `Membro ${member.userId.slice(-4)}`,
                  username: '',
                  totalXp: 0,
                };
              }
            }
            
            userProfiles[member.userId] = userProfile;
          }
          
          // Buscar XP de cada membro
          const membersWithXp = await Promise.all(
            foundGroup.members.map(async (member) => {
              let memberName = userProfiles[member.userId]?.name || `Membro ${member.userId.slice(-4)}`;
              let memberXp = 0;
              
              if (member.userId === currentUser?.id) {
                const profile = await StorageService.getUserProfile();
                memberXp = profile?.totalXp || 0;
                memberName = profile?.name || memberName;
                if (member.userId === currentUser?.id && !memberName.includes('(Você)')) {
                  memberName = `${memberName} (Você)`;
                }
              } else {
                const memberProfile = await StorageService.getUserProfileById?.(member.userId);
                if (memberProfile) {
                  memberXp = memberProfile.totalXp || 0;
                  memberName = memberProfile.name || memberName;
                } else {
                  const hash = member.userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  memberXp = Math.floor(Math.random() * 500) + (hash % 300);
                }
              }
              
              return {
                id: member.userId,
                name: memberName,
                xp: memberXp,
                position: 0,
                role: member.role,
              };
            })
          );
          
          membersWithXp.sort((a, b) => b.xp - a.xp);
          membersWithXp.forEach((member, index) => {
            member.position = index + 1;
          });
          
          setLeaderboard(membersWithXp);
        } else {
          const defaultMembers = [
            { id: 'user1', name: 'João', xp: 450, role: 'owner' },
            { id: 'user2', name: 'Ana', xp: 380, role: 'member' },
            { id: 'user3', name: 'Carlos', xp: 210, role: 'member' },
            { id: 'user4', name: 'Beatriz', xp: 560, role: 'member' },
          ];
          
          const currentUser = await StorageService.getCurrentUser();
          const profile = await StorageService.getUserProfile();
          
          const membersWithXp = defaultMembers.map(member => {
            if (member.id === currentUser?.id) {
              return {
                ...member,
                name: `${profile?.name || member.name} (Você)`,
                xp: profile?.totalXp || member.xp,
              };
            }
            return member;
          });
          
          membersWithXp.sort((a, b) => b.xp - a.xp);
          membersWithXp.forEach((member, index) => {
            member.position = index + 1;
          });
          
          setLeaderboard(membersWithXp);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do grupo:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroupData();
    }, [groupId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroupData();
    setRefreshing(false);
  };

  const handleCheckIn = async (goalTitle, xp) => {
    const currentUser = await StorageService.getCurrentUser();
    const profile = await StorageService.getUserProfile();
    
    const newTotalXp = await StorageService.addUserXp(xp);
    
    await StorageService.addFeedActivity({
      userId: currentUser.id,
      user: profile.name,
      action: `concluiu '${goalTitle}'`,
      groupId: groupId,
      groupName: group?.name,
      xp: xp,
    });
    
    await loadGroupData();
    
    Alert.alert(
      '🎉 Parabéns!',
      `Você completou "${goalTitle}" e ganhou +${xp} XP!\nTotal: ${newTotalXp} XP`,
      [{ text: 'Continuar' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.groupHeader}>
        <Text style={styles.title}>{group?.name || initialGroupName}</Text>
        <Text style={styles.roleSub}>Você é {isOwner ? '👑 Dono do Grupo' : '🏃‍♂️ Membro'}</Text>
      </View>

      {isOwner && (
        <View style={styles.adminCard}>
          <View>
            <Text style={styles.adminTitle}>Painel de Gerenciamento</Text>
            <Text style={styles.adminSub}>Ajuste os objetivos e valores de XP</Text>
          </View>
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => navigation.navigate('ManageGoals', { groupId })}
          >
            <Text style={styles.adminButtonText}>Configurar</Text>
          </TouchableOpacity>
        </View>
      )}

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

      {activeTab === 'goals' ? (
        <FlatList
          data={goals}
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
          data={leaderboard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.leaderboardCard}>
              <View style={styles.rankContainer}>
                <Text style={[styles.rankText, item.position === 1 && styles.rankFirst]}>
                  #{item.position}
                </Text>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  {item.role === 'owner' && (
                    <Text style={styles.ownerBadge}>👑 Dono</Text>
                  )}
                </View>
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
  
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, borderBottomWidth: 1, borderColor: theme.colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: theme.colors.primary },
  tabText: { color: theme.colors.textMuted, fontWeight: '600', fontSize: 15 },
  tabTextActive: { color: theme.colors.primary },

  listContent: { paddingHorizontal: 20, paddingBottom: 20 },

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
  rankContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rankText: { color: theme.colors.textMuted, fontWeight: 'bold', fontSize: 16, minWidth: 40 },
  rankFirst: { color: '#FFD700' },
  memberInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  memberName: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  ownerBadge: { 
    backgroundColor: theme.colors.primary, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 12,
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  memberXp: { color: theme.colors.secondary, fontWeight: 'bold', fontSize: 15 },
});