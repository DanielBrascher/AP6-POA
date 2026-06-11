// src/services/InitialData.js
export const INITIAL_GROUPS = [
  {
    id: '1',
    name: 'Devs 🚀',
    description: 'Grupo focado em desenvolvimento de software',
    imageUrl: '',
    createdAt: new Date().toISOString(),
    ownerId: 'system',
    membersCount: 5,
    members: [
      { userId: 'user1', role: 'owner', joinedAt: new Date().toISOString() },
      { userId: 'user2', role: 'member', joinedAt: new Date().toISOString() },
      { userId: 'user3', role: 'member', joinedAt: new Date().toISOString() },
    ],
    goals: [
      { id: 'g1_1', title: 'Codar 1h', xp: 50, createdAt: new Date().toISOString(), completedCount: 0 },
      { id: 'g1_2', title: 'Fazer code review', xp: 40, createdAt: new Date().toISOString(), completedCount: 0 },
      { id: 'g1_3', title: 'Estudar nova tecnologia', xp: 60, createdAt: new Date().toISOString(), completedCount: 0 },
    ],
    achievements: [
      { id: 'a1_1', title: 'Mestre dos Códigos', description: 'Completou 50 metas de programação', icon: '💻', createdAt: new Date().toISOString() },
      { id: 'a1_2', title: 'Bug Hunter', description: 'Encontrou e reportou 10 bugs', icon: '🐛', createdAt: new Date().toISOString() },
    ],
  },
  {
    id: '2',
    name: 'Estudos 📚',
    description: 'Grupo para estudos e aprendizado contínuo',
    imageUrl: '',
    createdAt: new Date().toISOString(),
    ownerId: 'system',
    membersCount: 12,
    members: [
      { userId: 'user2', role: 'owner', joinedAt: new Date().toISOString() },
      { userId: 'user1', role: 'member', joinedAt: new Date().toISOString() },
      { userId: 'user4', role: 'member', joinedAt: new Date().toISOString() },
    ],
    goals: [
      { id: 'g2_1', title: 'Ler 30 páginas', xp: 30, createdAt: new Date().toISOString(), completedCount: 0 },
      { id: 'g2_2', title: 'Assistir aula', xp: 40, createdAt: new Date().toISOString(), completedCount: 0 },
      { id: 'g2_3', title: 'Fazer resumo', xp: 25, createdAt: new Date().toISOString(), completedCount: 0 },
    ],
    achievements: [
      { id: 'a2_1', title: 'Leitor Voraz', description: 'Completou 100 horas de leitura', icon: '📖', createdAt: new Date().toISOString() },
    ],
  },
  {
    id: '3',
    name: 'Hábitos 🏃‍♂️',
    description: 'Grupo para desenvolver hábitos saudáveis',
    imageUrl: '',
    createdAt: new Date().toISOString(),
    ownerId: 'system',
    membersCount: 8,
    members: [
      { userId: 'user3', role: 'owner', joinedAt: new Date().toISOString() },
      { userId: 'user1', role: 'member', joinedAt: new Date().toISOString() },
      { userId: 'user5', role: 'member', joinedAt: new Date().toISOString() },
    ],
    goals: [
      { id: 'g3_1', title: 'Treino do dia', xp: 40, createdAt: new Date().toISOString(), completedCount: 0 },
      { id: 'g3_2', title: 'Beber 2L de água', xp: 20, createdAt: new Date().toISOString(), completedCount: 0 },
      { id: 'g3_3', title: 'Meditar 10 min', xp: 25, createdAt: new Date().toISOString(), completedCount: 0 },
    ],
    achievements: [
      { id: 'a3_1', title: 'Maratonista', description: '30 dias de treino consecutivo', icon: '🏃', createdAt: new Date().toISOString() },
    ],
  },
];

export const INITIAL_FEED = [
  {
    id: '1',
    userId: 'user1',
    user: 'João',
    action: "concluiu 'Estudar React Native'",
    groupId: '1',
    groupName: 'Devs 🚀',
    xp: 50,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    userId: 'user2',
    user: 'Ana',
    action: "completou 'Leitura de 30 páginas'",
    groupId: '2',
    groupName: 'Estudos 📚',
    xp: 30,
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: '3',
    userId: 'user3',
    user: 'Carlos',
    action: "pagou o 'Treino do Dia'",
    groupId: '3',
    groupName: 'Hábitos 🏃‍♂️',
    xp: 40,
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: '4',
    userId: 'user1',
    user: 'Beatriz',
    action: "codou por 2 horas seguidas",
    groupId: '1',
    groupName: 'Devs 🚀',
    xp: 60,
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
  },
];