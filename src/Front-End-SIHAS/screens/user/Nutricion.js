import React, { useState, useEffect, useCallback } from "react";
import { Alert, ActivityIndicator, View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, ScrollView, FlatList, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";
import { AxiosClient } from "../auth/context/http_client";
import NutritionSummary from "../../components/NutritionSummary";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";

export default function NutricionUserScreen() {
  const [activeTab, setActiveTab] = useState("Horarios");
  const [registroForm, setRegistroForm] = useState("horario");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("Desayuno");
  const [selectedAlimentos, setSelectedAlimentos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlimentos, setFilteredAlimentos] = useState([]);
  const [alimentos, setAlimentos] = useState([]);
  const [foodSchedules, setFoodSchedules] = useState([]);
  const [selectedFoodScheduleId, setSelectedFoodScheduleId] = useState("");
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await AxiosClient.get("/api/usuario/alimento/all");
        console.log("Datos que lllegan al cora ", response)
        if (response && response.result && Array.isArray(response.result)) {
          const mappedFoods = response.result.map((item) => ({
            id: item.id_food,
            nombre: item.name,
            quantity: item.quantity,
            calories: item.calories,
            proteins: item.proteins,
            fats: item.fats,
            carbohydrates: item.carbohydrates,
            fiber: item.fiber,
          }));
          setAlimentos(mappedFoods);
          setFilteredAlimentos(mappedFoods.slice(0, displayCount));
        } else {
          Alert.alert("Formato de respuesta inválido: alimentos todos");
        }
      } catch (error) {
        console.error("Fetch foods error:", error.message, error.response || error);
        const message = error.response?.data?.message || error.message || "No se pudieron cargar los alimentos";
        Alert.alert("Error", message);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [displayCount]);

  const fetchFoodSchedules = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        Alert.alert("Error", "Por favor, inicia sesión nuevamente");
        return;
      }
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.userId || parsedUserData.id;
      if (!userId) {
        Alert.alert("Error", "ID de usuario no encontrado");
        return;
      }
      const response = await AxiosClient.get(`/api/usuario/horarioalimento/day/${userId}`);
      if (response && response.type === "SUCCESS" && Array.isArray(response.result)) {
        const formattedSchedules = response.result.map((item) => ({
          id: item.idFoodSchedule,
          date: item.date,
          time: item.time,
          mealType: item.mealType
            ? item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1).toLowerCase()
            : "Horario",
          foods: item.foodFoodSchedules?.map((ffs) => ({
            id: ffs.food.id_food,
            name: ffs.food.name,
            calories: ffs.food.calories,
            proteins: ffs.food.proteins,
            fats: ffs.food.fats,
            carbohydrates: ffs.food.carbohydrates,
            fiber: ffs.food.fiber,
          })) || [],
        }));
        setFoodSchedules(formattedSchedules);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "No se pudieron cargar los horarios";
      console.error("Fetch food schedules error:", JSON.stringify(error.response || error, null, 2));
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFoodSchedules();
    }, [])
  );
  // Debounced search handler for foods
  const handleSearch = useCallback(
    debounce((query) => {
      console.log("Search query:", query);
      const filtered = alimentos
        .filter(
          (item) =>
            !selectedAlimentos.some((s) => s.id === item.id) &&
            item.nombre.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, displayCount);
      console.log("Filtered alimentos:", filtered);
      setFilteredAlimentos(filtered);
    }, 300),
    [alimentos, selectedAlimentos, displayCount]
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, alimentos, selectedAlimentos, displayCount, handleSearch]);

  const addAlimento = (alimento) => {
    setSelectedAlimentos([...selectedAlimentos, alimento]);
  };

  const removeAlimento = (alimento) => {
    setSelectedAlimentos(selectedAlimentos.filter((a) => a.id !== alimento.id));
  };

  const loadMoreItems = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };

  const formatDateForBackend = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return (d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0")
    );
  };

  const formatTimeForBackend = (time) => {
    if (!time) return "";
    const t = time instanceof Date ? time : new Date(time);
    return (
      String(t.getHours()).padStart(2, "0") +
      ":" +
      String(t.getMinutes()).padStart(2, "0") +
      ":" +
      String(t.getSeconds()).padStart(2, "0")
    );
  };

  const handleWebDateChange = (event) => {
    const dateValue = event.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split("-");
      setDate(new Date(Number(year), Number(month) - 1, Number(day)));
    }
  };

  // Handle time input for web
  const handleWebTimeChange = (event) => {
    const timeValue = event.target.value;
    if (timeValue) {
      const [hours, minutes] = timeValue.split(":");
      const newTime = new Date();
      newTime.setHours(hours, minutes);
      setTime(newTime);
    }
  };

  // Submit food schedule or add foods to existing schedule
  const submitFoodSchedule = async (isAddingFoods = false) => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        Alert.alert("Error", "Por favor, inicia sesión nuevamente");
        return;
      }
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.userId || parsedUserData.id;
      console.log("User data:", JSON.stringify(parsedUserData, null, 2));

      if (isAddingFoods) {
        if (!selectedFoodScheduleId) {
          Alert.alert("Error", "Por favor, seleccione un horario existente");
          return;
        }
        if (selectedAlimentos.length === 0) {
          Alert.alert("Error", "Por favor, seleccione al menos un alimento");
          return;
        }

        const foodIds = selectedAlimentos.map((alimento) => alimento.id);
        const payload = {
          foodScheduleId: selectedFoodScheduleId,
          foods: foodIds,
        };
        console.log("Adding foods payload:", JSON.stringify(payload, null, 2));
        const response = await AxiosClient.post("/api/usuario/horarioalimento/add-foods", payload);
        console.log("Add foods response:", JSON.stringify(response.result, null, 2));
        Alert.alert("Éxito", response.text || "Alimentos agregados al horario correctamente");
        await fetchFoodSchedules();
      } else {
        if (!userId) {
          Alert.alert("Error", "ID de usuario no encontrado en los datos de sesión");
          return;
        }
        const formattedDate = formatDateForBackend(date);
        const formattedTime = formatTimeForBackend(time);

        if (!formattedDate) {
          Alert.alert("Error", "Por favor, seleccione una fecha válida");
          return;
        }
        if (!formattedTime) {
          Alert.alert("Error", "Por favor, seleccione una hora válida");
          return;
        }

        const foodIds = selectedAlimentos.map((alimento) => alimento.id);
        const payload = {
          date: formattedDate,
          time: formattedTime,
          user: userId,
          mealType: selectedMealType,
          foods: foodIds,
        };
        console.log("Creating schedule payload:", JSON.stringify(payload, null, 2));
        const response = await AxiosClient.post("/api/usuario/horarioalimento/save", payload);
        console.log("Save schedule response:", JSON.stringify(response.result, null, 2));
        Alert.alert("Éxito", response.text || "Horario de alimento registrado correctamente");
        await fetchFoodSchedules();
      }

      // Reset form
      setDate(new Date());
      setTime(new Date());
      setSelectedAlimentos([]);
      setSearchQuery("");
      setSelectedFoodScheduleId("");
      setRegistroForm("horario");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || "Error al procesar la solicitud";
      console.error("Submit error:", JSON.stringify(error.response || error, null, 2));
      if (status === 404) {
        Alert.alert("Error", "No se encontró el endpoint. Verifique la URL o la configuración del servidor.");
      } else if (status === 401) {
        Alert.alert("Error", "Sesión no autorizada. Por favor, inicia sesión nuevamente.");
      } else if (status === 400) {
        Alert.alert("Error", `Datos inválidos: ${message}`);
      } else {
        Alert.alert("Error", message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format FoodSchedule for Picker display
  const formatFoodScheduleLabel = (schedule) => {
    const mealType = schedule.mealType || "Horario";
    return `${mealType}, ${schedule.date} ${schedule.time}`;
  };

  // Calculate total macronutrients and calories for today
  const calculateDailySummary = () => {
    const today = formatDateForBackend(new Date());
    const todaySchedules = foodSchedules.filter((schedule) => schedule.date === today);

    const summary = todaySchedules.reduce(
      (acc, schedule) => {
        schedule.foods.forEach((food) => {
          acc.calories += food.calories || 0;
          acc.proteins += food.proteins || 0;
          acc.carbohydrates += food.carbohydrates || 0;
          acc.fats += food.fats || 0;
          acc.fiber += food.fiber || 0;
        });
        return acc;
      },
      { calories: 0, proteins: 0, carbohydrates: 0, fats: 0, fiber: 0 }
    );

    return {
      kcal: summary.calories.toFixed(1),
      protein: summary.proteins.toFixed(1),
      carbs: summary.carbohydrates.toFixed(1),
      fat: summary.fats.toFixed(1),
      fiber: summary.fiber.toFixed(1),
    };
  };

  // Calculate macronutrients and calories for a single meal
  const calculateMealSummary = (foods) => {
    const summary = foods.reduce(
      (acc, food) => {
        acc.calories += food.calories || 0;
        acc.proteins += food.proteins || 0;
        acc.carbohydrates += food.carbohydrates || 0;
        acc.fats += food.fats || 0;
        return acc;
      },
      { calories: 0, proteins: 0, carbohydrates: 0, fats: 0 }
    );

    return `Cal: ${summary.calories.toFixed(1)} Pro: ${summary.proteins.toFixed(1)}g Car: ${summary.carbohydrates.toFixed(1)}g Gra: ${summary.fats.toFixed(1)}g`;
  };


  const RegistroForm = () => (
    <>
      <Text style={styles.subtitle}>Registro</Text>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[styles.button, registroForm === "horario" && styles.activeButton]}
          onPress={() => setRegistroForm("horario")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Registrar Horario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, registroForm === "alimento" && styles.activeButton]}
          onPress={() => setRegistroForm("alimento")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Agregar Alimento</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        {registroForm === "horario" ? (
          <>
            <Text>Fecha *</Text>
            {Platform.OS === "web" ? (
              <TextInput
                style={styles.input}
                type="date"
                value={formatDateForBackend(date)}
                onChange={handleWebDateChange}
                disabled={loading}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.input, { pointerEvents: loading ? "none" : "auto" }]}
                  onPress={() => setShowDatePicker(true)}
                  disabled={loading}
                >
                  <Text>{formatDateForBackend(date) || "Seleccione una fecha"}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                )}
              </>
            )}
            <Text>Hora *</Text>
            {Platform.OS === "web" ? (
              <TextInput
                style={styles.input}
                type="time"
                value={formatTimeForBackend(time)}
                onChange={handleWebTimeChange}
                disabled={loading}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.input, { pointerEvents: loading ? "none" : "auto" }]}
                  onPress={() => setShowTimePicker(true)}
                  disabled={loading}
                >
                  <Text>{formatTimeForBackend(time) || "Seleccione una hora"}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) setTime(selectedTime);
                    }}
                  />
                )}
              </>
            )}
            <Text>Tipo de Comida *</Text>
            <Picker
              selectedValue={selectedMealType}
              onValueChange={(itemValue) => setSelectedMealType(itemValue)}
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="Desayuno" value="Desayuno" />
              <Picker.Item label="Comida" value="Comida" />
              <Picker.Item label="Cena" value="Cena" />
            </Picker>
            <Text>Alimentos (Opcional)</Text>
            {selectedAlimentos.length > 0 && (
              <View style={styles.selectedContainer}>
                <Text>Alimentos seleccionados:</Text>
                <FlatList
                  data={selectedAlimentos}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.selectedItem, { pointerEvents: loading ? "none" : "auto" }]}
                      onPress={() => removeAlimento(item)}
                      disabled={loading}
                    >
                      <Text style={styles.selectedText}>{item.nombre}</Text>
                      <Icon name="x" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Buscar alimentos"
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={!loading}
            />
            {filteredAlimentos.length === 0 && !loading && (
              <Text style={styles.noResultsText}>No se encontraron alimentos</Text>
            )}
            {/* El FlatList de alimentos va abajo, fuera del formulario */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { pointerEvents: loading ? "none" : "auto" },
                loading && styles.disabledButton,
              ]}
              onPress={() => submitFoodSchedule(false)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Guardar Horario</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text>Seleccionar Horario Existente *</Text>
            {foodSchedules.length === 0 && !loading && (
              <Text style={styles.noResultsText}>
                No hay horarios registrados. Por favor, crea un horario primero.
              </Text>
            )}
            <Picker
              selectedValue={selectedFoodScheduleId}
              onValueChange={(itemValue) => setSelectedFoodScheduleId(itemValue)}
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="Seleccione un horario" value="" />
              {foodSchedules.map((schedule) => (
                <Picker.Item
                  key={schedule.id}
                  label={formatFoodScheduleLabel(schedule)}
                  value={schedule.id}
                />
              ))}
            </Picker>
            {selectedAlimentos.length > 0 && (
              <View style={styles.selectedContainer}>
                <Text>Alimentos seleccionados:</Text>
                <FlatList
                  data={selectedAlimentos}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.selectedItem, { pointerEvents: loading ? "none" : "auto" }]}
                      onPress={() => removeAlimento(item)}
                      disabled={loading}
                    >
                      <Text style={styles.selectedText}>{item.nombre}</Text>
                      <Icon name="x" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Buscar alimentos"
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={!loading}
            />
            <Text>Seleccionar Alimentos *</Text>
            {filteredAlimentos.length === 0 && !loading && (
              <Text style={styles.noResultsText}>No se encontraron alimentos</Text>
            )}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { pointerEvents: loading ? "none" : "auto" },
                loading && styles.disabledButton,
              ]}
              onPress={() => submitFoodSchedule(true)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Agregar Alimentos</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );

  const renderContent = () => {
    const today = formatDateForBackend(new Date());
    const todaySchedules = foodSchedules.filter((schedule) => schedule.date === today);

    switch (activeTab) {
      case "Resumen":
        return (
          <View style={styles.content}>
            <Text style={styles.subtitle}>Resumen Nutricional Diario</Text>
            <NutritionSummary data={calculateDailySummary()} />
          </View>
        );

      case "Horarios":
        return (
          <View style={styles.content}>
            <Text style={styles.subtitle}>Horarios de Hoy</Text>
            {todaySchedules.length === 0 && !loading ? (
              <View style={styles.summary2}>
                <Icon name="clock" size={230} color="#a5d6a7bd" />
                <Text style={styles.TextH}>Sin comidas para hoy. ¿Qué te gustaría agregar?</Text>
              </View>
            ) : (
              <FlatList
                data={todaySchedules}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.scheduleItem}>
                    <Text style={styles.scheduleText}>
                      {`${item.mealType}, ${item.time}`}
                    </Text>
                    {item.foods.length > 0 ? (
                      <>
                        <Text style={styles.foodList}>
                          Alimentos: {item.foods.map((food) => food.name).join(", ")}
                        </Text>
                        <Text style={styles.nutritionText}>
                          {calculateMealSummary(item.foods)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.noFoodText}>Sin alimentos asignados</Text>
                    )}
                  </View>
                )}
              />
            )}
          </View>
        );

      case "Registro":
        return (
          <View style={styles.content}>
            <FlatList
              data={filteredAlimentos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.alimentoButton, { pointerEvents: loading ? "none" : "auto" }]}
                  onPress={() => addAlimento(item)}
                  disabled={loading}
                >
                  <Text style={styles.alimentoText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              numColumns={2}
              ListHeaderComponent={<RegistroForm />}
              ListFooterComponent={
                filteredAlimentos.length < alimentos.length && (
                  <TouchableOpacity
                    style={[styles.loadMoreButton, { pointerEvents: loading ? "none" : "auto" }]}
                    onPress={loadMoreItems}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Cargar Más</Text>
                  </TouchableOpacity>
                )
              }
              contentContainerStyle={{ paddingBottom: 40 }}
              ListEmptyComponent={
                !loading && (
                  <Text style={styles.noResultsText}>No se encontraron alimentos</Text>
                )
              }
            />
          </View>
        );

      default:
        return <View style={styles.content}><Text>No content available</Text></View>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === "Resumen" && styles.activeTab, { pointerEvents: loading ? "none" : "auto" }]}
          onPress={() => setActiveTab("Resumen")}
          disabled={loading}
        >
          <Icon name="bar-chart-2" size={20} color="#333" />
          <Text style={styles.tabText}>Resumen</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "Horarios" && styles.activeTab, { pointerEvents: loading ? "none" : "auto" }]}
          onPress={() => setActiveTab("Horarios")}
          disabled={loading}
        >
          <Icon name="clock" size={20} color="#333" />
          <Text style={styles.tabText}>Horarios</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "Registro" && styles.activeTab, { pointerEvents: loading ? "none" : "auto" }]}
          onPress={() => setActiveTab("Registro")}
          disabled={loading}
        >
          <Icon name="edit-3" size={20} color="#333" />
          <Text style={styles.tabText}>Registro</Text>
        </Pressable>
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text>Cargando datos...</Text>
        </View>
      )}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#fff",
  },
  tab: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#a5d6a787",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  summary2: {
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  scheduleItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  foodList: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  noFoodText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  nutritionText: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
    fontWeight: "500",
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#449a4799",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#4CAF50",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  loadMoreButton: {
    backgroundColor: "#449a4799",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  formContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedContainer: {
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 20,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedText: {
    color: "#fff",
    marginRight: 5,
    fontSize: 14,
  },
  alimentoButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    flex: 1,
    alignItems: "center",
  },
  alimentoText: {
    color: "#333",
    fontSize: 14,
  },
  noResultsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 10,
    fontSize: 14,
  },
  TextH: {
    color: "#a5d6a7bd",
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});