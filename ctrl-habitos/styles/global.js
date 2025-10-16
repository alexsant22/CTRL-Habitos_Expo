import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Cores do tema
export const Colors = {
  primary: "#4A90E2",
  primaryDark: "#357ABD",
  primaryLight: "#6BA8E9",

  secondary: "#FF6B6B",
  secondaryDark: "#E05555",
  secondaryLight: "#FF8585",

  success: "#4CAF50",
  successDark: "#3D8B40",
  successLight: "#6BC36E",

  warning: "#FFA726",
  warningDark: "#F57C00",
  warningLight: "#FFB74D",

  error: "#F44336",
  errorDark: "#D32F2F",
  errorLight: "#E57373",

  background: "#F8F9FA",
  surface: "#FFFFFF",
  surfaceDark: "#F5F5F5",

  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#9E9E9E",
    inverse: "#FFFFFF",
  },

  border: "#E0E0E0",
  borderLight: "#F5F5F5",
  borderDark: "#BDBDBD",

  shadow: "#000000",

  // Cores específicas para hábitos
  habit: {
    completed: "#4CAF50",
    pending: "#FFA726",
    missed: "#F44336",
    future: "#9E9E9E",
  },
};

// Tipografia
export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    color: Colors.text.primary,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    color: Colors.text.primary,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    color: Colors.text.primary,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    color: Colors.text.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: Colors.text.primary,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: Colors.text.secondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: Colors.text.secondary,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: Colors.text.inverse,
  },
};

// Espaçamentos
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Bordas
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 24,
  pill: 100,
};

// Sombras
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Estilos globais
const GlobalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerPadding: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
  },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },

  // Botões
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonSuccess: {
    backgroundColor: Colors.success,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.text.disabled,
  },

  // Textos de botão
  buttonText: {
    ...Typography.button,
  },
  buttonTextOutline: {
    ...Typography.button,
    color: Colors.primary,
  },
  buttonTextDisabled: {
    ...Typography.button,
    color: Colors.text.inverse,
  },

  // Inputs
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: Colors.error,
  },

  // Headers
  header: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h3,
    textAlign: "center",
  },

  // Listas
  listItem: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  listItemFirst: {
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
  },
  listItemLast: {
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    borderBottomWidth: 0,
  },

  // Badges
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    alignSelf: "flex-start",
  },
  badgePrimary: {
    backgroundColor: Colors.primaryLight,
  },
  badgeSuccess: {
    backgroundColor: Colors.successLight,
  },
  badgeWarning: {
    backgroundColor: Colors.warningLight,
  },
  badgeError: {
    backgroundColor: Colors.errorLight,
  },

  // Progresso
  progressBar: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.pill,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },

  // Estados vazios
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyStateIcon: {
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  emptyStateText: {
    ...Typography.bodySmall,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  emptyStateTitle: {
    ...Typography.h4,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },

  // Utilitários de layout
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowAround: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Espaçamentos utilitários
  mbXs: { marginBottom: Spacing.xs },
  mbSm: { marginBottom: Spacing.sm },
  mbMd: { marginBottom: Spacing.md },
  mbLg: { marginBottom: Spacing.lg },
  mtXs: { marginTop: Spacing.xs },
  mtSm: { marginTop: Spacing.sm },
  mtMd: { marginTop: Spacing.md },
  mtLg: { marginTop: Spacing.lg },
  mlXs: { marginLeft: Spacing.xs },
  mlSm: { marginLeft: Spacing.sm },
  mlMd: { marginLeft: Spacing.md },
  mrXs: { marginRight: Spacing.xs },
  mrSm: { marginRight: Spacing.sm },
  mrMd: { marginRight: Spacing.md },
  pXs: { padding: Spacing.xs },
  pSm: { padding: Spacing.sm },
  pMd: { padding: Spacing.md },
  pLg: { padding: Spacing.lg },
  pxSm: { paddingHorizontal: Spacing.sm },
  pxMd: { paddingHorizontal: Spacing.md },
  pxLg: { paddingHorizontal: Spacing.lg },
  pySm: { paddingVertical: Spacing.sm },
  pyMd: { paddingVertical: Spacing.md },
  pyLg: { paddingVertical: Spacing.lg },
});

// Funções utilitárias
export const getHabitColor = (status) => {
  switch (status) {
    case "completed":
      return Colors.habit.completed;
    case "pending":
      return Colors.habit.pending;
    case "missed":
      return Colors.habit.missed;
    case "future":
      return Colors.habit.future;
    default:
      return Colors.primary;
  }
};

export const getProgressColor = (percentage) => {
  if (percentage >= 80) return Colors.success;
  if (percentage >= 60) return Colors.warning;
  return Colors.error;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

export const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

export default GlobalStyles;
