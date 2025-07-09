import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "@rneui/base";

export default function PersonalInformationCard({ title, data }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(data);

  const [errors, setErrors] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    edad: "",
    email: "",
  });

  const handleChange = (dato, value) => {
    setForm((prevForm) => ({ ...prevForm, [dato]: value }));

    let errorMessage = "";

    switch (dato) {
      case "nombre":
      case "apellidoPaterno":
      case "apellidoMaterno":
        if (!value.trim()) {
          errorMessage = "Campo Obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "Solo letras y espacios";
        }
        break;

      case "edad":
        const edadNum = parseInt(value);
        if (!value.trim()) {
          errorMessage = "Edad obligatoria";
        } else if (isNaN(edadNum) || edadNum < 1 || edadNum > 100) {
          errorMessage = "Edad inválida. Favor de ingresar una edad valida.";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "Correo obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Correo inválido. Favor de ingresar un correo valido.";
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

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.nombre || !nameRegex.test(form.nombre)) {
      newErrors.nombre = "Nombre inválido. Por favor de ingresar un nombre valido.";
      valid = false;
    }

    if (!form.apellidoPaterno || !nameRegex.test(form.apellidoPaterno)) {
      newErrors.apellidoPaterno = "Apellido paterno inválido. Por favor de ingresar un apellido valido.";
      valid = false;
    }

    if (!form.apellidoMaterno || !nameRegex.test(form.apellidoMaterno)) {
      newErrors.apellidoMaterno = "Apellido materno inválido. Por favor de ingresar un apellido valido.";
      valid = false;
    }

    const edadNum = parseInt(form.edad);
    if (!form.edad || isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
      newErrors.edad = "Edad inválida. Por favor de ingresar un edad valida.";
      valid = false;
    }

    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = "Correo inválido. Por favor de ingresar un correo valido.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validateFields()) {
      setEditing(false);
      console.log("Datos guardados:", form);

    }
  };

  return (
    <View style={styles.containerCard}>
      <View style={styles.ContainerHead}>
        <View style={styles.leftContent}>
          <Icon
            name="account-outline"
            type="material-community"
            color="black"
            size={30}
          />
          <Text style={[styles.title, { marginLeft: 10 }]}>{title}</Text>
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
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
          />
          {errors.nombre && (
            <Text style={styles.errorText}>{errors.nombre}</Text>
          )}

          <Text style={styles.label}>Apellido Paterno:</Text>
          <TextInput
            style={styles.input}
            value={form.apellidoPaterno}
            onChangeText={(text) => handleChange("apellidoPaterno", text)}
          />
          {errors.apellidoPaterno && (
            <Text style={styles.errorText}>{errors.apellidoPaterno}</Text>
          )}

          <Text style={styles.label}>Apellido Materno:</Text>
          <TextInput
            style={styles.input}
            value={form.apellidoMaterno}
            onChangeText={(text) => handleChange("apellidoMaterno", text)}
          />
          {errors.apellidoMaterno && (
            <Text style={styles.errorText}>{errors.apellidoMaterno}</Text>
          )}

          <Text style={styles.label}>Edad:</Text>
          <TextInput
            style={styles.input}
            value={form.edad}
            onChangeText={(text) => handleChange("edad", text)}
            keyboardType="numeric"
          />
          {errors.edad && <Text style={styles.errorText}>{errors.edad}</Text>}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.text}>
            <Text style={styles.label}>Nombre:</Text> {form.nombre}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Email:</Text> {form.email}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Edad:</Text> {form.edad}
          </Text>
        </>
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
  text: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    height: 45,
    width: "100%",
    backgroundColor: "#F0F4F8",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 4,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
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
});
