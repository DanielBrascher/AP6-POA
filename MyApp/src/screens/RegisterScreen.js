// src/screens/RegisterScreen.js (atualizado)
import React, { useState } from 'react';
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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validações básicas
    if (!name.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setLoading(true);

    try {
      // Verificar se o e-mail já está em uso
      const existingUsers = await StorageService.getUsers();
      const emailExists = existingUsers.some(u => u.email === email);
      
      if (emailExists) {
        Alert.alert('Erro', 'Este e-mail já está cadastrado!');
        setLoading(false);
        return;
      }
      
      // Verificar se o username já está em uso
      const usernameExists = existingUsers.some(u => u.username === username);
      
      if (usernameExists) {
        Alert.alert('Erro', 'Este nome de usuário já está em uso!');
        setLoading(false);
        return;
      }

      // Criar novo usuário
      const newUserId = Date.now().toString();
      const newUser = {
        id: newUserId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password: password,
        createdAt: new Date().toISOString(),
      };
      
      await StorageService.saveUser(newUser);
      
      // Criar perfil do usuário
      const newProfile = {
        id: newUserId,
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        totalXp: 0,
        avatarUrl: '',
        completedGoals: 0,
        createdAt: new Date().toISOString(),
        bio: '',
        location: '',
        website: '',
      };
      
      await StorageService.saveUserProfile(newProfile);
      
      // Adicionar usuário a todos os grupos padrão
      const defaultGroups = await StorageService.getGroups();
      
      for (const group of defaultGroups) {
        await StorageService.addUserToGroup(newUserId, group.id, 'member');
      }
      
      // Salvar usuário atual
      await StorageService.setCurrentUser(newUser);
      
      Alert.alert(
        'Sucesso!', 
        `Bem-vindo, ${name}! Sua conta foi criada e você foi adicionado aos grupos padrão.`,
        [{ text: 'OK', onPress: () => navigation.replace('MainTabs') }]
      );
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Não foi possível criar sua conta. Tente novamente.');
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
            CRIAR <Text style={{ color: theme.colors.primary }}>CONTA</Text>
          </Text>
          <Text style={styles.subtitle}>Entre para o bando e comece a pontuar.</Text>
        </View>

        <View style={styles.formContainer}>
          
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ex: João Silva"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Nome de Usuário</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ex: joaosilva"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.helperText}>Seu identificador único no app</Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput 
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput 
            style={styles.input}
            placeholder="No mínimo 6 caracteres"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput 
            style={styles.input}
            placeholder="Digite a senha novamente"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>FORJAR PERFIL</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Faça login</Text>
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
    marginBottom: 30,
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
    marginBottom: 6,
    marginTop: 12,
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    marginBottom: 8,
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
  button: { 
    backgroundColor: theme.colors.primary, 
    paddingVertical: 16, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 24,
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
  loginText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});