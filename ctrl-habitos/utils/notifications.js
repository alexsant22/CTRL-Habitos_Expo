import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { loadHabits } from "./storage";

// Configurar o handler de notificações para SDK 54
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Solicitar permissões para notificações (SDK 54)
export const requestNotificationPermissions = async () => {
  if (!Device.isDevice) {
    console.log("Notificações não suportadas em emuladores");
    return false;
  }

  try {
    // SDK 54 usa esta abordagem para permissões
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permissão para notificações não concedida");
      return false;
    }

    // Configurar canal de notificação (Android) - SDK 54
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#4A90E2",
      });
    }

    return true;
  } catch (error) {
    console.error("Erro ao solicitar permissões:", error);
    return false;
  }
};

// Agendar notificação para um hábito (SDK 54)
export const scheduleHabitNotification = async (habit) => {
  if (!habit.notification?.enabled || !habit.notification.time) {
    return null;
  }

  try {
    const [hours, minutes] = habit.notification.time.split(":").map(Number);

    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Hábito 📋",
        body: `Hora de "${habit.name}"! Não esqueça de marcar como concluído.`,
        sound: true,
        data: { habitId: habit.id, type: "habit-reminder" },
      },
      trigger,
    });

    console.log(
      `Notificação agendada para ${habit.name} às ${habit.notification.time}`
    );
    return notificationId;
  } catch (error) {
    console.error("Erro ao agendar notificação:", error);
    return null;
  }
};

// Cancelar notificação de um hábito
export const cancelHabitNotification = async (notificationId) => {
  if (!notificationId) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log("Notificação cancelada:", notificationId);
  } catch (error) {
    console.error("Erro ao cancelar notificação:", error);
  }
};

// Agendar notificações para todos os hábitos ativos
export const scheduleAllHabitNotifications = async () => {
  try {
    const habits = await loadHabits();
    const notificationIds = [];

    for (const habit of habits) {
      if (habit.notification?.enabled && habit.active !== false) {
        const notificationId = await scheduleHabitNotification(habit);
        if (notificationId) {
          notificationIds.push({
            habitId: habit.id,
            notificationId,
          });
        }
      }
    }

    console.log(`Agendadas ${notificationIds.length} notificações`);
    return notificationIds;
  } catch (error) {
    console.error("Erro ao agendar notificações:", error);
    return [];
  }
};

// Cancelar todas as notificações agendadas
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Todas as notificações canceladas");
  } catch (error) {
    console.error("Erro ao cancelar todas as notificações:", error);
  }
};

// Enviar notificação de conquista (SDK 54)
export const sendAchievementNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🎉 ${title}`,
        body: body,
        sound: true,
        data: { type: "achievement" },
      },
      trigger: null, // Enviar imediatamente
    });
  } catch (error) {
    console.error("Erro ao enviar notificação de conquista:", error);
  }
};

// Inicializar o sistema de notificações (SDK 54)
export const initializeNotifications = async () => {
  try {
    const hasPermission = await requestNotificationPermissions();

    if (hasPermission) {
      // Cancelar notificações antigas e agendar novas
      await cancelAllNotifications();
      await scheduleAllHabitNotifications();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erro ao inicializar notificações:", error);
    return false;
  }
};

export default {
  requestNotificationPermissions,
  scheduleHabitNotification,
  cancelHabitNotification,
  scheduleAllHabitNotifications,
  cancelAllNotifications,
  sendAchievementNotification,
  initializeNotifications,
};
