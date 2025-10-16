import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import do nosso sistema de storage
import {
  loadHabits,
  markHabitForToday,
  getHabitsStatusForDate,
  getTodayDateString,
  deleteHabit,
} from "../utils/storage";

const HomeScreen = ({ navigation }) => {
  const [habits, setHabits] = useState([]);
  const [todayStatus, setTodayStatus] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'

  // Carregar dados quando a tela for focada
  useEffect(() => {
    loadData();

    // Listener para quando a tela receber foco
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  // Carregar hábitos e status do dia
  const loadData = async () => {
    try {
      setRefreshing(true);
      const loadedHabits = await loadHabits();
      const today = getTodayDateString();
      const status = await getHabitsStatusForDate(today);

      setHabits(loadedHabits);
      setTodayStatus(status);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os hábitos");
    } finally {
      setRefreshing(false);
    }
  };

  // Marcar hábito como concluído/não concluído
  const toggleHabitCompletion = async (habitId) => {
    try {
      const currentStatus = todayStatus[habitId]?.completed || false;
      const newStatus = !currentStatus;

      await markHabitForToday(habitId, newStatus);

      // Atualizar estado local
      setTodayStatus((prev) => ({
        ...prev,
        [habitId]: { ...prev[habitId], completed: newStatus },
      }));
    } catch (error) {
      console.error("Erro ao marcar hábito:", error);
      Alert.alert("Erro", "Não foi possível atualizar o hábito");
    }
  };

  // Excluir hábito
  const handleDeleteHabit = (habit) => {
    Alert.alert(
      "Excluir Hábito",
      `Tem certeza que deseja excluir "${habit.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHabit(habit.id);
              await loadData(); // Recarregar a lista
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o hábito");
            }
          },
        },
      ]
    );
  };

  // Filtrar hábitos
  const filteredHabits = habits.filter((habit) => {
    if (filter === "all") return true;
    if (filter === "active") return habit.active;
    if (filter === "completed") {
      return todayStatus[habit.id]?.completed;
    }
    return true;
  });

  // Calcular progresso do dia
  const calculateDailyProgress = () => {
    const totalHabits = habits.length;
    if (totalHabits === 0) return 0;

    const completedHabits = Object.values(todayStatus).filter(
      (status) => status.completed
    ).length;
    return (completedHabits / totalHabits) * 100;
  };

  // Renderizar cada item da lista de hábitos
  const renderHabitItem = ({ item: habit }) => {
    const isCompleted = todayStatus[habit.id]?.completed || false;

    return (
      <View style={[styles.habitCard, isCompleted && styles.completedHabit]}>
        <TouchableOpacity
          style={styles.habitContent}
          onPress={() => toggleHabitCompletion(habit.id)}
          onLongPress={() => handleDeleteHabit(habit)}
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
            </View>
          </View>

          <View style={styles.habitActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditHabit", { habit })}
              style={styles.editButton}
            >
              <Ionicons name="create-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
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
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhum hábito cadastrado</Text>
      <Text style={styles.emptySubtitle}>
        Comece adicionando seu primeiro hábito para acompanhar seu progresso!
      </Text>
      <TouchableOpacity
        style={styles.addFirstButton}
        onPress={() => navigation.navigate("AddHabit")}
      >
        <Text style={styles.addFirstButtonText}>Adicionar Primeiro Hábito</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho com progresso */}
      <View style={styles.header}>
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progresso de Hoje</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${calculateDailyProgress()}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Object.values(todayStatus).filter((s) => s.completed).length} de{" "}
            {habits.length} hábitos
          </Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "all" && styles.filterButtonActive,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "all" && styles.filterTextActive,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "active" && styles.filterButtonActive,
            ]}
            onPress={() => setFilter("active")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "active" && styles.filterTextActive,
              ]}
            >
              Ativos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "completed" && styles.filterButtonActive,
            ]}
            onPress={() => setFilter("completed")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "completed" && styles.filterTextActive,
              ]}
            >
              Concluídos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lista de Hábitos */}
      <FlatList
        data={filteredHabits}
        renderItem={renderHabitItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            colors={["#4A90E2"]}
          />
        }
        ListEmptyComponent={renderEmptyList}
      />

      {/* Botão Flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddHabit")}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  progressCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  filterButtonActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContainer: {
    padding: 16,
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
  },
  habitActions: {
    flexDirection: "row",
  },
  editButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HomeScreen;
