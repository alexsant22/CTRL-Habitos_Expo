import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  scheduleHabitNotification,
  cancelHabitNotification,
  requestNotificationPermissions,
} from "../utils/notifications";

const NotificationManager = ({ habit, onUpdate }) => {
  const [notificationEnabled, setNotificationEnabled] = useState(
    habit.notification?.enabled || false
  );
  const [notificationTime, setNotificationTime] = useState(
    habit.notification?.time
      ? getTimeFromString(habit.notification.time)
      : new Date()
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Converter string de tempo para Date
  function getTimeFromString(timeString) {
    if (!timeString) return new Date();

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  }

  // Verificar permissões ao carregar
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const permission = await requestNotificationPermissions();
    setHasPermission(permission);
  };

  // Manipular mudança no switch de notificações
  const handleNotificationToggle = async (enabled) => {
    if (enabled && !hasPermission) {
      const permissionGranted = await requestNotificationPermissions();

      if (!permissionGranted) {
        Alert.alert(
          "Permissão Necessária",
          "Para receber lembretes, é necessário permitir notificações nas configurações do dispositivo.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Configurar",
              onPress: () => {
                // Aqui você poderia abrir as configurações do app
                Alert.alert(
                  "Info",
                  "Vá para Configurações > Apps > Ctrl Hábitos > Notificações para ativar."
                );
              },
            },
          ]
        );
        return;
      }
      setHasPermission(true);
    }

    setNotificationEnabled(enabled);

    if (enabled) {
      // Agendar nova notificação
      const updatedHabit = {
        ...habit,
        notification: {
          enabled: true,
          time: formatTime(notificationTime),
        },
      };

      const notificationId = await scheduleHabitNotification(updatedHabit);

      if (notificationId) {
        onUpdate({
          ...updatedHabit,
          notification: {
            ...updatedHabit.notification,
            notificationId,
          },
        });
      }
    } else {
      // Cancelar notificação existente
      if (habit.notification?.notificationId) {
        await cancelHabitNotification(habit.notification.notificationId);
      }

      onUpdate({
        ...habit,
        notification: {
          enabled: false,
          time: null,
          notificationId: null,
        },
      });
    }
  };

  // Manipular mudança de horário
  const handleTimeChange = async (event, selectedTime) => {
    setShowTimePicker(false);

    if (selectedTime) {
      setNotificationTime(selectedTime);

      if (notificationEnabled) {
        // Cancelar notificação antiga e agendar nova
        if (habit.notification?.notificationId) {
          await cancelHabitNotification(habit.notification.notificationId);
        }

        const updatedHabit = {
          ...habit,
          notification: {
            enabled: true,
            time: formatTime(selectedTime),
          },
        };

        const notificationId = await scheduleHabitNotification(updatedHabit);

        if (notificationId) {
          onUpdate({
            ...updatedHabit,
            notification: {
              ...updatedHabit.notification,
              notificationId,
            },
          });
        }
      } else {
        // Apenas atualizar o horário sem agendar
        onUpdate({
          ...habit,
          notification: {
            ...habit.notification,
            time: formatTime(selectedTime),
          },
        });
      }
    }
  };

  // Formatar horário para exibição
  const formatTime = (date) => {
    return date.toTimeString().split(" ")[0].substring(0, 5);
  };

  if (!hasPermission && !notificationEnabled) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={32}
            color="#ff6b6b"
          />
          <Text style={styles.permissionTitle}>Notificações Desativadas</Text>
          <Text style={styles.permissionText}>
            Ative as notificações para receber lembretes dos seus hábitos.
          </Text>
          <TouchableOpacity
            style={styles.enableButton}
            onPress={checkPermissions}
          >
            <Text style={styles.enableButtonText}>Ativar Notificações</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Lembretes Diários</Text>

      <View style={styles.notificationRow}>
        <View style={styles.notificationInfo}>
          <Ionicons
            name={
              notificationEnabled
                ? "notifications"
                : "notifications-off-outline"
            }
            size={20}
            color={notificationEnabled ? "#4A90E2" : "#666"}
          />
          <View style={styles.notificationText}>
            <Text style={styles.notificationLabel}>
              {notificationEnabled
                ? "Lembretes ativos"
                : "Lembretes desativados"}
            </Text>
            <Text style={styles.notificationDescription}>
              {notificationEnabled
                ? `Receber lembretes às ${formatTime(notificationTime)}`
                : "Ative para não esquecer seus hábitos"}
            </Text>
          </View>
        </View>

        <Switch
          value={notificationEnabled}
          onValueChange={handleNotificationToggle}
          trackColor={{ false: "#f1f1f1", true: "#4A90E2" }}
          thumbColor={notificationEnabled ? "#fff" : "#f4f3f4"}
        />
      </View>

      {notificationEnabled && (
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Horário do lembrete</Text>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color="#4A90E2" />
            <Text style={styles.timeText}>{formatTime(notificationTime)}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={notificationTime}
              mode="time"
              display="spinner"
              onChange={handleTimeChange}
              style={styles.timePicker}
            />
          )}

          <Text style={styles.timeTip}>
            ⏰ Escolha um horário que funcione melhor para você
          </Text>
        </View>
      )}

      {/* Dicas de notificação */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Dicas para Lembretes</Text>

        <View style={styles.tipItem}>
          <Ionicons name="bulb-outline" size={16} color="#4A90E2" />
          <Text style={styles.tipText}>
            Escolha horários consistentes para criar rotina
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb-outline" size={16} color="#4A90E2" />
          <Text style={styles.tipText}>
            Evite horários muito ocupados ou de descanso
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb-outline" size={16} color="#4A90E2" />
          <Text style={styles.tipText}>
            Teste diferentes horários e ajuste conforme necessário
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  notificationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notificationText: {
    marginLeft: 12,
    flex: 1,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 12,
    color: "#666",
  },
  timeSection: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    marginRight: "auto",
    fontWeight: "500",
  },
  timePicker: {
    marginTop: 8,
  },
  timeTip: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
  permissionContainer: {
    alignItems: "center",
    padding: 20,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  enableButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  enableButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tipsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});

export default NotificationManager;
