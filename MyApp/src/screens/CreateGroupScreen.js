// src/screens/CreateGroupScreen.js (corrigido)
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { theme } from '../styles/theme';
import StorageService from '../services/StorageService';

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Ops!', 'O nome do grupo é obrigatório.');
      return;
    }

    setLoading(true);

    const currentUser = await StorageService.getCurrentUser();
    if (!currentUser) {
      Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
      setLoading(false);
      return;
    }

    const newGroup = await StorageService.createGroup(
      {
        name: groupName,
        description: description,
        imageUrl: imageUrl,
      },
      currentUser.id
    );

    if (newGroup) {
      // Navegar diretamente para a tela do grupo criado
      navigation.replace('GroupDetails', { 
        groupId: newGroup.id, 
        groupName: newGroup.name,
        role: 'owner' 
      });
    } else {
      Alert.alert('Erro', 'Não foi possível criar o grupo. Tente novamente.');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Criar Novo Grupo</Text>
      <Text style={styles.subtitle}>Defina as regras e foque junto com seus amigos</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Grupo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Devs Ripped, Estudo Intenso..."
          placeholderTextColor={theme.colors.textMuted}
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Foco / Descrição do Grupo</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Qual é o objetivo principal do grupo?"
          placeholderTextColor={theme.colors.textMuted}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>URL da Imagem do Grupo (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://linkdaimagem.com/foto.jpg"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          keyboardType="url"
          value={imageUrl}
          onChangeText={setImageUrl}
        />
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
        onPress={handleCreateGroup}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Criando...' : 'Criar e Ir para o Grupo 🚀'}
        </Text>
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
    paddingTop: 40,
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
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
    fontSize: 16 
  },
});