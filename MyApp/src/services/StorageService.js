// src/services/StorageService.js (atualizado com inicialização)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_GROUPS, INITIAL_FEED } from './InitialData';

// Chaves do storage
const STORAGE_KEYS = {
  GROUPS: '@ProductivityRats:groups',
  USER_GROUPS: '@ProductivityRats:userGroups',
  GOALS: '@ProductivityRats:goals',
  ACHIEVEMENTS: '@ProductivityRats:achievements',
  FEED: '@ProductivityRats:feed',
  USER_PROFILE: '@ProductivityRats:userProfile',
  CURRENT_USER: '@ProductivityRats:currentUser',
  USERS: '@ProductivityRats:users',
  INITIALIZED: '@ProductivityRats:initialized',
};

// Serviço de armazenamento
class StorageService {
  
  // Inicializar dados padrão
  static async initializeDefaultData() {
    try {
      const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
      
      if (!initialized) {
        console.log('Inicializando dados padrão...');
        
        // Salvar grupos iniciais
        await this.saveGroups(INITIAL_GROUPS);
        
        // Salvar feed inicial
        await AsyncStorage.setItem(STORAGE_KEYS.FEED, JSON.stringify(INITIAL_FEED));
        
        // Marcar como inicializado
        await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
        
        console.log('Dados padrão inicializados com sucesso!');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      return false;
    }
  }
  
  // ========== USUÁRIOS ==========
  
  // Salvar lista de usuários
  static async saveUsers(users) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
      return false;
    }
  }
  
  // Buscar lista de usuários
  static async getUsers() {
    try {
      const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }
  
  // Salvar usuário individual
  static async saveUser(user) {
    try {
      const users = await this.getUsers();
      const existingIndex = users.findIndex(u => u.id === user.id);
      
      if (existingIndex !== -1) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      await this.saveUsers(users);
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  }
  
  // ========== GRUPOS ==========
  
  // Salvar todos os grupos
  static async saveGroups(groups) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
      return true;
    } catch (error) {
      console.error('Erro ao salvar grupos:', error);
      return false;
    }
  }

  // Buscar todos os grupos
  static async getGroups() {
    try {
      const groups = await AsyncStorage.getItem(STORAGE_KEYS.GROUPS);
      return groups ? JSON.parse(groups) : [];
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      return [];
    }
  }

  // Buscar grupo por ID
  static async getGroupById(groupId) {
    try {
      const groups = await this.getGroups();
      return groups.find(g => g.id === groupId) || null;
    } catch (error) {
      console.error('Erro ao buscar grupo:', error);
      return null;
    }
  }

  // Criar novo grupo
  static async createGroup(groupData, userId) {
    try {
      const groups = await this.getGroups();
      
      const newGroup = {
        id: Date.now().toString(),
        name: groupData.name,
        description: groupData.description || '',
        imageUrl: groupData.imageUrl || '',
        createdAt: new Date().toISOString(),
        ownerId: userId,
        membersCount: 1,
        members: [{ userId, role: 'owner', joinedAt: new Date().toISOString() }],
        goals: groupData.goals || [],
        achievements: groupData.achievements || [],
      };
      
      groups.push(newGroup);
      await this.saveGroups(groups);
      
      // Adicionar o grupo aos grupos do usuário
      await this.addUserToGroup(userId, newGroup.id, 'owner');
      
      return newGroup;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      return null;
    }
  }

  // Adicionar usuário a um grupo
  static async addUserToGroup(userId, groupId, role = 'member') {
    try {
      const userGroups = await this.getUserGroups(userId);
      
      if (!userGroups.some(g => g.groupId === groupId)) {
        userGroups.push({
          groupId,
          role,
          joinedAt: new Date().toISOString(),
        });
        await this.saveUserGroups(userId, userGroups);
      }
      
      // Atualizar contagem de membros no grupo
      const groups = await this.getGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex !== -1) {
        if (!groups[groupIndex].members) {
          groups[groupIndex].members = [];
        }
        if (!groups[groupIndex].members.some(m => m.userId === userId)) {
          groups[groupIndex].members.push({ userId, role, joinedAt: new Date().toISOString() });
          groups[groupIndex].membersCount = groups[groupIndex].members.length;
          await this.saveGroups(groups);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar usuário ao grupo:', error);
      return false;
    }
  }

  // Buscar grupos de um usuário
  static async getUserGroups(userId) {
    try {
      const key = `${STORAGE_KEYS.USER_GROUPS}:${userId}`;
      const groups = await AsyncStorage.getItem(key);
      return groups ? JSON.parse(groups) : [];
    } catch (error) {
      console.error('Erro ao buscar grupos do usuário:', error);
      return [];
    }
  }

  // Salvar grupos do usuário
  static async saveUserGroups(userId, userGroups) {
    try {
      const key = `${STORAGE_KEYS.USER_GROUPS}:${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(userGroups));
      return true;
    } catch (error) {
      console.error('Erro ao salvar grupos do usuário:', error);
      return false;
    }
  }

  // Buscar detalhes completos dos grupos do usuário
  static async getUserGroupsDetails(userId) {
    try {
      const userGroups = await this.getUserGroups(userId);
      const allGroups = await this.getGroups();
      
      const groupsWithDetails = userGroups.map(ug => {
        const group = allGroups.find(g => g.id === ug.groupId);
        return group ? { ...group, userRole: ug.role } : null;
      }).filter(g => g !== null);
      
      return groupsWithDetails;
    } catch (error) {
      console.error('Erro ao buscar detalhes dos grupos:', error);
      return [];
    }
  }
  
  // Buscar todos os grupos para o seletor (inclui grupos que o usuário não participa?)
  static async getAllGroupsForSelector() {
    try {
      const allGroups = await this.getGroups();
      // Retorna todos os grupos existentes
      return allGroups.map(group => ({
        id: group.id,
        name: group.name,
      }));
    } catch (error) {
      console.error('Erro ao buscar grupos para seletor:', error);
      return [];
    }
  }

  // ========== METAS ==========
  
  // Adicionar meta a um grupo
  static async addGoalToGroup(groupId, goal) {
    try {
      const groups = await this.getGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1) {
        const newGoal = {
          id: Date.now().toString(),
          title: goal.title,
          xp: parseInt(goal.xp),
          createdAt: new Date().toISOString(),
          completedCount: 0,
        };
        
        if (!groups[groupIndex].goals) groups[groupIndex].goals = [];
        groups[groupIndex].goals.push(newGoal);
        await this.saveGroups(groups);
        
        return newGoal;
      }
      return null;
    } catch (error) {
      console.error('Erro ao adicionar meta ao grupo:', error);
      return null;
    }
  }

  // Remover meta do grupo
  static async removeGoalFromGroup(groupId, goalId) {
    try {
      const groups = await this.getGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1 && groups[groupIndex].goals) {
        groups[groupIndex].goals = groups[groupIndex].goals.filter(g => g.id !== goalId);
        await this.saveGroups(groups);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao remover meta do grupo:', error);
      return false;
    }
  }

  // ========== CONQUISTAS ==========
  
  // Adicionar conquista a um grupo
  static async addAchievementToGroup(groupId, achievement) {
    try {
      const groups = await this.getGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1) {
        const newAchievement = {
          id: Date.now().toString(),
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon || '🏆',
          createdAt: new Date().toISOString(),
        };
        
        if (!groups[groupIndex].achievements) groups[groupIndex].achievements = [];
        groups[groupIndex].achievements.push(newAchievement);
        await this.saveGroups(groups);
        
        return newAchievement;
      }
      return null;
    } catch (error) {
      console.error('Erro ao adicionar conquista ao grupo:', error);
      return null;
    }
  }

  // Remover conquista do grupo
  static async removeAchievementFromGroup(groupId, achievementId) {
    try {
      const groups = await this.getGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1 && groups[groupIndex].achievements) {
        groups[groupIndex].achievements = groups[groupIndex].achievements.filter(a => a.id !== achievementId);
        await this.saveGroups(groups);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao remover conquista do grupo:', error);
      return false;
    }
  }

  // ========== FEED ==========
  
  // Adicionar atividade ao feed
  static async addFeedActivity(activity) {
    try {
      const feed = await this.getFeed();
      const newActivity = {
        id: Date.now().toString(),
        ...activity,
        timestamp: new Date().toISOString(),
      };
      
      feed.unshift(newActivity);
      
      // Manter apenas últimas 100 atividades
      const trimmedFeed = feed.slice(0, 100);
      await AsyncStorage.setItem(STORAGE_KEYS.FEED, JSON.stringify(trimmedFeed));
      
      return newActivity;
    } catch (error) {
      console.error('Erro ao adicionar atividade ao feed:', error);
      return null;
    }
  }

  // Buscar feed
  static async getFeed() {
    try {
      const feed = await AsyncStorage.getItem(STORAGE_KEYS.FEED);
      return feed ? JSON.parse(feed) : [];
    } catch (error) {
      console.error('Erro ao buscar feed:', error);
      return [];
    }
  }

  // Buscar feed filtrado por grupo
  static async getFeedByGroup(groupId) {
    try {
      const feed = await this.getFeed();
      return feed.filter(activity => activity.groupId === groupId);
    } catch (error) {
      console.error('Erro ao buscar feed por grupo:', error);
      return [];
    }
  }

  // ========== PERFIL DO USUÁRIO ==========
  
  // Salvar perfil do usuário
  static async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      return false;
    }
  }

  // Buscar perfil do usuário
  static async getUserProfile() {
    try {
      const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (profile) {
        return JSON.parse(profile);
      }
      
      // Perfil padrão
      const defaultProfile = {
        id: Date.now().toString(),
        name: 'Usuário',
        username: 'usuario',
        email: '',
        totalXp: 0,
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        completedGoals: 0,
      };
      
      await this.saveUserProfile(defaultProfile);
      return defaultProfile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }

    // Verificar se username já existe
  static async isUsernameTaken(username, excludeUserId = null) {
    try {
        const users = await this.getUsers();
        return users.some(u => 
        u.username === username.toLowerCase() && u.id !== excludeUserId
        );
    } catch (error) {
        console.error('Erro ao verificar username:', error);
        return false;
    }
    }

  // Atualizar XP do usuário
  static async addUserXp(xpAmount) {
    try {
      const profile = await this.getUserProfile();
      profile.totalXp = (profile.totalXp || 0) + xpAmount;
      profile.completedGoals = (profile.completedGoals || 0) + 1;
      await this.saveUserProfile(profile);
      return profile.totalXp;
    } catch (error) {
      console.error('Erro ao adicionar XP:', error);
      return null;
    }
  }

  // Adicione ao StorageService.js

// Buscar perfil de usuário por ID
  static async getUserProfileById(userId) {
    try {
        // Primeiro tentar buscar como perfil principal
        const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        const currentProfile = profile ? JSON.parse(profile) : null;
        
        if (currentProfile && currentProfile.id === userId) {
        return currentProfile;
        }
        
        // Buscar da lista de usuários
        const users = await this.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            totalXp: 0,
        };
        }
        
        return null;
    } catch (error) {
        console.error('Erro ao buscar perfil por ID:', error);
        return null;
    }
    }

  // ========== SESSÃO DO USUÁRIO ==========
  
  // Salvar usuário atual
  static async setCurrentUser(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário atual:', error);
      return false;
    }
  }

  // Buscar usuário atual
  static async getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }

  // Limpar dados do usuário (logout)
  static async logout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return false;
    }
  }

  // Limpar todos os dados (reset do app)
  static async clearAllData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('@ProductivityRats'));
      await AsyncStorage.multiRemove(appKeys);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }
}

export default StorageService;