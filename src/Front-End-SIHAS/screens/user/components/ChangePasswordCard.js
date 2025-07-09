import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Icon } from "@rneui/base";

export default function ChangePasswordCard() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [form, setForm] = useState({
    nueva: "",
    confirmar: "",
    antigua: "",
  });
  const [errors, setErrors] = useState({
    nueva: "",
    confirmar: "",
    antigua: "",
  });

  const toggleVisibility = () => setPasswordVisible(!passwordVisible);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    
    let errorMessage = "";
    switch (key) {
      case "nueva":
        if (!value.trim()) {
          errorMessage = "Nueva contraseña es obligatoria";
        } else if (value.length < 8) {
          errorMessage = "La contraseña debe tener al menos 8 caracteres";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errorMessage = "Debe contener al menos una mayúscula, minúscula y un número";
        }
        break;

      case "confirmar":
        if (!value.trim()) {
          errorMessage = "Confirmar contraseña es obligatorio";
        } else if (value !== form.nueva) {
          errorMessage = "Las contraseñas no coinciden";
        }
        break;

      case "antigua":
        if (!value.trim()) {
          errorMessage = "Contraseña actual es obligatoria";
        } else if (value.length < 6) {
          errorMessage = "Contraseña muy corta";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  };

  const validateFields = () => {
    let valid = true;
    let newErrors = {};

    // Validar nueva contraseña
    if (!form.nueva.trim()) {
      newErrors.nueva = "Nueva contraseña es obligatoria";
      valid = false;
    } else if (form.nueva.length < 8) {
      newErrors.nueva = "La contraseña debe tener al menos 8 caracteres";
      valid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.nueva)) {
      newErrors.nueva = "Debe contener al menos una mayúscula, minúscula y un número";
      valid = false;
    }

    // Validar confirmar contraseña
    if (!form.confirmar.trim()) {
      newErrors.confirmar = "Confirmar contraseña es obligatorio";
      valid = false;
    } else if (form.confirmar !== form.nueva) {
      newErrors.confirmar = "Las contraseñas no coinciden";
      valid = false;
    }

    // Validar contraseña antigua
    if (!form.antigua.trim()) {
      newErrors.antigua = "Contraseña actual es obligatoria";
      valid = false;
    } else if (form.antigua.length < 6) {
      newErrors.antigua = "Contraseña muy corta";
      valid = false;
    }

    // Validar que la nueva contraseña sea diferente a la antigua
    if (form.nueva && form.antigua && form.nueva === form.antigua) {
      newErrors.nueva = "La nueva contraseña debe ser diferente a la actual";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validateFields()) {
      // Aquí iría la lógica para guardar la contraseña
      console.log("Contraseña válida, guardando...");
      // Limpiar formulario después de guardar
      setForm({ nueva: "", confirmar: "", antigua: "" });
      setErrors({ nueva: "", confirmar: "", antigua: "" });
      setExpanded(false);
    }
  };

  const handleCancel = () => {
    // Limpiar formulario y errores al cancelar
    setForm({ nueva: "", confirmar: "", antigua: "" });
    setErrors({ nueva: "", confirmar: "", antigua: "" });
    setExpanded(false);
  };

  return (
    <>
      {!expanded && (
        <TouchableOpacity
          style={styles.touchableCard}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={() => setExpanded(true)}
          activeOpacity={0.8}
        >
          <View style={[
            styles.containerCard,
            isPressed && styles.containerCardPressed
          ]}>
            <View style={styles.ContainerHead}>
              <View style={styles.leftContent}>
                <Icon
                  name="lock-outline"
                  type="material-community"
                  color="black"
                  size={24}
                />
                <Text style={[styles.title, { marginLeft: 10 }]}>
                  Cambiar Contraseña
                </Text>
              </View>
              <Icon
                name="chevron-right"
                type="material-community"
                color="#666"
                size={30}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {expanded && (
        <View style={styles.containerCard}>
          <View style={styles.ContainerHead}>
            <View style={styles.leftContent}>
              <Icon name="lock-outline" type="material-community" color="black" size={24} />
              <Text style={[styles.title, { marginLeft: 10 }]}>Cambiar Contraseña</Text>
            </View>
            <TouchableOpacity onPress={handleCancel}>
              <Icon name="close" type="material-community" size={24} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nueva Contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry={!passwordVisible}
              value={form.nueva}
              onChangeText={(text) => handleChange("nueva", text)}
            />
            <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
              <Icon name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} type="material-community" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.nueva && <Text style={styles.errorText}>{errors.nueva}</Text>}

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              secureTextEntry={!passwordVisible}
              value={form.confirmar}
              onChangeText={(text) => handleChange("confirmar", text)}
            />
            <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
              <Icon name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} type="material-community" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.confirmar && <Text style={styles.errorText}>{errors.confirmar}</Text>}

          <Text style={styles.label}>Contraseña Actual</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              secureTextEntry={!passwordVisible}
              value={form.antigua}
              onChangeText={(text) => handleChange("antigua", text)}
            />
            <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
              <Icon name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} type="material-community" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.antigua && <Text style={styles.errorText}>{errors.antigua}</Text>}

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
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
  touchableCard: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  containerCardPressed: {
    backgroundColor: "#F5F5F5",
    opacity: 0.95,
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
    marginTop: 10,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#F0F4F8",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingRight: 40,
  },

  icon: {
    position: "absolute",
    right: 10,
    top: 12,
    padding: 5,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});