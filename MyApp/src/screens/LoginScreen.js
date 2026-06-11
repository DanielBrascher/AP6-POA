// src/screens/LoginScreen.js (atualizado)
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { theme } from '../styles/theme';
import StorageService from '../services/StorageService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Inicializar dados padrão quando o app abre
    const initialize = async () => {
      await StorageService.initializeDefaultData();
    };
    initialize();
  }, []);

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      // Buscar usuários salvos
      let users = await StorageService.getUsers();
      
      // Verificar se o usuário existe
      let user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        // Criar novo usuário para teste
        const newUserId = Date.now().toString();
        user = {
          id: newUserId,
          email,
          password,
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        
        await StorageService.saveUser(user);
        
        // Adicionar o novo usuário aos grupos padrão (Devs, Estudos, Hábitos)
        const defaultGroups = await StorageService.getGroups();
        
        // Adicionar usuário a todos os grupos padrão como membro
        for (const group of defaultGroups) {
          await StorageService.addUserToGroup(newUserId, group.id, 'member');
        }
        
        // Criar perfil para o usuário
        const profile = {
          id: newUserId,
          name: user.name,
          username: email.split('@')[0],
          email: email,
          totalXp: 0,
          avatarUrl: '',
          createdAt: new Date().toISOString(),
          completedGoals: 0,
        };
        await StorageService.saveUserProfile(profile);
      }
      
      // Salvar usuário atual
      await StorageService.setCurrentUser(user);
      
      // Atualizar perfil se necessário
      const profile = await StorageService.getUserProfile();
      if (!profile.name || profile.name === 'Usuário') {
        await StorageService.saveUserProfile({
          ...profile,
          name: user.name,
          username: email.split('@')[0],
          email: email,
        });
      }
      
      Alert.alert('Sucesso', `Bem-vindo, ${user.name}!`);
      navigation.replace('MainTabs');
      
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>
            PRODUCTIVITY<Text style={{ color: theme.colors.primary }}>RATS</Text>
          </Text>
          <Text style={styles.subtitle}>No pain, no brain. Foque nas suas metas.</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput 
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput 
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>BATER O PONTO</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Não possui conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Crie sua conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: { 
    color: '#FFF', 
    fontSize: 28, 
    fontWeight: 'bold', 
    letterSpacing: 2,
    textAlign: 'center'
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: theme.colors.secondary,
    fontSize: 12,
  },
  button: { 
    backgroundColor: theme.colors.primary, 
    paddingVertical: 16, 
    borderRadius: 8, 
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold',
    letterSpacing: 1
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  registerText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});