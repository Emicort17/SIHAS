import React, { useState, useCallback } from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Modal, Alert, SafeAreaView } from "react-native";
import { useAuth } from "../../screens/auth/context/AuthContext";
import { AxiosClient } from "../../screens/auth/context/http_client";
import { useFocusEffect } from "@react-navigation/native";
import Sun from "../../assets/icons/sun.svg";
import Bed from "../../assets/icons/bed.svg";

const TimePicker = ({ value, onTimeChange, onClose }) => {
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return { hour: displayHour, minute: minutes, period };
  };

  const { hour: initialHour, minute: initialMinute, period: initialPeriod } = parseTime(value);

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  const handleConfirm = () => {
    let hour24 = selectedHour;
    if (selectedPeriod === "AM" && selectedHour === 12) {
      hour24 = 0;
    } else if (selectedPeriod === "PM" && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    }
    const formattedTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;
    onTimeChange(formattedTime);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}>
        <View style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 24,
          width: "90%",
          maxWidth: 320,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 24,
            color: "#1f2937",
          }}>
            Seleccionar Hora
          </Text>
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}>
            {/* Hour Picker */}
            <View style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>Hora</Text>
              <ScrollView style={{ height: 120, width: 60 }} showsVerticalScrollIndicator={false}>
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={`hour-${hour}`}
                    style={{
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor: selectedHour === hour ? "#dbeafe" : "transparent",
                      borderRadius: 8,
                    }}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text style={{
                      fontSize: 18,
                      color: selectedHour === hour ? "#2563eb" : "#374151",
                      fontWeight: selectedHour === hour ? "600" : "400",
                    }}>
                      {hour}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginHorizontal: 8 }}>:</Text>
            {/* Minute Picker */}
            <View style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>Min</Text>
              <ScrollView style={{ height: 120, width: 60 }} showsVerticalScrollIndicator={false}>
                {minutes.filter((m) => m % 5 === 0).map((minute) => (
                  <TouchableOpacity
                    key={`minute-${minute}`}
                    style={{
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor: selectedMinute === minute ? "#dbeafe" : "transparent",
                      borderRadius: 8,
                    }}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text style={{
                      fontSize: 18,
                      color: selectedMinute === minute ? "#2563eb" : "#374151",
                      fontWeight: selectedMinute === minute ? "600" : "400",
                    }}>
                      {minute.toString().padStart(2, "0")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>Período</Text>
              <ScrollView style={{ height: 120, width: 60 }} showsVerticalScrollIndicator={false}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={`period-${period}`}
                    style={{
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor: selectedPeriod === period ? "#dbeafe" : "transparent",
                      borderRadius: 8,
                    }}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text style={{
                      fontSize: 18,
                      color: selectedPeriod === period ? "#2563eb" : "#374151",
                      fontWeight: selectedPeriod === period ? "600" : "400",
                    }}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#f3f4f6",
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
              onPress={onClose}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#6b7280" }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#3b82f6",
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
              onPress={handleConfirm}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function SleepUserScreen() {
  const [sleepEntries, setSleepEntries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const [bedtime, setBedtime] = useState("22:45");
  const [wakeTime, setWakeTime] = useState("06:00");
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);

  const formatTime12Hour = (time24) => {
    if (!time24) return "--:--";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const calculateSleepDuration = () => {
    const [bedHours, bedMinutes] = bedtime.split(":").map(Number);
    const [wakeHours, wakeMinutes] = wakeTime.split(":").map(Number);
    const bedTimeInMinutes = bedHours * 60 + bedMinutes;
    let wakeTimeInMinutes = wakeHours * 60 + wakeMinutes;
    if (wakeTimeInMinutes < bedTimeInMinutes) wakeTimeInMinutes += 24 * 60;
    const durationInMinutes = wakeTimeInMinutes - bedTimeInMinutes;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const parseDurationToDouble = (durationStr) => {
    const match = durationStr.match(/(\d+)h\s+(\d+)min/);
    if (!match) return 0;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    return hours + minutes / 60;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchSleeps = async () => {
    try {
      const response = await AxiosClient.get(`/api/usuario/horario/dormir/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSleepEntries(response.result);
    } catch (err) {
      Alert.alert("Error", "No se pudieron cargar los horarios");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSleeps();
    }, [])
  );

  const handleSave = async (startTime, endTime) => {
    const durationStr = calculateSleepDuration();
    const totalHours = parseDurationToDouble(durationStr);
    const payload = {
      date: getCurrentDate(),
      startTime,
      endTime,
      totalHours,
      user: user?.userId,
    };
    const today = getCurrentDate();
    const alreadyExists = sleepEntries.some((sleep) => sleep.date === today);
    if (alreadyExists) {
      Alert.alert(
        "Atención",
        "Ya has registrado tu horario para hoy ⏰",
        [{ text: "OK", onPress: () => setModalVisible(false) }]
      );
      return;
    }
    try {
      const response = await AxiosClient.post("/api/usuario/horario/dormir/save", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.type === "SUCCESS") {
        Alert.alert("Éxito", "Se registró tu hora con éxito");
      }
      fetchSleeps();
    } catch (error) {
      Alert.alert("ERROR", "No se registró tu hora con éxito");
    }
    setModalVisible(false);
  };

  const today = getCurrentDate();
  const todaySleep = sleepEntries.find((entry) => entry.date === today);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Card principal */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Bed width={28} height={28} />
            <Text style={styles.cardTitle}>Resumen de sueño diario</Text>
          </View>
          <Text style={styles.sleepHours}>
            {todaySleep ? `${todaySleep.totalHours}h` : "--"}
            <Text style={styles.sleepMinutes}>
              {todaySleep && todaySleep.totalHours % 1 !== 0
                ? ` ${Math.round((todaySleep.totalHours % 1) * 60)}min`
                : ""}
            </Text>
          </Text>
          <Text style={styles.cardDesc}>Dormiste anoche</Text>
          <View style={styles.sleepRow}>
            <View style={styles.sleepCol}>
              <Bed width={24} height={24} />
              <Text style={styles.timeText}>
                {todaySleep ? formatTime12Hour(todaySleep.startTime) : "--:--"}
              </Text>
              <Text style={styles.label}>Te dormiste</Text>
            </View>
            <View style={styles.sleepCol}>
              <Sun width={24} height={24} />
              <Text style={styles.timeText}>
                {todaySleep ? formatTime12Hour(todaySleep.endTime) : "--:--"}
              </Text>
              <Text style={styles.label}>Te despertaste</Text>
            </View>
          </View>
        </View>

        {/* Historial */}
        {sleepEntries.length > 0 &&
          sleepEntries
            .filter((entry) => entry.date !== today)
            .map((entry) => (
              <View key={entry.idSleep} style={styles.cardSmall}>
                <View style={styles.rowBetween}>
                  <Text style={styles.dateText}>
                    {entry.date.split("-").reverse().join("/")}
                  </Text>
                  <Text style={styles.durationText}>
                    {entry.totalHours}h
                    {entry.totalHours % 1 !== 0
                      ? ` ${Math.round((entry.totalHours % 1) * 60)}min`
                      : ""}
                  </Text>
                </View>
                <View style={styles.sleepRow}>
                  <View style={styles.sleepCol}>
                    <Bed width={20} height={20} />
                    <Text style={styles.timeTextSmall}>{formatTime12Hour(entry.startTime)}</Text>
                    <Text style={styles.labelSmall}>Te dormiste</Text>
                  </View>
                  <View style={styles.sleepCol}>
                    <Sun width={20} height={20} />
                    <Text style={styles.timeTextSmall}>{formatTime12Hour(entry.endTime)}</Text>
                    <Text style={styles.labelSmall}>Te despertaste</Text>
                  </View>
                </View>
              </View>
            ))}

        <TouchableOpacity style={styles.buttonCorner} onPress={() => setModalVisible(true)}>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para registrar horario */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Bed width={24} height={24} />
              <Text style={styles.modalTitle}>Selecciona un horario de sueño</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.modalLabel}>De</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowBedtimePicker(true)}
              >
                <Text style={styles.timePickerText}>{formatTime12Hour(bedtime)}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 32 }}>
              <Text style={styles.modalLabel}>A</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowWakeTimePicker(true)}
              >
                <Text style={styles.timePickerText}>{formatTime12Hour(wakeTime)}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSave(bedtime, wakeTime)}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showBedtimePicker && (
        <TimePicker
          key="bedtime-picker"
          value={bedtime}
          onTimeChange={(newTime) => {
            setBedtime(newTime);
            setShowBedtimePicker(false);
          }}
          onClose={() => setShowBedtimePicker(false)}
        />
      )}
      {showWakeTimePicker && (
        <TimePicker
          key="waketime-picker"
          value={wakeTime}
          onTimeChange={(newTime) => {
            setWakeTime(newTime);
            setShowWakeTimePicker(false);
          }}
          onClose={() => setShowWakeTimePicker(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#f5f5f5",
    minHeight: "100%",
    alignItems: "center",
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    marginBottom: 18,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C7AE0",
    marginLeft: 10,
  },
  sleepHours: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    textAlign: "center",
  },
  sleepMinutes: {
    fontSize: 18,
    color: "#111827",
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 15,
    color: "#888",
    marginBottom: 10,
  },
  sleepRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 4,
  },
  sleepCol: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  cardSmall: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  durationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6C7AE0",
  },
  timeTextSmall: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },
  labelSmall: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 1,
  },
  buttonCorner: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalBody: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 12,
    flex: 1,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
  },
  timePickerText: {
    fontSize: 16,
    color: "#111827",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#86efac",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#166534",
  },
});