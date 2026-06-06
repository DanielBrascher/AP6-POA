import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

const CATEGORIES = [
  { id: '1', label: 'Estudo', emoji: '📚' },
  { id: '2', label: 'Saúde', emoji: '🧘‍♀️' },
  { id: '3', label: 'Código', emoji: '💻' },
  { id: '4', label: 'Leitura', emoji: '📖' },
];

const TIME_OPTIONS = ['15 min', '30 min', '45 min', '1h', '1h 30m', '2h+'];

export default function CheckInScreen() {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [activity, setActivity] = useState('');
  const [selectedTime, setSelectedTime] = useState('45 min');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            {/* Cabeçalho */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Paguei o Preço 💪</Text>
              <Text style={styles.headerSubtitle}>Registre o foco de hoje para motivar a galera.</Text>
            </View>

            {/* Seção 1: Categoria */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Qual foi o foco?</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                      onPress={() => setSelectedCategory(cat.id)}
                    >
                      <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                      <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Seção 2: O que você fez */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Detalhe a missão (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Estudei Álgebra Linear / Refatorei a API"
                placeholderTextColor="#7C7C8A"
                value={activity}
                onChangeText={setActivity}
                maxLength={80}
              />
            </View>

            {/* Seção 3: Tempo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Por quanto tempo?</Text>
              <View style={styles.timeRow}>
                {TIME_OPTIONS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[styles.timeChipText, isSelected && styles.timeChipTextSelected]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Botão de Ação Principal */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.mainButton}
                activeOpacity={0.8}
                onPress={() => alert('Missão Concluída! Feed atualizado.')}
              >
                <Text style={styles.mainButtonText}>Tá Pago! 🔥</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8D8D99',
    marginTop: 6,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E1E1E6',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#202024',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#29292E',
  },
  categoryCardSelected: {
    borderColor: '#00B37E',
    backgroundColor: 'rgba(0, 179, 126, 0.05)',
  },
  categoryEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  categoryLabel: {
    color: '#C4C4CC',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryLabelSelected: {
    color: '#00B37E',
  },
  input: {
    backgroundColor: '#202024',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#29292E',
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    backgroundColor: '#202024',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#29292E',
    marginBottom: 4,
  },
  timeChipSelected: {
    backgroundColor: '#00B37E',
    borderColor: '#00B37E',
  },
  timeChipText: {
    color: '#C4C4CC',
    fontSize: 14,
    fontWeight: '600',
  },
  timeChipTextSelected: {
    color: '#121214',
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 12,
  },
  mainButton: {
    backgroundColor: '#00B37E',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B37E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Sombra para Android
  },
  mainButtonText: {
    color: '#121214',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});