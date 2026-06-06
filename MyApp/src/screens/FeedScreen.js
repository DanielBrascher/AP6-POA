import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

// Dados fictícios para preencher o feed de forma bonita
const MOCK_FEED = [
  {
    id: '1',
    user: 'Lucas Silva',
    avatar: '👨‍💻',
    action: 'Estudou React Native & Expo',
    duration: '1h 45min',
    time: 'há 5 min',
    streak: 14,
    reactions: { fire: 8, brain: 3 }
  },
  {
    id: '2',
    user: 'Beatriz Ramos',
    avatar: '🧘‍♀️',
    action: 'Meditação + Leitura Estoica',
    duration: '40 min',
    time: 'há 32 min',
    streak: 32,
    reactions: { fire: 15, brain: 9 }
  },
  {
    id: '3',
    user: 'Rodrigo Gois',
    avatar: '📚',
    action: 'Revisão de Álgebra Linear',
    duration: '2h 10min',
    time: 'há 1h',
    streak: 5,
    reactions: { fire: 4, brain: 1 }
  },
  {
    id: '4',
    user: 'Mariana Costa',
    avatar: '🎨',
    action: 'UI Design no Figma (Projeto Novo)',
    duration: '3h 00min',
    time: 'há 2h',
    streak: 21,
    reactions: { fire: 22, brain: 14 }
  }
];

export default function FeedScreen() {
  
  // Renderizar cada card do Feed
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Linha do Usuário */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarBg}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
        
        {/* Badge de Streak */}
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {item.streak} d</Text>
        </View>
      </View>

      {/* Corpo do Card (O que a pessoa fez) */}
      <View style={styles.cardBody}>
        <Text style={styles.actionText}>{item.action}</Text>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>⏱️ {item.duration}</Text>
        </View>
      </View>

      {/* Linha de Reações/Interação */}
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.reactionButton}>
          <Text style={styles.reactionEmoji}>🔥</Text>
          <Text style={styles.reactionCount}>{item.reactions.fire}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reactionButton}>
          <Text style={styles.reactionEmoji}>🧠</Text>
          <Text style={styles.reactionCount}>{item.reactions.brain}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.reactionButton, styles.clapButton]}>
          <Text style={styles.reactionEmoji}>👏 Tap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Cabeçalho do App */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Focus<Text style={styles.headerAccent}>Rats</Text></Text>
        <Text style={styles.headerSubtitle}>Quem tá no foco hoje?</Text>
      </View>

      {/* Lista do Feed */}
      <FlatList
        data={MOCK_FEED}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedList}
      />
    </SafeAreaView>
  );
}

// Estilização Premium (Dark Mode)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214', // Fundo ultra dark (padrão de apps modernos)
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#202024',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerAccent: {
    color: '#00B37E', // Verde neon/produtividade para destacar
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8D8D99',
    marginTop: 4,
  },
  feedList: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#202024',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderBottomWidth: 3, // Dá um efeito 3D discreto
    borderColor: '#29292E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#29292E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
  },
  userName: {
    color: '#E1E1E6',
    fontSize: 16,
    fontWeight: '700',
  },
  timeText: {
    color: '#7C7C8A',
    fontSize: 12,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  streakText: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 12,
  },
  cardBody: {
    marginVertical: 14,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  durationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#29292E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  durationText: {
    color: '#C4C4CC',
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#29292E',
    paddingTop: 12,
    alignItems: 'center',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#29292E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    color: '#E1E1E6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  clapButton: {
    marginLeft: 'auto', // Joga o botão de "bater palma/motivar" para a direita
    backgroundColor: '#00B37E',
  },
});