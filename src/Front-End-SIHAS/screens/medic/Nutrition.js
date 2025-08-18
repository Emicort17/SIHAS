import React, { useState } from "react";
import NutritionSummary from "../../components/NutritionSummary";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";

export default function NutritionAdminScreen() {
  const [activeTab, setActiveTab] = useState("Horarios");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mealType, setMealType] = useState("Desayuno");

  const renderContent = () => {
    switch (activeTab) {
      case "Resumen":
        return (
          <View style={styles.content}>
            <Text style={styles.subtitle}>Resumen Nutricional Diario</Text>
            <NutritionSummary data={{ kcal: 440, protein: 19.3, carbs: 69, fat: 11.8, fiber: 5.2 }} />
            <Text style={styles.timestamp}>Desayuno</Text>
          </View>
        );
      case "Horarios":
        return (
          <View style={styles.content}>
            <View style={styles.summary2}>
              <Icon name="clock" size={230} color="#a5d6a7bd" />
              <Text style={styles.TextH}>Sin comidas por ahora. ¿Qué te gustaría agregar hoy?</Text>
            </View>
          </View>
        );
      case "Registro":
        return (
          <View style={styles.content}>
            <View style={styles.summary}>
              <Text style={styles.subtitle}>Configurar Horario de Comida</Text>
              <Text>Fecha *</Text>
              <TextInput style={styles.input} placeholder="Fecha (dd/mm/aaaa)" value={date} onChangeText={setDate} />
              <Text>Hora *</Text>
              <TextInput style={styles.input} placeholder="Hora (hh:mm)" value={time} onChangeText={setTime} />
              <Text>Tipo de comida *</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={mealType} style={styles.picker} onValueChange={(itemValue) => setMealType(itemValue)}>
                  <Picker.Item label="Desayuno" value="Desayuno" />
                  <Picker.Item label="Almuerzo" value="Almuerzo" />
                  <Picker.Item label="Cena" value="Cena" />
                </Picker>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Guardar Horario</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrición</Text>
      <View style={styles.tabs}>
        <Pressable style={[styles.tab, activeTab === "Resumen" && styles.activeTab]} onPress={() => setActiveTab("Resumen")}>
          <Icon name="bar-chart-2" size={20} />
          <Text>Resumen</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === "Horarios" && styles.activeTab]} onPress={() => setActiveTab("Horarios")}>
          <Icon name="clock" size={20} />
          <Text>Horarios</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === "Registro" && styles.activeTab]} onPress={() => setActiveTab("Registro")}>
          <Icon name="edit-3" size={20} />
          <Text>Registro</Text>
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }}>{renderContent()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  tabs: { flexDirection: "row", justifyContent: "space-around", borderRadius: 10, marginBottom: 10, padding: 5 },
  tab: { borderRadius: 10, borderWidth: 1, borderColor: "#ccc", alignItems: "center", padding: 20, boxShadow: "0 4px 5px rgba(0, 0, 0, 0.328)" },
  activeTab: { color: "#4CAF50", backgroundColor: "#a5d6a787", borderRadius: 10, fontWeight: "bold" },
  content: { padding: 16 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  summary: { boxShadow: "0 4px 5px rgba(0, 0, 0, 0.328)", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
  summary2: { alignItems: "center", boxShadow: "0 4px 5px rgba(0, 0, 0, 0.328)", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10, color: "#a5d6a7bd", textAlign: "center", paddingBottom: 30 },
  timestamp: { marginTop: 10, color: "#888", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 10 },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10, overflow: "hidden" },
  picker: { height: 50, width: "100%" },
  button: { backgroundColor: "#449a4799", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 5, marginBottom: 5 },
  TextH: { color: "#a5d6a7bd", textAlign: "center", marginTop: 10, fontSize: 13 },
  buttonText: { color: "#fff", fontWeight: "bold" }
});