// src/screens/EditProfileScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

export default function EditProfileScreen({ navigation }) {
  // Estados para controlar os inputs do perfil
  const [name, setName] = useState('João Silva');
  const [username, setUsername] = useState('joaosilva');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSaveChanges = () => {
    if (!name.trim() || !username.trim()) {
      Alert.alert('Erro', 'Os campos Nome e Username não podem ficar vazios.');
      return;
    }

    // Aqui futuramente entraria a requisição para o banco de dados
    Alert.alert('Sucesso 🎉', 'Perfil atualizado com sucesso!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Editar Perfil</Text>
      <Text style={styles.subtitle}>Mantenha seus dados atualizados para a sua tribo</Text>

      {/* Preview do Avatar Atual */}
      <View style={styles.avatarPreviewContainer}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{name ? name[0] : '?'}</Text>
        </View>
        <Text style={styles.avatarHelpText}>A alteração de foto usa uma URL de imagem</Text>
      </View>

      {/* Input: Nome */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor={theme.colors.textMuted}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Input: Username */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome de Usuário (Username)</Text>
        <View style={styles.usernameInputWrapper}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            style={[styles.input, styles.usernameInput]}
            placeholder="username"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </View>

      {/* Input: URL da Foto */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>URL da Foto de Perfil</Text>
        <TextInput
          style={styles.input}
          placeholder="https://exemplo.com/suafoto.jpg"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          keyboardType="url"
          value={avatarUrl}
          onChangeText={setAvatarUrl}
        />
      </View>

      {/* Botão de Salvar */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSaveChanges}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background, 
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  title: { 
    color: theme.colors.text, 
    fontSize: 26, 
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 24,
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: theme.colors.surface, 
    marginBottom: 10, 
    borderWidth: 2, 
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: 'bold',
  },
  avatarHelpText: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: { 
    color: theme.colors.text, 
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  usernameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  atSymbol: {
    color: theme.colors.textMuted,
    fontSize: 16,
    paddingLeft: 16,
    fontWeight: '600',
  },
  usernameInput: {
    flex: 1,
    borderWidth: 0, // Remove a borda interna para usar a do wrapper
    paddingLeft: 4,
  },
  saveButton: { 
    backgroundColor: theme.colors.primary, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  saveButtonText: { 
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});