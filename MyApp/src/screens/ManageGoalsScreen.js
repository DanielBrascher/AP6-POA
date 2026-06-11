// src/screens/ManageGoalsScreen.js (atualizado)
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { theme } from '../styles/theme';
import StorageService from '../services/StorageService';
import { useFocusEffect, useRoute } from '@react-navigation/native';

export default function ManageGoalsScreen({ navigation }) {
  const route = useRoute();
  const { groupId } = route.params || {};
  
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalXp, setNewGoalXp] = useState('');
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchIcon, setNewAchIcon] = useState('');

  const loadData = async () => {
    if (!groupId) return;
    
    const groups = await StorageService.getGroups();
    const group = groups.find(g => g.id === groupId);
    
    if (group) {
      setGoals(group.goals || []);
      setAchievements(group.achievements || []);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [groupId])
  );

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim() || !newGoalXp.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    const newGoal = await StorageService.addGoalToGroup(groupId, {
      title: newGoalTitle,
      xp: newGoalXp,
    });
    
    if (newGoal) {
      setGoals([...goals, newGoal]);
      setNewGoalTitle('');
      setNewGoalXp('');
      Alert.alert('Sucesso', 'Meta adicionada ao grupo!');
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchTitle.trim() || !newAchDesc.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    const newAchievement = await StorageService.addAchievementToGroup(groupId, {
      title: newAchTitle,
      description: newAchDesc,
      icon: newAchIcon || '🏆',
    });
    
    if (newAchievement) {
      setAchievements([...achievements, newAchievement]);
      setNewAchTitle('');
      setNewAchDesc('');
      setNewAchIcon('');
      Alert.alert('Sucesso', 'Conquista adicionada ao grupo!');
    }
  };

  const deleteGoal = async (goalId) => {
    Alert.alert(
      'Remover Meta',
      'Tem certeza que deseja remover esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.removeGoalFromGroup(groupId, goalId);
            if (success) {
              setGoals(goals.filter(g => g.id !== goalId));
              Alert.alert('Sucesso', 'Meta removida!');
            }
          },
        },
      ]
    );
  };

  const deleteAchievement = async (achievementId) => {
    Alert.alert(
      'Remover Conquista',
      'Tem certeza que deseja remover esta conquista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.removeAchievementFromGroup(groupId, achievementId);
            if (success) {
              setAchievements(achievements.filter(a => a.id !== achievementId));
              Alert.alert('Sucesso', 'Conquista removida!');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'goals' && styles.tabActive]} 
          onPress={() => setActiveTab('goals')}
        >
          <Text style={[styles.tabText, activeTab === 'goals' && styles.tabTextActive]}>Metas (XP)</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'achievements' && styles.tabActive]} 
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.tabTextActive]}>Conquistas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {activeTab === 'goals' ? (
          <View>
            <View style={styles.cardForm}>
              <Text style={styles.label}>Nova Meta Diária</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Título" 
                placeholderTextColor="#666" 
                value={newGoalTitle} 
                onChangeText={setNewGoalTitle} 
              />
              <View style={styles.row}>
                <TextInput 
                  style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                  placeholder="XP" 
                  keyboardType="numeric" 
                  placeholderTextColor="#666"
                  value={newGoalXp} 
                  onChangeText={setNewGoalXp} 
                />
                <TouchableOpacity style={styles.btnAdd} onPress={handleAddGoal}>
                  <Text style={styles.btnAddText}>+ Criar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {goals.map(item => (
              <View key={item.id} style={styles.listItem}>
                <View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSub}>{item.xp} XP</Text>
                </View>
                <TouchableOpacity onPress={() => deleteGoal(item.id)}>
                  <Text style={styles.deleteBtn}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <View style={styles.cardForm}>
              <Text style={styles.label}>Nova Conquista do Grupo</Text>
              <View style={styles.row}>
                <TextInput 
                  style={[styles.input, { width: 50, textAlign: 'center' }]} 
                  placeholder="🚩" 
                  maxLength={2}
                  value={newAchIcon}
                  onChangeText={setNewAchIcon}
                />
                <TextInput 
                  style={[styles.input, { flex: 1, marginLeft: 10 }]} 
                  placeholder="Nome da Conquista" 
                  placeholderTextColor="#666"
                  value={newAchTitle}
                  onChangeText={setNewAchTitle}
                />
              </View>
              <TextInput 
                style={styles.input} 
                placeholder="Descrição (Ex: 'Fez 10 check-ins')" 
                placeholderTextColor="#666"
                value={newAchDesc}
                onChangeText={setNewAchDesc}
              />
              <TouchableOpacity style={[styles.btnAdd, { width: '100%' }]} onPress={handleAddAchievement}>
                <Text style={styles.btnAddText}>+ Criar Emblema</Text>
              </TouchableOpacity>
            </View>

            {achievements.map(item => (
              <View key={item.id} style={styles.listItem}>
                <View style={styles.achRow}>
                  <Text style={styles.achIcon}>{item.icon}</Text>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={[styles.itemSub, { width: 180 }]}>{item.description}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteAchievement(item.id)}>
                  <Text style={styles.deleteBtn}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabBar: { flexDirection: 'row', backgroundColor: theme.colors.surface, paddingTop: 10 },
  tabButton: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
  tabActive: { borderColor: theme.colors.primary },
  tabText: { color: theme.colors.textMuted, fontWeight: 'bold' },
  tabTextActive: { color: theme.colors.primary },
  
  scrollContainer: { padding: 20 },
  label: { color: '#FFF', fontWeight: 'bold', marginBottom: 15, fontSize: 16 },
  cardForm: { backgroundColor: theme.colors.surface, padding: 15, borderRadius: 12, marginBottom: 25, borderWidth: 1, borderColor: theme.colors.border },
  input: { backgroundColor: theme.colors.background, color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  btnAdd: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, marginLeft: 10, justifyContent: 'center' },
  btnAddText: { color: '#000', fontWeight: 'bold' },
  
  listItem: { backgroundColor: theme.colors.surface, padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderColor: theme.colors.primary },
  itemTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  itemSub: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  deleteBtn: { color: '#FF4444', fontSize: 12, fontWeight: 'bold' },
  
  achRow: { flexDirection: 'row', alignItems: 'center' },
  achIcon: { fontSize: 24 }
});