// src/components/GroupCard.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export default function GroupCard({ name, points }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{points} XP</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface, // Usando o cinza escuro
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text, // Texto branco
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: theme.colors.primary, // Laranja de destaque
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 12,
  },
});