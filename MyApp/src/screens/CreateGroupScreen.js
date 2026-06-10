// src/screens/CreateGroupScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { theme } from '../styles/theme';

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Ops!', 'O nome do grupo é obrigatório.');
      return;
    }

    // Simulando a criação do grupo e navegando como "owner" (dono)
    navigation.navigate('GroupDetails', { 
      groupName: groupName,
      role: 'owner' 
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Criar Novo Grupo</Text>
      <Text style={styles.subtitle}>Defina as regras e foque junto com seus amigos</Text>

      {/* Input: Nome do Grupo */}
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

      {/* Input: Descrição */}
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

      {/* Input: URL da Imagem de Capa */}
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

      {/* Botão Salvar */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleCreateGroup}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>Criar e Ir para o Grupo 🚀</Text>
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
    textAlignVertical: 'top', // Garante que o texto comece no topo no Android
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
    fontSize: 16 
  },
});