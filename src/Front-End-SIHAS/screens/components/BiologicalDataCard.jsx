import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Icon } from "@rneui/base";
import { AxiosClient } from "../auth/context/http_client";

export default function BiologicalDataCard({
  onSave,
  token,
  userId,
  setIsInactive,
  fetchProfileData,
}) {
  const [data, setData] = useState({
    edad: "",
    peso: "",
    altura: "",
  });

  const [errors, setErrors] = useState({
    edad: "",
    peso: "",
    altura: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let errorMessage = "";
    const numValue = parseFloat(value);

    switch (field) {
      case "edad":
        if (!value.trim()) {
          errorMessage = "Edad obligatoria.";
        } else if (isNaN(numValue) || numValue < 1 || numValue > 120) {
          errorMessage = "Edad inválida. Favor de ingresar una edad válida.";
        }
        break;
      case "peso":
        if (!value.trim()) {
          errorMessage = "Peso obligatorio.";
        } else if (isNaN(numValue) || numValue < 30 || numValue > 300) {
          errorMessage = "Peso inválido. Favor de ingresar un peso válido.";
        }
        break;
      case "altura":
        if (!value.trim()) {
          errorMessage = "Altura obligatoria.";
        } else if (isNaN(numValue) || numValue < 1.0 || numValue > 2.5) {
          errorMessage =
            "Altura inválida. Favor de ingresar una altura válida.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  const isFormValid = () => {
    return (
      !errors.edad &&
      !errors.peso &&
      !errors.altura &&
      data.edad.trim() &&
      data.peso.trim() &&
      data.altura.trim()
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Error", "Por favor completa todos los campos correctamente");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Token de autorización no encontrado");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "ID de usuario no encontrado");
      return;
    }

    setIsLoading(true);

    try {
      const pesoNum = parseFloat(data.peso);
      const alturaNum = parseFloat(data.altura);
      const edadNum = parseInt(data.edad);
      const bmi = parseFloat((pesoNum / (alturaNum * alturaNum)).toFixed(2));
      const fatPercentage = 1;

      const biologicalDataDto = {
        date: new Date().toISOString().split("T")[0],
        weight: pesoNum,
        height: alturaNum,
        age: edadNum,
        bmi: bmi,
        fatPercentage: fatPercentage,
        user: userId,
      };

      console.log("bio: ", biologicalDataDto);

      const response = await AxiosClient.post(
        "/api/usuario/datosbiologicos/save",
        biologicalDataDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resData = response.result;
      console.log("Respuesta del servidor:", resData);

      if (response.type == "SUCCESS") {
        await AxiosClient.put(
          `/api/usuario/status/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsInactive(false);
      Alert.alert("Éxito", "Datos biológicos guardados correctamente");

      setData({
        edad: "",
        peso: "",
        altura: "",
      });
      setErrors({
        edad: "",
        peso: "",
        altura: "",
      });

      if (onSave) {
        // CORRECCIÓN: Verificar que resData y result existan
        const result = resData?.result || resData; // Fallback si la estructura es diferente

        if (result && result.weight !== undefined) {
          const formattedData = {
            peso: result.weight.toString(),
            altura: result.height.toString(),
            imc: result.bmi.toString(),
            weight: result.weight,
            height: result.height,
            bmi: result.bmi,
            age: result.age,
            idData: result.idData,
            fatPercentage: result.fatPercentage,
            date: result.date,
          };
          onSave(formattedData);
        } else {
          console.warn(
            "La respuesta del servidor no tiene la estructura esperada:",
            resData
          );
          // Opcional: llamar onSave con null o datos por defecto
          onSave(null);
        }
      }

      if (fetchProfileData) {
        await fetchProfileData();
      }
    } catch (error) {
      console.log("Error al guardar datos biológicos:", error);

      let errorMessage = "Error desconocido al guardar los datos";

      if (error.response) {
        const status = error.response.status;
        const serverMessage =
          error.response.data?.message || error.response.data?.text;

        if (status >= 400 && status < 500) {
          errorMessage = serverMessage || "Error en los datos enviados";
        } else if (status >= 500) {
          errorMessage = "Error interno del servidor";
        }
      } else if (error.request) {
        errorMessage =
          "No se puede conectar al servidor. Verifica tu conexión a internet.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.containerCard}>
      <View style={styles.header}>
        <Icon
          name="pulse"
          type="material-community"
          color="#3B82F6"
          size={30}
        />
        <Text style={styles.title}>Datos biológicos</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text>Edad</Text>
          <TextInput
            placeholder="Edad"
            style={styles.input}
            value={data.edad}
            onChangeText={(text) => handleChange("edad", text)}
            keyboardType="numeric"
            editable={!isLoading}
          />
          {errors.edad && <Text style={styles.error}>{errors.edad}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text>Peso</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Peso"
              style={[styles.input, { flex: 1 }]}
              value={data.peso}
              onChangeText={(text) => handleChange("peso", text)}
              keyboardType="numeric"
              editable={!isLoading}
            />
            <Text style={styles.unit}>Kg</Text>
          </View>
          {errors.peso && <Text style={styles.error}>{errors.peso}</Text>}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text>Altura</Text>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Altura"
            style={[styles.input, { flex: 1 }]}
            value={data.altura}
            onChangeText={(text) => handleChange("altura", text)}
            keyboardType="numeric"
            editable={!isLoading}
          />
          <Text style={styles.unit}>Mts</Text>
        </View>
        {errors.altura && <Text style={styles.error}>{errors.altura}</Text>}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            opacity: isFormValid() && !isLoading ? 1 : 0.6,
            backgroundColor: isLoading ? "#ccc" : "#D1F0D1",
          },
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid() || isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Guardando..." : "Hecho"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    gap: 20,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F6FA",
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 40,
  },
  input: {
    backgroundColor: "#F3F6FA",
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  unit: {
    color: "#777",
    paddingHorizontal: 10,
  },
  error: {
    fontSize: 12,
    color: "red",
  },
  button: {
    backgroundColor: "#D1F0D1",
    borderRadius: 8,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
});
