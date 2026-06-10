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
  StatusBar
} from 'react-native';
import { theme } from '../styles/theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Validações básicas
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    // Aqui entrará a integração com o seu backend futuramente
    alert('Conta criada com sucesso! Bem-vindo à tribo.');
    
    // Navega para o app principal
    navigation.replace('MainTabs');
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
        {/* Cabeçalho */}
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>
            CRIAR <Text style={{ color: theme.colors.primary }}>CONTA</Text>
          </Text>
          <Text style={styles.subtitle}>Entre para o bando e comece a pontuar.</Text>
        </View>

        {/* Formulário de Cadastro */}
        <View style={styles.formContainer}>
          
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ex: Shape Mental"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />

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

          {/* Botão de Cadastrar */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>FORJAR PERFIL</Text>
          </TouchableOpacity>
        </View>

        {/* Voltar para o Login */}
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