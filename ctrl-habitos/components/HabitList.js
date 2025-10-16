import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HabitList = ({
  habits,
  todayStatus,
  onToggleCompletion,
  onEditHabit,
  onDeleteHabit,
  emptyMessage = "Nenhum hábito encontrado",
  showActions = true,
}) => {
  // Renderizar cada item da lista de hábitos
  const renderHabitItem = ({ item: habit }) => {
    const isCompleted = todayStatus[habit.id]?.completed || false;

    return (
      <View style={[styles.habitCard, isCompleted && styles.completedHabit]}>
        <TouchableOpacity
          style={styles.habitContent}
          onPress={() => onToggleCompletion(habit.id)}
          onLongPress={() => showActions && handleLongPress(habit)}
        >
          <View style={styles.habitLeft}>
            <View
              style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
            >
              {isCompleted && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <View style={styles.habitInfo}>
              <Text
                style={[styles.habitName, isCompleted && styles.completedText]}
              >
                {habit.name}
              </Text>
              <Text style={styles.habitFrequency}>
                {getFrequencyText(habit)}
              </Text>
              {showActions && (
                <Text style={styles.habitMeta}>
                  Meta: {habit.targetDays} dias/semana
                </Text>
              )}
            </View>
          </View>

          {showActions && (
            <View style={styles.habitActions}>
              <TouchableOpacity
                onPress={() => onEditHabit(habit)}
                style={styles.editButton}
              >
                <Ionicons name="create-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Barra de progresso semanal */}
        {showActions && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculateWeeklyProgress(habit.id)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(calculateWeeklyProgress(habit.id))}% esta semana
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Manipular pressionamento longo (para exclusão)
  const handleLongPress = (habit) => {
    Alert.alert("Gerenciar Hábito", `O que deseja fazer com "${habit.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Editar",
        onPress: () => onEditHabit(habit),
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => onDeleteHabit(habit),
      },
    ]);
  };

  // Calcular progresso semanal (simplificado)
  const calculateWeeklyProgress = (habitId) => {
    // Esta é uma versão simplificada - na implementação real,
    // você usaria a função getWeeklyProgress do storage
    const completed = Object.values(todayStatus).filter(
      (status) => status.completed
    ).length;
    const total = habits.length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  // Obter texto da frequência
  const getFrequencyText = (habit) => {
    switch (habit.frequency) {
      case "daily":
        return "Todos os dias";
      case "weekly":
        return `${habit.timesPerWeek || 3} vezes por semana`;
      default:
        return "Personalizado";
    }
  };

  // Renderizar lista vazia
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={48} color="#ccc" />
      <Text style={styles.emptyTitle}>{emptyMessage}</Text>
    </View>
  );

  return (
    <FlatList
      data={habits}
      renderItem={renderHabitItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyList}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
    flexGrow: 1,
  },
  habitCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedHabit: {
    borderColor: "#4CAF50",
    backgroundColor: "#f8fff9",
  },
  habitContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  habitLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  completedText: {
    color: "#4CAF50",
    textDecorationLine: "line-through",
  },
  habitFrequency: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  habitMeta: {
    fontSize: 11,
    color: "#999",
  },
  habitActions: {
    flexDirection: "row",
  },
  editButton: {
    padding: 8,
  },
  progressContainer: {
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e9ecef",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
    textAlign: "center",
  },
});

export default HabitList;
