import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Icon } from "@rneui/base";
import { useAuth } from "../auth/context/AuthContext";
import { AxiosClient } from "../auth/context/http_client";

export default function PersonalInformationCard({ title, data, token, onUpdate, onEdadUpdate, biologicalData, status }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(data);
  const [errors, setErrors] = useState({});
  const { getUserById } = useAuth();
  const isInitialMount = useRef(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setForm({
        ...data,
        edad: biologicalData?.age?.toString() || data.edad?.toString() || "",
      });
      return;
    }

    if (!editing) {
      setForm({
        ...data,
        edad: biologicalData?.age?.toString() || data.edad?.toString() || "",
      });
    }
  }, [data, biologicalData, editing]);

  const handleChange = (field, value) => {
    setForm(prevForm => ({ ...prevForm, [field]: value }));

    if (value) {
      validateField(field, value);
    } else {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateField = (field, value) => {
    const nameRegex = /^([A-ZÑÁÉÍÓÚ]{1}[a-zñáéíóú]+)(\s[A-ZÑÁÉÍÓÚ]{1}[a-zñáéíóú]+)?$/;
    const lastnameRegex = /^[A-ZÑÁÉÍÓÚ]{1}[a-zñáéíóú]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let error = "";
    if (field === "nombre") {
      if (!value.trim()) {
        error = "Nombre obligatorio";
      } else if (!nameRegex.test(value)) {
        error = "Inicia con mayúscula";
      }
    } else if (field === "apellidoPaterno" || field === "apellidoMaterno") {
      if (!value.trim()) {
        error = "Apellido obligatorio";
      } else if (!lastnameRegex.test(value)) {
        error = "Inicia con mayúscula";
      }
    } else if (field === "edad") {
      const edadNum = parseInt(value, 10);
      if (!value.trim()) {
        error = "Edad obligatoria";
      } else if (isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
        error = "Edad inválida (1-120)";
      }
    } else if (field === "email") {
      if (!value.trim()) {
        error = "Correo obligatorio";
      } else if (!emailRegex.test(value)) {
        error = "Correo inválido";
      }
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateFields = () => {
    const nameRegex = /^([A-ZÑÁÉÍÓÚ]{1}[a-zñáéíóú]+)(\s[A-ZÑÁÉÍÓÚ]{1}[a-zñáéíóú]+)?$/;
    const lastnameRegex = /^[A-ZÑÁÉÍÓÚ]{1}[a-zñáéíóú]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {};
    let valid = true;

    if (!form.nombre?.trim() || !nameRegex.test(form.nombre)) {
      newErrors.nombre = "Nombre inválido";
      valid = false;
    }
    if (!form.apellidoPaterno?.trim() || !lastnameRegex.test(form.apellidoPaterno)) {
      newErrors.apellidoPaterno = "Apellido paterno inválido";
      valid = false;
    }
    if (!form.apellidoMaterno?.trim() || !lastnameRegex.test(form.apellidoMaterno)) {
      newErrors.apellidoMaterno = "Apellido materno inválido";
      valid = false;
    }
    if (status) {
      const edadNum = parseInt(form.edad, 10);
      if (!form.edad?.trim() || isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
        newErrors.edad = "Edad inválida (1-120)";
        valid = false;
      }
    }
    if (!form.email?.trim() || !emailRegex.test(form.email)) {
      newErrors.email = "Correo inválido";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      Alert.alert("Error de validación", "Por favor, corrige los errores en el formulario.");
      return;
    }

    setIsLoading(true);

    try {
      const userDto = {
        id_user: data?.id_user,
        name: form.nombre,
        surname: form.apellidoPaterno,
        lastname: form.apellidoMaterno,
        email: form.email,
        status: data?.status,
        password: data?.password,
        rol: data?.role?.[0]?.name
      };
      console.log("datos enviados: ", userDto)
      console.log("rol:",data)
      const userResponse = await AxiosClient.put("/api/usuario/update", userDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onUpdate?.({
        name: userResponse.result.name,
        surname: userResponse.result.surname,
        lastname: userResponse.result.lastname,
        email: userResponse.result.email
      });

      if (status && onEdadUpdate && (biologicalData || form.edad?.trim())) {
        const ageToSave = parseInt(form.edad, 10) || 0;
        const bioData = {
          idData: biologicalData?.idData || null,
          weight: biologicalData?.weight || 0,
          height: biologicalData?.height || 0,
          bmi: biologicalData?.bmi || 0,
          age: ageToSave,
          fatPercentage: biologicalData?.fatPercentage || 1,
          date: new Date().toISOString(),
          user: data.id_user,
        };

        let bioResponse;

        if (biologicalData) {
          bioResponse = await AxiosClient.put("/api/usuario/datosbiologicos/update", bioData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          bioResponse = await AxiosClient.post("/api/usuario/datosbiologicos/save", bioData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        onEdadUpdate?.({
          ...biologicalData,
          age: ageToSave,
          edad: ageToSave.toString(),
          idData: bioResponse?.result?.idData || bioData.idData
        });
      }

      await getUserById();

      setEditing(false);
      Alert.alert("Éxito", "Tus datos han sido actualizados.");
    } catch (error) {
      console.log("Error al actualizar:", error.message);
      Alert.alert("Error", "Error al actualizar los datos: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      ...data,
      edad: biologicalData?.age?.toString() || data.edad?.toString() || "",
    });
    setErrors({});
    setEditing(false);
  };

  const handleEditToggle = () => {
    if (editing) {
      handleCancel();
    } else {
      setForm({
        ...data,
        edad: biologicalData?.age?.toString() || data.edad?.toString() || "",
      });
      setEditing(true);
    }
  };

  const displayAge = biologicalData?.age?.toString() || form.edad?.toString() || "Aún no registrada";

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
        <TouchableOpacity onPress={handleEditToggle}>
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
          <TextInput
            style={[styles.input, { backgroundColor: "#E0E0E0" }]}
            value={form.email}
            editable={false}
            selectTextOnFocus={false}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
            placeholder="Ingresa tu nombre"
            editable={!isLoading}
          />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

          <Text style={styles.label}>Apellido Paterno:</Text>
          <TextInput
            style={styles.input}
            value={form.apellidoPaterno}
            onChangeText={(text) => handleChange("apellidoPaterno", text)}
            placeholder="Ingresa tu apellido paterno"
            editable={!isLoading}
          />
          {errors.apellidoPaterno && <Text style={styles.errorText}>{errors.apellidoPaterno}</Text>}

          <Text style={styles.label}>Apellido Materno:</Text>
          <TextInput
            style={styles.input}
            value={form.apellidoMaterno}
            onChangeText={(text) => handleChange("apellidoMaterno", text)}
            placeholder="Ingresa tu apellido materno"
            editable={!isLoading}
          />
          {errors.apellidoMaterno && <Text style={styles.errorText}>{errors.apellidoMaterno}</Text>}

          {status ? (
            <>
              <Text style={styles.label}>Edad:</Text>
              <TextInput
                style={styles.input}
                value={form.edad?.toString() || ""}
                onChangeText={(text) => handleChange("edad", text)}
                keyboardType="numeric"
                placeholder="Ingresa tu edad"
                editable={!isLoading}
              />
              {errors.edad && <Text style={styles.errorText}>{errors.edad}</Text>}
            </>
          ) : null}

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
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                 {isLoading ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.text}>
            <Text style={styles.label}>Nombre:</Text> {form.nombre} {form.apellidoPaterno} {form.apellidoMaterno}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Email:</Text> {form.email}
          </Text>
          {status ? (
            <Text style={styles.text}>
              <Text style={styles.label}>Edad:</Text> {displayAge}
            </Text>
          ) : null}
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
});