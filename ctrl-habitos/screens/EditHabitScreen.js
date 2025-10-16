import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Import do nosso sistema de storage
import { updateHabit, deleteHabit } from "../utils/storage";

const EditHabitScreen = ({ navigation, route }) => {
  const { habit } = route.params;

  const [habitName, setHabitName] = useState(habit.name || "");
  const [frequency, setFrequency] = useState(habit.frequency || "daily");
  const [timesPerWeek, setTimesPerWeek] = useState(
    habit.timesPerWeek?.toString() || "3"
  );
  const [targetDays, setTargetDays] = useState(
    habit.targetDays?.toString() || "5"
  );
  const [notificationEnabled, setNotificationEnabled] = useState(
    habit.notification?.enabled || false
  );
  const [notificationTime, setNotificationTime] = useState(
    getTimeFromString(habit.notification?.time)
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Converter string de tempo para Date
  function getTimeFromString(timeString) {
    if (!timeString) return new Date();

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  }

  // Frequências disponíveis
  const frequencyOptions = [
    {
      value: "daily",
      label: "Todos os dias",
      description: "Realizar diariamente",
    },
    {
      value: "weekly",
      label: "Vezes por semana",
      description: "Definir frequência semanal",
    },
  ];

  // Números de vezes por semana
  const weekOptions = ["1", "2", "3", "4", "5", "6", "7"];

  // Metas de dias
  const targetOptions = ["1", "2", "3", "4", "5", "6", "7"];

  // Validar formulário
  const validateForm = () => {
    if (!habitName.trim()) {
      Alert.alert("Atenção", "Por favor, informe o nome do hábito");
      return false;
    }

    if (frequency === "weekly") {
      const times = parseInt(timesPerWeek);
      if (times < 1 || times > 7) {
        Alert.alert(
          "Atenção",
          "Selecione um número válido de vezes por semana"
        );
        return false;
      }
    }

    return true;
  };

  // Salvar alterações do hábito
  const handleSaveHabit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const updatedHabit = {
        name: habitName.trim(),
        frequency: frequency,
        timesPerWeek: frequency === "weekly" ? parseInt(timesPerWeek) : 7,
        targetDays: parseInt(targetDays),
        notification: {
          enabled: notificationEnabled,
          time: notificationEnabled
            ? notificationTime.toTimeString().split(" ")[0].substring(0, 5)
            : null,
        },
      };

      const success = await updateHabit(habit.id, updatedHabit);

      if (success) {
        Alert.alert("Sucesso!", "Hábito atualizado com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]);
      } else {
        throw new Error("Falha ao atualizar hábito");
      }
    } catch (error) {
      console.error("Erro ao atualizar hábito:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o hábito. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir hábito
  const handleDeleteHabit = () => {
    Alert.alert(
      "Excluir Hábito",
      `Tem certeza que deseja excluir "${habit.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const success = await deleteHabit(habit.id);
              if (success) {
                Alert.alert("Hábito Excluído", "Hábito excluído com sucesso!", [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate("Home"),
                  },
                ]);
              } else {
                throw new Error("Falha ao excluir hábito");
              }
            } catch (error) {
              console.error("Erro ao excluir hábito:", error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir o hábito. Tente novamente."
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  // Manipular mudança de horário
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setNotificationTime(selectedTime);
    }
  };

  // Formatar horário para exibição
  const formatTime = (date) => {
    return date.toTimeString().split(" ")[0].substring(0, 5);
  };

  // Verificar se houve mudanças
  const hasChanges = () => {
    return (
      habitName !== habit.name ||
      frequency !== habit.frequency ||
      timesPerWeek !== habit.timesPerWeek?.toString() ||
      targetDays !== habit.targetDays?.toString() ||
      notificationEnabled !== habit.notification?.enabled ||
      (notificationEnabled &&
        formatTime(notificationTime) !== habit.notification?.time)
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho com informações do hábito */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editando Hábito</Text>
        <Text style={styles.headerSubtitle}>
          Faça as alterações necessárias
        </Text>
      </View>

      {/* Nome do Hábito */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nome do Hábito</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: Beber água, Meditar, Exercícios..."
          value={habitName}
          onChangeText={setHabitName}
          maxLength={50}
          autoFocus
        />
        <Text style={styles.charCount}>{habitName.length}/50</Text>
      </View>

      {/* Frequência */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequência</Text>
        <Text style={styles.sectionSubtitle}>
          Com que frequência você quer praticar este hábito?
        </Text>

        {frequencyOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              frequency === option.value && styles.optionCardSelected,
            ]}
            onPress={() => setFrequency(option.value)}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionLeft}>
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radio,
                      frequency === option.value && styles.radioSelected,
                    ]}
                  />
                </View>
                <View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
              </View>
              {frequency === option.value && (
                <Ionicons name="checkmark-circle" size={24} color="#4A90E2" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vezes por Semana (se frequência for weekly) */}
      {frequency === "weekly" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vezes por Semana</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.pillContainer}>
              {weekOptions.map((times) => (
                <TouchableOpacity
                  key={times}
                  style={[
                    styles.pill,
                    timesPerWeek === times && styles.pillSelected,
                  ]}
                  onPress={() => setTimesPerWeek(times)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      timesPerWeek === times && styles.pillTextSelected,
                    ]}
                  >
                    {times} {times === "1" ? "vez" : "vezes"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Meta Semanal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meta Semanal</Text>
        <Text style={styles.sectionSubtitle}>
          Quantos dias na semana você pretende cumprir este hábito?
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.pillContainer}>
            {targetOptions.map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.pill,
                  targetDays === days && styles.pillSelected,
                ]}
                onPress={() => setTargetDays(days)}
              >
                <Text
                  style={[
                    styles.pillText,
                    targetDays === days && styles.pillTextSelected,
                  ]}
                >
                  {days} {days === "1" ? "dia" : "dias"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Notificações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lembretes</Text>
        <View style={styles.notificationRow}>
          <View style={styles.notificationLeft}>
            <Ionicons name="notifications-outline" size={20} color="#666" />
            <View style={styles.notificationText}>
              <Text style={styles.notificationLabel}>Ativar lembretes</Text>
              <Text style={styles.notificationDescription}>
                Receber notificações para não esquecer
              </Text>
            </View>
          </View>
          <Switch
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
            trackColor={{ false: "#f1f1f1", true: "#4A90E2" }}
            thumbColor={notificationEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>

        {notificationEnabled && (
          <View style={styles.timePickerContainer}>
            <Text style={styles.timeLabel}>Horário do lembrete</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#4A90E2" />
              <Text style={styles.timeText}>
                {formatTime(notificationTime)}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={notificationTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onTimeChange}
                style={styles.timePicker}
              />
            )}
          </View>
        )}
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteHabit}
          disabled={isSubmitting || isDeleting}
        >
          {isDeleting ? (
            <Text style={styles.deleteButtonText}>Excluindo...</Text>
          ) : (
            <>
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.deleteButtonText}> Excluir</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting || isDeleting}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            (!habitName.trim() || isSubmitting || !hasChanges()) &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSaveHabit}
          disabled={!habitName.trim() || isSubmitting || !hasChanges()}
        >
          {isSubmitting ? (
            <Text style={styles.saveButtonText}>Salvando...</Text>
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Informações de criação */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Informações do Hábito</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Criado em:</Text>
          <Text style={styles.infoValue}>
            {new Date(habit.createdAt).toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID:</Text>
          <Text style={styles.infoValue}>{habit.id}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  optionCardSelected: {
    borderColor: "#4A90E2",
    backgroundColor: "#f0f7ff",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radio: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioSelected: {
    backgroundColor: "#4A90E2",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: "#666",
  },
  pillContainer: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  pillSelected: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  pillText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  pillTextSelected: {
    color: "#fff",
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notificationText: {
    marginLeft: 12,
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
  timePickerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
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
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  },
  timePicker: {
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    flex: 0.7,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    flex: 1,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
  },
});

export default EditHabitScreen;
