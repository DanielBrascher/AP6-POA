// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/theme';
import Button from '../components/Button';

// Supondo que você tenha navegação - ajuste conforme seu router
// import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  // const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha e-mail e senha');
      return;
    }
    setLoading(true);
    setError('');
    
    // Simular chamada de API
    try {
      // Exemplo: await auth().signInWithEmailAndPassword(email, password);
      setTimeout(() => {
        setLoading(false);
        // navigation.replace('Home');
        console.log('Login bem-sucedido');
      }, 1500);
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // navigation.navigate('ForgotPassword');
    console.log('Esqueci a senha');
  };

  const handleSignUp = () => {
    // navigation.navigate('Register');
    console.log('Ir para cadastro');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo ou ícone do app */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🔥</Text>
          </View>
          <Text style={styles.appName}>Produtify</Text>
          <Text style={styles.tagline}>Metas coletivas, resultados reais</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={COLORS.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        {/* Link para cadastro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpText}> Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    ...TYPOGRAPHY.largeTitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tagline: {
    ...TYPOGRAPHY.footnote,
    color: COLORS.textSecondary,
  },
  form: {
    marginVertical: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    color: COLORS.text,
    ...TYPOGRAPHY.body,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorText: {
    color: COLORS.error,
    ...TYPOGRAPHY.footnote,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: SPACING.sm,
  },
  forgotText: {
    ...TYPOGRAPHY.footnote,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  signUpText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
});