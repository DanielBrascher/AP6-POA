import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/theme';

// Dados mockados para simular resposta da API
const MOCK_USER = {
  id: '1',
  name: 'João Silva',
  weeklyPoints: 245,
};

const MOCK_GROUPS = [
  {
    id: '1',
    name: 'Matemática UFRJ',
    photo: '📐',
    userPoints: 120,
    totalPointsGoal: 500,
    ranking: [
      { id: 'u1', name: 'João', points: 120 },
      { id: 'u2', name: 'Maria', points: 95 },
      { id: 'u3', name: 'Carlos', points: 87 },
    ],
    activities: [
      { id: 'a1', text: 'João concluiu "Resolver 10 exercícios"', timestamp: '2h atrás' },
      { id: 'a2', text: 'Maria concluiu "Assistir aula 3"', timestamp: '5h atrás' },
    ],
    quickTasks: [
      { id: 't1', name: 'Estudar 2h', points: 20 },
      { id: 't2', name: 'Fazer resumo', points: 15 },
    ],
  },
  {
    id: '2',
    name: 'Academia 6h',
    photo: '💪',
    userPoints: 85,
    totalPointsGoal: 300,
    ranking: [
      { id: 'u1', name: 'João', points: 85 },
      { id: 'u4', name: 'Ana', points: 70 },
      { id: 'u5', name: 'Pedro', points: 45 },
    ],
    activities: [
      { id: 'a3', text: 'João concluiu "Treino de perna"', timestamp: '1h atrás' },
      { id: 'a4', text: 'Ana concluiu "10k passos"', timestamp: '3h atrás' },
    ],
    quickTasks: [
      { id: 't3', name: 'Treino completo', points: 30 },
      { id: 't4', name: 'Beber 2L água', points: 10 },
    ],
  },
];

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(MOCK_USER);
  const [groups, setGroups] = useState(MOCK_GROUPS);

  const onRefresh = () => {
    setRefreshing(true);
    // Simula recarregamento
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCompleteTask = (groupId, taskId, taskName, taskPoints) => {
    Alert.alert(
      'Concluir meta',
      `Você ganhará ${taskPoints} pontos ao concluir "${taskName}". Confirmar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // Aqui você faria a chamada à API
            // Atualiza pontos do usuário (mock)
            const updatedUser = { ...user, weeklyPoints: user.weeklyPoints + taskPoints };
            setUser(updatedUser);
            // Remove a tarefa ou marca como concluída (mock simples: removemos da lista)
            const updatedGroups = groups.map(group => {
              if (group.id === groupId) {
                const updatedTasks = group.quickTasks.filter(t => t.id !== taskId);
                // Atualiza ranking (mock: adiciona pontos ao usuário)
                const updatedRanking = group.ranking.map(member =>
                  member.id === 'u1' 
                    ? { ...member, points: member.points + taskPoints }
                    : member
                ).sort((a, b) => b.points - a.points);
                // Adiciona atividade
                const newActivity = {
                  id: Date.now().toString(),
                  text: `${user.name} concluiu "${taskName}"`,
                  timestamp: 'agora',
                };
                return {
                  ...group,
                  quickTasks: updatedTasks,
                  ranking: updatedRanking,
                  activities: [newActivity, ...group.activities],
                };
              }
              return group;
            });
            setGroups(updatedGroups);
            Alert.alert('Sucesso', `+${taskPoints} pontos!`);
          },
        },
      ]
    );
  };

  const renderProgressCard = (group) => {
    const progress = (group.userPoints / group.totalPointsGoal) * 100;
    return (
      <View key={group.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.groupEmoji}>{group.photo}</Text>
          <Text style={styles.groupName}>{group.name}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {group.userPoints} / {group.totalPointsGoal} pontos
          </Text>
        </View>
      </View>
    );
  };

  const renderRankingPreview = (group) => {
    const top3 = group.ranking.slice(0, 3);
    return (
      <View key={group.id} style={[styles.card, styles.rankingCard]}>
        <Text style={styles.cardTitle}>🏆 Top 3 - {group.name}</Text>
        {top3.map((member, idx) => (
          <View key={member.id} style={styles.rankingRow}>
            <Text style={styles.rankingPos}>{idx + 1}º</Text>
            <Text style={styles.rankingName}>{member.name}</Text>
            <Text style={styles.rankingPoints}>{member.points} pts</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderActivities = () => {
    // Pega últimas 5 atividades de todos os grupos
    const allActivities = groups.flatMap(group =>
      group.activities.map(act => ({ ...act, groupName: group.name }))
    );
    const latest = allActivities.slice(0, 5);
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📢 Últimas atividades</Text>
        {latest.map(act => (
          <View key={act.id} style={styles.activityItem}>
            <Text style={styles.activityText}>{act.text}</Text>
            <Text style={styles.activityTime}>{act.timestamp}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderQuickTasks = () => {
    // Exibe até 3 tarefas rápidas dos grupos (primeiro grupo por enquanto)
    // No MVP, vou mostrar as tarefas do primeiro grupo como exemplo
    const firstGroup = groups[0];
    if (!firstGroup) return null;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Metas rápidas ({firstGroup.name})</Text>
        {firstGroup.quickTasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskButton}
            onPress={() => handleCompleteTask(firstGroup.id, task.id, task.name, task.points)}
          >
            <Text style={styles.taskName}>{task.name}</Text>
            <View style={styles.taskPointsBadge}>
              <Text style={styles.taskPoints}>+{task.points}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Cabeçalho com pontos semanais */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, {user.name}</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Pontos esta semana</Text>
          <Text style={styles.pointsValue}>{user.weeklyPoints}</Text>
        </View>
      </View>

      {/* Progresso semanal por grupo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Seu progresso</Text>
        {groups.map(renderProgressCard)}
      </View>

      {/* Ranking parcial dos grupos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏅 Rankings parciais</Text>
        {groups.map(renderRankingPreview)}
      </View>

      {/* Últimas atividades */}
      {renderActivities()}

      {/* Botões rápidos para concluir metas */}
      {renderQuickTasks()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  welcomeText: {
    ...TYPOGRAPHY.title2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: SPACING.sm,
  },
  pointsLabel: {
    ...TYPOGRAPHY.footnote,
    color: COLORS.textSecondary,
  },
  pointsValue: {
    ...TYPOGRAPHY.largeTitle,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.headline,
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  groupEmoji: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  groupName: {
    ...TYPOGRAPHY.headline,
    color: COLORS.text,
  },
  progressContainer: {
    marginTop: SPACING.xs,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
  rankingCard: {
    paddingVertical: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.subhead,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  rankingPos: {
    width: 35,
    ...TYPOGRAPHY.footnote,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  rankingName: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  rankingPoints: {
    ...TYPOGRAPHY.footnote,
    color: COLORS.textSecondary,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityText: {
    flex: 1,
    ...TYPOGRAPHY.callout,
    color: COLORS.text,
  },
  activityTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  taskButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  taskPointsBadge: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  taskPoints: {
    ...TYPOGRAPHY.footnote,
    color: COLORS.text,
    fontWeight: 'bold',
  },
});