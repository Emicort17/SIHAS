import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "@rneui/base";

export default function HealthMetricsCard({ data }) {
  const [editing, setEditing] = useState(false);
  const [metrics, setMetrics] = useState(data);
  const [imcError, setImcError] = useState("");
  const [errors, setErrors] = useState({
    peso: "",
    altura: "",
  });

  const handleChange = (dato, value) => {
    setMetrics({ ...metrics, [dato]: value });
    let errorMessage = "";
    switch (dato) {
      case "peso":
        const pesoNum = parseFloat(value);
        if (!value.trim()) {
          errorMessage = "Peso obligatorio";
        } else if (isNaN(pesoNum) || pesoNum < 30 || pesoNum > 300) {
          errorMessage = "Peso inválido. Favor de ingresar un peso valido.";
        }
        break;

      case "altura":
        const alturaNum = parseFloat(value);
        if (!value.trim()) {
          errorMessage = "Altura obligatoria";
        } else if (isNaN(alturaNum) || alturaNum < 1.0 || alturaNum > 2.50) {
          errorMessage =
            "Altura inválida. Favor de ingresar una altura valida.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [dato]: errorMessage }));
  };

  const validateFields = () => {
    let valid = true;
    let newErrors = {};

    const pesoNum = parseFloat(metrics.peso);
    if (!metrics.peso || isNaN(pesoNum) || pesoNum < 30 || pesoNum > 300) {
      newErrors.peso = "Peso inválido. Favor de ingresar un peso valido.";
      valid = false;
    }

    const alturaNum = parseFloat(metrics.altura);
    if (!metrics.altura || 
        metrics.altura.trim() === '' || 
        isNaN(alturaNum) || 
        alturaNum < 1.0 || 
        alturaNum > 2.50) {
      newErrors.altura = "Altura inválida. Favor de ingresar una altura válida.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const calcularIMC = () => {
    // Primero validar los campos
    if (!validateFields()) {
      return;
    }

    const altura = parseFloat(metrics.altura);
    const peso = parseFloat(metrics.peso);
    setImcError("");
    
    if (!isNaN(altura) && !isNaN(peso) && altura > 0) {
      const imc = peso / (altura * altura);

      if (imc < 10 || imc > 60) {
        setImcError(
          "Valores inválidos: el IMC calculado está fuera de un rango realista."
        );
        return;
      }
      setMetrics({ ...metrics, imc: imc.toFixed(1) });
    }
  };

  return (
    <View style={styles.containerCard}>
      <View style={styles.ContainerHead}>
        <View style={styles.leftContent}>
          <Icon
            name="pulse"
            type="material-community"
            color="#3B82F6"
            size={30}
          />
          <Text style={[styles.title, { marginLeft: 10 }]}>
            Métricas de Salud
          </Text>
        </View>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Icon
            name={editing ? "close" : "square-edit-outline"}
            type="material-community"
            color="black"
            size={30}
          />
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
          />
          {errors.altura && (
            <Text style={styles.errorText}>{errors.altura}</Text>
          )}

          <Text style={styles.label}>Peso (kg):</Text>
          <TextInput
            style={styles.input}
            value={metrics.peso}
            onChangeText={(text) => handleChange("peso", text)}
            keyboardType="decimal-pad"
          />
          {errors.peso && <Text style={styles.errorText}>{errors.peso}</Text>}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={calcularIMC}>
              <Text style={styles.buttonText}>Calcular IMC</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.imcResultado}>IMC: {metrics.imc || "—"}</Text>
          {imcError !== "" && <Text style={styles.errorText}>{imcError}</Text>}
        </>
      ) : (
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.peso}</Text>
            <Text style={styles.metricLabel}>Kg</Text>
            <Text style={styles.metricLabel2}>(Kilogramos)</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.altura}</Text>
            <Text style={styles.metricLabel}>Mts</Text>
            <Text style={styles.metricLabel2}>(Metros)</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.imc}</Text>
            <Text style={styles.metricLabel}>IMC</Text>
            <Text style={styles.metricLabel2}>(Indice de Masa Corporal)</Text>
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
        marginBottom: 20,
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
    backgroundColor: "#FFFFFF",
    borderColor: "#C8E6C9",
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
    color: "#C8E6C9",
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
    fontFamily: "Poppins-ExtraBold",
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textShadowColor: "#333",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0.5,
  },
  metricLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "700",
  },
  metricLabel2: {
    fontSize: 12,
    color: "#666",
    justifyContent: "center",
    textAlign: "center",},
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
});