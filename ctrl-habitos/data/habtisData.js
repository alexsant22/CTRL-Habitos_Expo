// Dados iniciais e exemplos para o app

export const defaultHabits = [
  {
    id: "1",
    name: "Beber água",
    frequency: "daily",
    timesPerWeek: 7,
    targetDays: 7,
    createdAt: new Date().toISOString(),
    active: true,
    notification: {
      enabled: true,
      time: "08:00",
      notificationId: null,
    },
  },
  {
    id: "2",
    name: "Meditar",
    frequency: "daily",
    timesPerWeek: 7,
    targetDays: 5,
    createdAt: new Date().toISOString(),
    active: true,
    notification: {
      enabled: true,
      time: "07:00",
      notificationId: null,
    },
  },
  {
    id: "3",
    name: "Exercícios",
    frequency: "weekly",
    timesPerWeek: 3,
    targetDays: 3,
    createdAt: new Date().toISOString(),
    active: true,
    notification: {
      enabled: true,
      time: "18:00",
      notificationId: null,
    },
  },
];

export const habitCategories = [
  {
    id: "health",
    name: "Saúde",
    color: "#4CAF50",
    icon: "fitness",
    habits: ["Beber água", "Exercícios", "Dormir cedo"],
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    color: "#2196F3",
    icon: "leaf",
    habits: ["Meditar", "Journaling", "Respiração"],
  },
  {
    id: "learning",
    name: "Aprendizado",
    color: "#FF9800",
    icon: "school",
    habits: ["Ler", "Estudar", "Curso online"],
  },
  {
    id: "productivity",
    name: "Produtividade",
    color: "#9C27B0",
    icon: "rocket",
    habits: ["Planejar dia", "Limpar email", "Organizar"],
  },
];

export const frequencyOptions = [
  {
    value: "daily",
    label: "Todos os dias",
    description: "Realizar diariamente",
    icon: "calendar",
  },
  {
    value: "weekly",
    label: "Vezes por semana",
    description: "Definir frequência semanal",
    icon: "repeat",
  },
];

export const motivationalQuotes = [
  {
    text: "A disciplina é a ponte entre metas e realizações.",
    author: "Jim Rohn",
  },
  {
    text: "Pequenos hábitos, quando não são abandonados, geram grandes resultados.",
    author: "Epicteto",
  },
  {
    text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    author: "Robert Collier",
  },
  {
    text: "Não é o que fazemos de vez em quando que molda nossa vida. É o que fazemos consistentemente.",
    author: "Anthony Robbins",
  },
  {
    text: "A qualidade de sua vida é determinada pela qualidade de seus hábitos.",
    author: "Desconhecido",
  },
];

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

export const calculateStreak = (records) => {
  if (!records || Object.keys(records).length === 0) return 0;

  const dates = Object.keys(records)
    .filter((date) => {
      const habitRecords = Object.values(records[date]);
      return habitRecords.some((record) => record.completed);
    })
    .sort()
    .reverse();

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < dates.length; i++) {
    const recordDate = new Date(dates[i]);
    const diffTime = Math.abs(currentDate - recordDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }

    currentDate = recordDate;
  }

  return streak;
};

export const getHabitSuggestions = () => [
  {
    name: "Beber 2L de água",
    category: "health",
    frequency: "daily",
    icon: "water",
  },
  {
    name: "Meditar 10min",
    category: "mindfulness",
    frequency: "daily",
    icon: "leaf",
  },
  {
    name: "Exercitar 30min",
    category: "health",
    frequency: "weekly",
    timesPerWeek: 3,
    icon: "fitness",
  },
  {
    name: "Ler 20 páginas",
    category: "learning",
    frequency: "daily",
    icon: "book",
  },
  {
    name: "Dormir 8 horas",
    category: "health",
    frequency: "daily",
    icon: "moon",
  },
  {
    name: "Planejar o dia",
    category: "productivity",
    frequency: "daily",
    icon: "checklist",
  },
];

export default {
  defaultHabits,
  habitCategories,
  frequencyOptions,
  motivationalQuotes,
  getRandomQuote,
  calculateStreak,
  getHabitSuggestions,
};
