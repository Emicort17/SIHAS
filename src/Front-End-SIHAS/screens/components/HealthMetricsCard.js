import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import PluseDIcon from "../../assets/icons/pluse-d.svg";
import EditDIcon from "../../assets/icons/edit-d.svg";
import CloseDIcon from "../../assets/icons/close-d.svg";
import { AxiosClient } from "../auth/context/http_client";

export default function HealthMetricsCard({ token, userId, biologicalData, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [metrics, setMetrics] = useState({
    peso: "",
    altura: "",
    imc: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (biologicalData) {
      setMetrics({
        peso: biologicalData.peso?.toString() || biologicalData.weight?.toString() || "",
        altura: biologicalData.altura?.toString() || biologicalData.height?.toString() || "",
        imc: biologicalData.imc?.toString() || biologicalData.bmi?.toString() || "",
      });
    }
  }, [biologicalData]);

  const handleChange = (field, value) => {
    setMetrics({ ...metrics, [field]: value });

    let error = "";
    const numValue = parseFloat(value);
    if (field === "peso") {
      if (!value.trim()) error = "Peso obligatorio";
      else if (isNaN(numValue) || numValue < 30 || numValue > 300)
        error = "Peso inválido (30-300 kg)";
    } else if (field === "altura") {
      if (!value.trim()) error = "Altura obligatoria";
      else if (isNaN(numValue) || numValue < 1.0 || numValue > 2.5)
        error = "Altura inválida (1.0-2.5 m)";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateFields = () => {
    const pesoNum = parseFloat(metrics.peso);
    const alturaNum = parseFloat(metrics.altura);
    const newErrors = {};

    if (!metrics.peso || isNaN(pesoNum) || pesoNum < 30 || pesoNum > 300)
      newErrors.peso = "Peso inválido (30-300 kg)";
    if (!metrics.altura || isNaN(alturaNum) || alturaNum < 1.0 || alturaNum > 2.5)
      newErrors.altura = "Altura inválida (1.0-2.5 m)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calcularIMC = async () => {
    if (!validateFields()) return;

    const peso = parseFloat(metrics.peso);
    const altura = parseFloat(metrics.altura);
    const imc = peso / (altura * altura);

    if (imc < 10 || imc > 60) {
      setErrors({ imc: "IMC fuera de rango realista" });
      return;
    }

    const newMetrics = { ...metrics, imc: imc.toFixed(1) };
    setMetrics(newMetrics);

    setIsLoading(true);

    try {
      const updateData = {
        idData: biologicalData?.idData,
        weight: peso,
        height: altura,
        bmi: parseFloat(imc.toFixed(1)),
        age: biologicalData?.age || 0,
        date: new Date().toISOString(),
        fatPercentage: biologicalData?.fatPercentage || 1,
        user: userId,
      };
      console.log("Datos a enviar: ", updateData, token);

      const response = await AxiosClient.put(`/api/usuario/datosbiologicos/update`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("respuesta", response)

      Alert.alert("Éxito", "Datos biológicos actualizados correctamente");
      setEditing(false);
      onUpdate?.({
        ...updateData,
        peso: peso.toString(),
        altura: altura.toString(),
        imc: imc.toFixed(1),
        shouldRefetch: true,
      });

    } catch (error) {
      Alert.alert("Error", "Los datos biológicos no se pudieron actualizar");
      console.log("Error al actualizar métricas:", error);
      setErrors({ imc: `Error al guardar: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (biologicalData) {
      setMetrics({
        peso: biologicalData.peso?.toString() || biologicalData.weight?.toString() || "",
        altura: biologicalData.altura?.toString() || biologicalData.height?.toString() || "",
        imc: biologicalData.imc?.toString() || biologicalData.bmi?.toString() || "",
      });
    }
    setErrors({});
  };

  return (
    <View style={styles.containerCard}>
      <View style={styles.ContainerHead}>
        <View style={styles.leftContent}>
          <PluseDIcon width={24} height={24} />
          <Text style={[styles.title, { marginLeft: 10 }]}>Métricas de Salud</Text>
        </View>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          {editing ? <CloseDIcon width={24} height={24} />
            : <EditDIcon width={24} height={24} />
          }
        </TouchableOpacity>
      </View>

      {editing ? (
        <>
          <Text style={styles.label}>Altura (m):</Text>
          <TextInput
            style={styles.input}
            value={metrics.altura}
            onChangeText={(text) => handleChange("altura", text)}
            keyboardType="decimal-pad"
            placeholder="Ej: 1.75"
            editable={!isLoading}
          />
          {errors.altura && <Text style={styles.errorText}>{errors.altura}</Text>}

          <Text style={styles.label}>Peso (kg):</Text>
          <TextInput
            style={styles.input}
            value={metrics.peso}
            onChangeText={(text) => handleChange("peso", text)}
            keyboardType="decimal-pad"
            placeholder="Ej: 70.5"
            editable={!isLoading}
          />
          {errors.peso && <Text style={styles.errorText}>{errors.peso}</Text>}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.buttonCancel,
                { opacity: isLoading ? 0.6 : 1, backgroundColor: isLoading ? "#ccc" : "#EBECF0" }
              ]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { opacity: isLoading ? 0.6 : 1, backgroundColor: isLoading ? "#ccc" : "#C8E6C9" }
              ]}
              onPress={calcularIMC}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Guardando..." : "Calcular IMC"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.imcResultado}>IMC: {metrics.imc || "—"}</Text>
          {errors.imc && <Text style={styles.errorText}>{errors.imc}</Text>}
        </>
      ) : (
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.peso || "—"}</Text>
            <Text style={styles.metricLabel}>Kg</Text>
            <Text style={styles.metricLabel2}>(Kilogramos)</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.altura || "—"}</Text>
            <Text style={styles.metricLabel}>Mts</Text>
            <Text style={styles.metricLabel2}>(Metros)</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.imc || "—"}</Text>
            <Text style={styles.metricLabel}>IMC</Text>
            <Text style={styles.metricLabel2}>(Índice de Masa Corporal)</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ContainerHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    height: 45,
    width: "100%",
    backgroundColor: "#F0F4F8",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    width: "45%",
    height: 45,
    backgroundColor: "#C8E6C9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCancel: {
    width: "45%",
    height: 45,
    backgroundColor: "#EBECF0",
    borderColor: "#DDDDDD",
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#424242",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextCancel: {
    color: "#8C8C8C",
    fontSize: 16,
    fontWeight: "600",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "700",
  },
  metricLabel2: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  imcResultado: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },
  loadingContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});