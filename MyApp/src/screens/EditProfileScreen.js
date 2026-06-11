// src/screens/EditProfileScreen.js (atualizado)
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import StorageService from '../services/StorageService';

export default function EditProfileScreen({ navigation, route }) {
  const { profile: existingProfile } = route.params || {};
  
  const [name, setName] = useState(existingProfile?.name || '');
  const [username, setUsername] = useState(existingProfile?.username || '');
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [location, setLocation] = useState(existingProfile?.location || '');
  const [website, setWebsite] = useState(existingProfile?.website || '');
  const [avatarUrl, setAvatarUrl] = useState(existingProfile?.avatarUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    
    if (!username.trim()) {
      Alert.alert('Erro', 'O nome de usuário não pode ficar vazio.');
      return;
    }
    
    setLoading(true);
    
    try {
      const currentUser = await StorageService.getCurrentUser();
      const allUsers = await StorageService.getUsers();
      
      // Verificar se o username já está em uso (exceto pelo próprio usuário)
      const usernameTaken = allUsers.some(u => 
        u.username === username.trim().toLowerCase() && u.id !== currentUser?.id
      );
      
      if (usernameTaken) {
        Alert.alert('Erro', 'Este nome de usuário já está em uso!');
        setLoading(false);
        return;
      }
      
      // Atualizar perfil
      const updatedProfile = {
        ...existingProfile,
        id: currentUser?.id,
        name: name.trim(),
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        avatarUrl: avatarUrl.trim(),
        updatedAt: new Date().toISOString(),
      };
      
      await StorageService.saveUserProfile(updatedProfile);
      
      // Atualizar informações do usuário na lista de usuários
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          name: name.trim(),
          username: username.trim().toLowerCase(),
        };
        await StorageService.saveUser(updatedUser);
        await StorageService.setCurrentUser(updatedUser);
      }
      
      Alert.alert(
        'Sucesso 🎉', 
        'Perfil atualizado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Editar Perfil</Text>
      <Text style={styles.subtitle}>Mantenha seus dados atualizados para a sua tribo</Text>

      <View style={styles.avatarPreviewContainer}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : '?'}</Text>
        </View>
        <Text style={styles.avatarHelpText}>A alteração de foto usa uma URL de imagem</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome completo"
          placeholderTextColor={theme.colors.textMuted}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome de Usuário</Text>
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
        <Text style={styles.helperText}>Seu identificador único no app</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio / Sobre você</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Conte um pouco sobre você..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: São Paulo, SP"
          placeholderTextColor={theme.colors.textMuted}
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website / Portfolio</Text>
        <TextInput
          style={styles.input}
          placeholder="https://seusite.com"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          keyboardType="url"
          value={website}
          onChangeText={setWebsite}
        />
      </View>

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
        <Text style={styles.helperText}>Cole o link de uma imagem para usar como avatar</Text>
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
        onPress={handleSaveChanges}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        )}
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
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
    borderWidth: 0,
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: { 
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});