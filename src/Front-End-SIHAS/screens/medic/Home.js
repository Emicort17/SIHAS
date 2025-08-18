import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Fuego from "../../assets/icons/fuego.svg";
import Luna from "../../assets/icons/lunam.svg";
import Comida from "../../assets/icons/comim.svg";
import Ejercicio from "../../assets/icons/ejerciciom.svg";
import { useAuth } from "../auth/context/AuthContext";
import Run from "../../assets/icons/run.svg";
import { AxiosClient } from "../auth/context/http_client";

export default function Home() {
    const navigation = useNavigation();
    const { getUserById, user, userData } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [didExercise, setDidExercise] = useState(false);

    useEffect(() => {
        if (userData) {
            setProfileData(userData);
        }
    }, [userData]);

    const getCurrentDateTime = () => {
        const now = new Date();
        const date = now.toISOString().slice(0, 10);
        const time = now.toTimeString().slice(0, 8);
        return { date, time };
    };

    const handleExerciseCheck = () => {
        Alert.alert(
            "Confirmar",
            "¿Estás seguro de que realizaste ejercicio hoy?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Sí",
                    onPress: async () => {
                        const { date, time } = getCurrentDateTime();
                        try {
                            await AxiosClient.post("/api/usuario/ejercicio/save",
                                {
                                    date,
                                    time,
                                    status: true,
                                    user: profileData?.id_user,
                                }
                            );
                            setDidExercise(true);
                        } catch (error) {
                            console.error("No pues xD:", error);
                            Alert.alert("Error", "No se pudo registrar el ejercicio.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.hello}>
                        ¡Hola, {profileData?.name || "Usuario"}!
                    </Text>
                    <Text style={styles.subtitle}>Aquí tienes tu resumen del día</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.card, styles.smallCard]}>
                        <View style={styles.iconRow}>
                            <Comida width={24} height={24} />
                            <Text style={styles.cardTitle}>Comidas</Text>
                        </View>
                        <Text style={styles.bigNumber}>0/3</Text>
                        <Text style={styles.cardDesc}>Registradas hoy</Text>
                    </View>
                    <View style={[styles.card, styles.smallCard]}>
                        <View style={styles.iconRow}>
                            <Luna width={24} height={24} />
                            <Text style={styles.cardTitle}>Sueño</Text>
                        </View>
                        <Text style={[styles.bigNumber, { color: "#6C7AE0" }]}>0</Text>
                        <Text style={styles.cardDesc}>Anoche</Text>
                    </View>
                </View>

                {!didExercise ? (
                    <View style={styles.card}>
                        <View style={styles.iconRow}>
                            <Ejercicio width={24} height={24} />
                            <Text style={styles.cardTitle}>Ejercicio</Text>
                        </View>
                        <View style={styles.exerciseRow}>
                            <Fuego width={48} height={48} />
                            <Text style={styles.exerciseText}>¿Realizaste ejercicio el día de hoy?</Text>
                            <TouchableOpacity style={styles.checkbox} onPress={handleExerciseCheck} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={styles.iconRow}>
                            <Run width={24} height={24} />
                            <Text style={[styles.cardTitle, { color: "#388E3C" }]}>Resumen de ejercicio semanal</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
                            <View style={styles.progressBarBackground}>
                                <View style={[styles.progressBarFill, { width: "20%" }]} />
                            </View>
                            <Text style={{ marginLeft: 8, color: "#444" }}>1/5 días</Text>
                        </View>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.quickActionsTitle}>Acciones Rapidas</Text>
                    <View style={styles.quickActionsRow}>
                        <TouchableOpacity
                            style={styles.quickButton}
                            onPress={() => navigation.navigate("NutricionUser")}
                        >
                            <Text style={styles.quickButtonText}>+ Registrar Comida</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickButton}
                            onPress={() => navigation.navigate("SleepUser")}
                        >
                            <Text style={styles.quickButtonText}>+ Hora de Sueño</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        backgroundColor: "#f5f5f5",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 18,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    hello: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 15,
        color: "#444",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18,
    },
    smallCard: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 18,
        alignItems: "flex-start",
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#7B6CA0",
    },
    bigNumber: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#D1A4E5",
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 13,
        color: "#888",
    },
    exerciseRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    exerciseText: {
        flex: 1,
        fontSize: 15,
        marginLeft: 12,
        color: "#444",
    },
    checkbox: {
        width: 28,
        height: 28,
        borderWidth: 2,
        borderColor: "#B7E1CD",
        borderRadius: 6,
        backgroundColor: "#fff",
        marginLeft: 10,
    },
    quickActionsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#444",
    },
    quickActionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    quickButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#B7E1CD",
        borderRadius: 8,
        paddingVertical: 12,
        marginRight: 10,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    quickButtonText: {
        color: "#4CAF50",
        fontWeight: "bold",
        fontSize: 15,
    },
    progressBarBackground: {
        height: 12,
        flex: 1,
        backgroundColor: "#ECECEC",
        borderRadius: 8,
        overflow: "hidden",
        marginRight: 8,
    },
    progressBarFill: {
        height: 12,
        backgroundColor: "#8EC9B6",
        borderRadius: 8,
    },
});
