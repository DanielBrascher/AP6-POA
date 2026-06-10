// src/screens/ManageGoalsScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

export default function ManageGoalsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('goals'); // 'goals' ou 'achievements'

  // --- ESTADOS DAS METAS ---
  const [goals, setGoals] = useState([
    { id: '1', title: 'Codar 1h', xp: 50 },
    { id: '2', title: 'Ler documentação', xp: 30 },
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalXp, setNewGoalXp] = useState('');

  // --- ESTADOS DAS CONQUISTAS ---
  const [achievements, setAchievements] = useState([
    { id: 'a1', title: 'Iniciante Ágil', desc: 'Completou a primeira meta', icon: '🐣' },
  ]);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchIcon, setNewAchIcon] = useState('');

  // Funções de Metas
  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalXp.trim()) return Alert.alert('Erro', 'Preencha tudo.');
    const newGoal = { id: Math.random().toString(), title: newGoalTitle, xp: parseInt(newGoalXp) };
    setGoals([...goals, newGoal]);
    setNewGoalTitle(''); setNewGoalXp('');
  };

  // Funções de Conquistas
  const handleAddAchievement = () => {
    if (!newAchTitle.trim() || !newAchDesc.trim()) return Alert.alert('Erro', 'Dê um nome e descrição à conquista.');
    const newAch = { 
        id: Math.random().toString(), 
        title: newAchTitle, 
        desc: newAchDesc, 
        icon: newAchIcon || '🏆' 
    };
    setAchievements([...achievements, newAch]);
    setNewAchTitle(''); setNewAchDesc(''); setNewAchIcon('');
  };

  const deleteItem = (id, type) => {
    if (type === 'goal') setGoals(goals.filter(g => g.id !== id));
    else setAchievements(achievements.filter(a => a.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Abas de Gerenciamento */}
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
          /* --- SEÇÃO DE METAS --- */
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
                <TouchableOpacity onPress={() => deleteItem(item.id, 'goal')}>
                  <Text style={styles.deleteBtn}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          /* --- SEÇÃO DE CONQUISTAS --- */
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
                    <Text style={[styles.itemSub, { width: 180 }]}>{item.desc}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteItem(item.id, 'ach')}>
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