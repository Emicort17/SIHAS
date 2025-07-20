import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "@rneui/base";

export default function BiologicalDataCard({ onSave }) {
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
          errorMessage = "Edad inválido. Favor de ingresar una edad valido.";
        }
        break;
      case "peso":
        if (!value.trim()) {
          errorMessage = "Peso obligatorio.";
        } else if (isNaN(numValue) || numValue < 30 || numValue > 300) {
          errorMessage = "Peso inválido. Favor de ingresar un peso valido.";
        }
        break;
      case "altura":
        if (!value.trim()) {
          errorMessage = "Altura obligatoria.";
        } else if (isNaN(numValue) || numValue < 1.0 || numValue > 2.5) {
          errorMessage =
            "Altura inválido. Favor de ingresar una altura valida.";
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

  const handleSubmit = () => {
    if (!isFormValid()) {
      validateField("edad", data.edad);
      validateField("peso", data.peso);
      validateField("altura", data.altura);
      return;
    }
    onSave(data);
  };

  return (
    <View style={styles.containerCard}>
      <View style={styles.header}>
        <Icon
          name="pulse"
          type="material-community"
          color="#3B82F6"
          size={30}
        />{" "}
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
          />
          <Text style={styles.unit}>Mts</Text>
        </View>
        {errors.altura && <Text style={styles.error}>{errors.altura}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.button, { opacity: isFormValid() ? 1 : 0.6 }]}
        onPress={handleSubmit}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>Hecho</Text>
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
