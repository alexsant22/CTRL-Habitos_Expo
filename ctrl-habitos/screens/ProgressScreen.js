import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import do nosso sistema de storage
import {
  loadHabits,
  loadDailyRecords,
  getWeeklyProgress,
  getMonthlyStats,
  getTodayDateString,
} from "../utils/storage";

const ProgressScreen = () => {
  const [habits, setHabits] = useState([]);
  const [dailyRecords, setDailyRecords] = useState({});
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedHabit) {
      loadHabitStats();
    }
  }, [selectedHabit, timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loadedHabits, loadedRecords] = await Promise.all([
        loadHabits(),
        loadDailyRecords(),
      ]);

      setHabits(loadedHabits);
      setDailyRecords(loadedRecords);

      if (loadedHabits.length > 0 && !selectedHabit) {
        setSelectedHabit(loadedHabits[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados de progresso");
    } finally {
      setLoading(false);
    }
  };

  const loadHabitStats = async () => {
    if (!selectedHabit) return;

    try {
      let habitStats;

      if (timeRange === "week") {
        habitStats = await getWeeklyProgress(selectedHabit.id);
      } else {
        const today = new Date();
        habitStats = await getMonthlyStats(
          selectedHabit.id,
          today.getFullYear(),
          today.getMonth() + 1
        );
      }

      setStats(habitStats);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  // Calcular estatísticas gerais
  const calculateGeneralStats = () => {
    const totalHabits = habits.length;
    if (totalHabits === 0) {
      return {
        totalCompleted: 0,
        completionRate: 0,
        bestHabit: null,
        needsImprovement: null,
      };
    }

    const today = getTodayDateString();
    const todayRecords = dailyRecords[today] || {};

    const completedToday = Object.values(todayRecords).filter(
      (record) => record.completed
    ).length;
    const completionRate = (completedToday / totalHabits) * 100;

    // Calcular hábitos com melhor e pior desempenho
    const habitPerformance = habits.map((habit) => ({
      ...habit,
      completionRate: calculateHabitCompletionRate(habit.id),
    }));

    const bestHabit = habitPerformance.reduce(
      (best, current) =>
        current.completionRate > (best?.completionRate || 0) ? current : best,
      null
    );

    const needsImprovement = habitPerformance.reduce(
      (worst, current) =>
        current.completionRate < (worst?.completionRate || 100)
          ? current
          : worst,
      null
    );

    return {
      totalCompleted: completedToday,
      completionRate,
      bestHabit,
      needsImprovement,
    };
  };

  // Calcular taxa de conclusão de um hábito
  const calculateHabitCompletionRate = (habitId) => {
    const last7Days = getLast7Days();
    let completed = 0;
    let total = 0;

    last7Days.forEach((date) => {
      if (dailyRecords[date] && dailyRecords[date][habitId]) {
        total++;
        if (dailyRecords[date][habitId].completed) {
          completed++;
        }
      }
    });

    return total > 0 ? (completed / total) * 100 : 0;
  };

  // Obter últimos 7 dias
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Criar barra de progresso visual
  const ProgressBar = ({ percentage, height = 8 }) => {
    return (
      <View style={[styles.progressBarContainer, { height }]}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%` },
            percentage >= 80
              ? styles.progressBarExcellent
              : percentage >= 60
              ? styles.progressBarGood
              : styles.progressBarNeedsImprovement,
          ]}
        />
      </View>
    );
  };

  // Estatísticas da semana atual
  const getWeeklyStats = () => {
    const last7Days = getLast7Days();
    return last7Days.map((date) => {
      const dayName = new Date(date).toLocaleDateString("pt-BR", {
        weekday: "short",
      });
      const completed = selectedHabit
        ? dailyRecords[date] &&
          dailyRecords[date][selectedHabit.id] &&
          dailyRecords[date][selectedHabit.id].completed
        : false;

      return {
        date,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        completed,
      };
    });
  };

  const generalStats = calculateGeneralStats();
  const weeklyStats = getWeeklyStats();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="stats-chart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>Nenhum dado disponível</Text>
        <Text style={styles.emptySubtitle}>
          Comece adicionando hábitos para acompanhar seu progresso!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Estatísticas Gerais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{habits.length}</Text>
            <Text style={styles.statLabel}>Hábitos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{generalStats.totalCompleted}</Text>
            <Text style={styles.statLabel}>Concluídos Hoje</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.round(generalStats.completionRate)}%
            </Text>
            <Text style={styles.statLabel}>Taxa de Conclusão</Text>
          </View>
        </View>

        {/* Destaques */}
        <View style={styles.highlightContainer}>
          {generalStats.bestHabit && (
            <View style={[styles.highlightCard, styles.bestCard]}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
              <View style={styles.highlightText}>
                <Text style={styles.highlightTitle}>Melhor Hábito</Text>
                <Text style={styles.highlightValue}>
                  {generalStats.bestHabit.name}
                </Text>
                <Text style={styles.highlightSubtitle}>
                  {Math.round(generalStats.bestHabit.completionRate)}% esta
                  semana
                </Text>
              </View>
            </View>
          )}

          {generalStats.needsImprovement &&
            generalStats.needsImprovement.completionRate < 70 && (
              <View style={[styles.highlightCard, styles.improveCard]}>
                <Ionicons name="trending-up" size={20} color="#FF6B6B" />
                <View style={styles.highlightText}>
                  <Text style={styles.highlightTitle}>Precisa Melhorar</Text>
                  <Text style={styles.highlightValue}>
                    {generalStats.needsImprovement.name}
                  </Text>
                  <Text style={styles.highlightSubtitle}>
                    {Math.round(generalStats.needsImprovement.completionRate)}%
                    esta semana
                  </Text>
                </View>
              </View>
            )}
        </View>
      </View>

      {/* Estatísticas Detalhadas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas Detalhadas</Text>

        {/* Seletor de Hábitos */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.habitsScroll}
        >
          {habits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitPill,
                selectedHabit?.id === habit.id && styles.habitPillSelected,
              ]}
              onPress={() => setSelectedHabit(habit)}
            >
              <Text
                style={[
                  styles.habitPillText,
                  selectedHabit?.id === habit.id &&
                    styles.habitPillTextSelected,
                ]}
              >
                {habit.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedHabit && (
          <>
            {/* Seletor de Período */}
            <View style={styles.timeRangeContainer}>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === "week" && styles.timeRangeButtonActive,
                ]}
                onPress={() => setTimeRange("week")}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === "week" && styles.timeRangeTextActive,
                  ]}
                >
                  Semana
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === "month" && styles.timeRangeButtonActive,
                ]}
                onPress={() => setTimeRange("month")}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === "month" && styles.timeRangeTextActive,
                  ]}
                >
                  Mês
                </Text>
              </TouchableOpacity>
            </View>

            {/* Estatísticas do Hábito */}
            <View style={styles.habitStats}>
              <Text style={styles.habitName}>{selectedHabit.name}</Text>

              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressNumber}>
                    {stats.completed || 0}
                  </Text>
                  <Text style={styles.progressLabel}>Concluídos</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressNumber}>{stats.total || 0}</Text>
                  <Text style={styles.progressLabel}>Total</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressNumber}>
                    {Math.round(stats.percentage || 0)}%
                  </Text>
                  <Text style={styles.progressLabel}>Taxa</Text>
                </View>
              </View>

              {/* Barra de Progresso */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progresso Geral</Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round(stats.percentage || 0)}%
                  </Text>
                </View>
                <ProgressBar percentage={stats.percentage || 0} />
              </View>

              {/* Progresso Semanal */}
              <View style={styles.weeklyProgress}>
                <Text style={styles.weeklyTitle}>Progresso Esta Semana</Text>
                <View style={styles.daysContainer}>
                  {weeklyStats.map((day, index) => (
                    <View key={index} style={styles.dayItem}>
                      <Text style={styles.dayName}>{day.dayName}</Text>
                      <Ionicons
                        name={
                          day.completed ? "checkmark-circle" : "ellipse-outline"
                        }
                        size={20}
                        color={day.completed ? "#4CAF50" : "#ccc"}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Dicas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dicas para Melhorar</Text>
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <Ionicons name="alarm-outline" size={20} color="#4A90E2" />
            <Text style={styles.tipText}>
              Estabeleça horários fixos para seus hábitos
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="flag-outline" size={20} color="#4A90E2" />
            <Text style={styles.tipText}>
              Comece com metas pequenas e realistas
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
            <Text style={styles.tipText}>
              Revise seu progresso regularmente
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    padding: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  highlightContainer: {
    gap: 12,
  },
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  bestCard: {
    backgroundColor: "#FFF9C4",
    borderColor: "#FFD700",
  },
  improveCard: {
    backgroundColor: "#FFEBEE",
    borderColor: "#FF6B6B",
  },
  highlightText: {
    marginLeft: 12,
    flex: 1,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 2,
  },
  highlightValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  highlightSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  habitsScroll: {
    marginBottom: 16,
  },
  habitPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  habitPillSelected: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  habitPillText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  habitPillTextSelected: {
    color: "#fff",
  },
  timeRangeContainer: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  timeRangeButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  timeRangeTextActive: {
    color: "#4A90E2",
  },
  habitStats: {
    gap: 16,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  progressStat: {
    alignItems: "center",
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
  },
  progressContainer: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
  progressBarContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressBarExcellent: {
    backgroundColor: "#4CAF50",
  },
  progressBarGood: {
    backgroundColor: "#FFA000",
  },
  progressBarNeedsImprovement: {
    backgroundColor: "#F44336",
  },
  weeklyProgress: {
    gap: 12,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayItem: {
    alignItems: "center",
    gap: 4,
  },
  dayName: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1f0ff",
  },
  tipText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default ProgressScreen;
