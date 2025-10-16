import { Alert } from "react-native";

// Gerar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Obter data de hoje no formato YYYY-MM-DD
export const getTodayDateString = () => {
  return new Date().toISOString().split("T")[0];
};

// Obter data formatada para exibição
export const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoje";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ontem";
  } else {
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
};

// Obter dia da semana
export const getDayOfWeek = (dateString) => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const date = new Date(dateString);
  return days[date.getDay()];
};

// Calcular diferença em dias entre duas datas
export const getDaysDifference = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000; // horas * minutos * segundos * milissegundos
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar se string está vazia
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

// Capitalizar primeira letra
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncar texto
export const truncate = (str, length = 50) => {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
};

// Formatar número com leading zero
export const padZero = (num) => {
  return num.toString().padStart(2, "0");
};

// Obter iniciais do nome
export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Mostrar alerta personalizado
export const showAlert = (title, message, buttons = [{ text: "OK" }]) => {
  Alert.alert(title, message, buttons);
};

// Confirmar ação
export const confirmAction = (title, message, onConfirm, onCancel) => {
  Alert.alert(title, message, [
    {
      text: "Cancelar",
      style: "cancel",
      onPress: onCancel,
    },
    {
      text: "Confirmar",
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
};

// Calcular idade a partir da data de nascimento
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// Formatar número para moeda brasileira
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Obter cor baseada no score
export const getScoreColor = (score, maxScore = 100) => {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) return "#4CAF50"; // Verde
  if (percentage >= 60) return "#FFA726"; // Laranja
  if (percentage >= 40) return "#FF9800"; // Amarelo escuro
  return "#F44336"; // Vermelho
};

// Função para aguardar um tempo
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Validar URL
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Converter string para slug
export const stringToSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export default {
  generateId,
  getTodayDateString,
  formatDisplayDate,
  getDayOfWeek,
  getDaysDifference,
  isValidEmail,
  isEmpty,
  capitalize,
  truncate,
  padZero,
  getInitials,
  debounce,
  deepClone,
  showAlert,
  confirmAction,
  calculateAge,
  formatCurrency,
  getScoreColor,
  sleep,
  isValidUrl,
  stringToSlug,
};
