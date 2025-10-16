import AsyncStorage from "@react-native-async-storage/async-storage";

// Chaves para armazenamento
const HABITS_KEY = "@habits_data";
const DAILY_RECORDS_KEY = "@daily_records";

// ===== FUNÇÕES PARA HÁBITOS =====

// Salvar lista de hábitos
export const saveHabits = async (habits) => {
  try {
    const jsonValue = JSON.stringify(habits);
    await AsyncStorage.setItem(HABITS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error("Erro ao salvar hábitos:", error);
    return false;
  }
};

// Carregar lista de hábitos
export const loadHabits = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Erro ao carregar hábitos:", error);
    return [];
  }
};

// Adicionar novo hábito
export const addHabit = async (habit) => {
  try {
    const habits = await loadHabits();
    const newHabit = {
      ...habit,
      id: generateId(),
      createdAt: new Date().toISOString(),
      active: true,
    };
    habits.push(newHabit);
    await saveHabits(habits);
    return newHabit;
  } catch (error) {
    console.error("Erro ao adicionar hábito:", error);
    return null;
  }
};

// Atualizar hábito existente
export const updateHabit = async (habitId, updates) => {
  try {
    const habits = await loadHabits();
    const index = habits.findIndex((habit) => habit.id === habitId);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      await saveHabits(habits);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao atualizar hábito:", error);
    return false;
  }
};

// Excluir hábito
export const deleteHabit = async (habitId) => {
  try {
    const habits = await loadHabits();
    const filteredHabits = habits.filter((habit) => habit.id !== habitId);
    await saveHabits(filteredHabits);

    // Também remove os registros desse hábito
    await removeHabitRecords(habitId);

    return true;
  } catch (error) {
    console.error("Erro ao excluir hábito:", error);
    return false;
  }
};

// ===== FUNÇÕES PARA REGISTROS DIÁRIOS =====

// Salvar registros diários
export const saveDailyRecords = async (records) => {
  try {
    const jsonValue = JSON.stringify(records);
    await AsyncStorage.setItem(DAILY_RECORDS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error("Erro ao salvar registros diários:", error);
    return false;
  }
};

// Carregar registros diários
export const loadDailyRecords = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(DAILY_RECORDS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (error) {
    console.error("Erro ao carregar registros diários:", error);
    return {};
  }
};

// Marcar hábito como concluído/não concluído para hoje
export const markHabitForToday = async (habitId, completed, photo = null) => {
  try {
    const today = getTodayDateString();
    const records = await loadDailyRecords();

    if (!records[today]) {
      records[today] = {};
    }

    records[today][habitId] = {
      completed,
      photo,
      timestamp: completed ? new Date().toISOString() : null,
    };

    await saveDailyRecords(records);
    return true;
  } catch (error) {
    console.error("Erro ao marcar hábito:", error);
    return false;
  }
};

// Obter status dos hábitos para uma data específica
export const getHabitsStatusForDate = async (dateString) => {
  try {
    const records = await loadDailyRecords();
    return records[dateString] || {};
  } catch (error) {
    console.error("Erro ao obter status dos hábitos:", error);
    return {};
  }
};

// Obter progresso semanal
export const getWeeklyProgress = async (habitId) => {
  try {
    const records = await loadDailyRecords();
    const weekDates = getLast7Days();

    let completed = 0;
    let total = 0;

    weekDates.forEach((date) => {
      if (records[date] && records[date][habitId]) {
        total++;
        if (records[date][habitId].completed) {
          completed++;
        }
      }
    });

    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  } catch (error) {
    console.error("Erro ao calcular progresso semanal:", error);
    return { completed: 0, total: 0, percentage: 0 };
  }
};

// ===== FUNÇÕES AUXILIARES =====

// Gerar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Obter data de hoje no formato YYYY-MM-DD
export const getTodayDateString = () => {
  return new Date().toISOString().split("T")[0];
};

// Obter últimas 7 datas
const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

// Remover registros de um hábito específico
const removeHabitRecords = async (habitId) => {
  try {
    const records = await loadDailyRecords();
    const updatedRecords = {};

    Object.keys(records).forEach((date) => {
      const dateRecords = { ...records[date] };
      delete dateRecords[habitId];
      if (Object.keys(dateRecords).length > 0) {
        updatedRecords[date] = dateRecords;
      }
    });

    await saveDailyRecords(updatedRecords);
    return true;
  } catch (error) {
    console.error("Erro ao remover registros do hábito:", error);
    return false;
  }
};

// Obter estatísticas mensais
export const getMonthlyStats = async (habitId, year, month) => {
  try {
    const records = await loadDailyRecords();
    let completed = 0;
    let totalDays = 0;

    Object.keys(records).forEach((date) => {
      const [recordYear, recordMonth] = date.split("-");
      if (parseInt(recordYear) === year && parseInt(recordMonth) === month) {
        totalDays++;
        if (records[date][habitId] && records[date][habitId].completed) {
          completed++;
        }
      }
    });

    return {
      completed,
      total: totalDays,
      percentage: totalDays > 0 ? (completed / totalDays) * 100 : 0,
    };
  } catch (error) {
    console.error("Erro ao calcular estatísticas mensais:", error);
    return { completed: 0, total: 0, percentage: 0 };
  }
};

export default {
  saveHabits,
  loadHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  saveDailyRecords,
  loadDailyRecords,
  markHabitForToday,
  getHabitsStatusForDate,
  getWeeklyProgress,
  getMonthlyStats,
  getTodayDateString,
};
