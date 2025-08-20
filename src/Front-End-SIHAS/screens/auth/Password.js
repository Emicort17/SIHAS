import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "./context/AuthContext";

export default function Password({ route, navigation }) {
    const { email } = route.params; 
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { ChangePassword } = useAuth();

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Debes llenar ambos campos.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await ChangePassword(email, newPassword);

            if (response) {
                Alert.alert("Éxito", "Tu contraseña ha sido cambiada.");
                navigation.replace("Login"); 
            } else {
                Alert.alert("Error", "No se pudo cambiar la contraseña.");
            }
        } catch (error) {
            console.error("Error en ChangePassword:", error);
            Alert.alert("Error inesperado", "Ocurrió un problema al cambiar la contraseña.");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Cambiar contraseña</Text>
            <TextInput
                placeholder="Nueva contraseña"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />
            <TextInput
                placeholder="Confirmar contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />
            <Button title="Guardar" onPress={handleChangePassword} />
        </View>
    );
}
