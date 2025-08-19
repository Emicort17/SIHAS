import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Fuego from "../../assets/icons/fuego.svg";
import Luna from "../../assets/icons/lunam.svg";
import Comida from "../../assets/icons/comim.svg";
import Ejercicio from "../../assets/icons/ejerciciom.svg";
import { useAuth } from "../auth/context/AuthContext";
import Run from "../../assets/icons/run.svg";
import WelcomeModal from "../components/WelcomeModal";
import { AxiosClient } from "../auth/context/http_client";

export default function Home() {
    const navigation = useNavigation();
    const { getUserById, user, userData } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [weekExerciseCount, setWeekExerciseCount] = useState(0);
    const [weekExerciseDates, setWeekExerciseDates] = useState([]);
    const [sleepHours, setSleepHours] = useState(0);
    const [foodSchedules, setFoodSchedules] = useState([]);

    const now = new Date();
    const currentTime = now.toLocaleTimeString('it-IT');

    const comidasRegistradas = foodSchedules.filter(f => f.time <= currentTime).length;
    const totalComidas = foodSchedules.length;


    useEffect(() => {
        if (userData) {
            setProfileData(userData);
        }
    }, [userData]);

    useEffect(() => {
        if (user?.status === false) {
            setShowModal(true);
        }
    }, [user]);

    const getCurrentDateTime = () => {
        const now = new Date();
        const date = now.toLocaleDateString('sv-SE');
        const time = now.toLocaleTimeString('it-IT');
        return { date, time };
    };

    const fetchSleepData = async (userId) => {
        try {
            const response = await AxiosClient.get(`/api/usuario/horario/dormir/${userId}`);
            const result = response.result || response.data?.result;
            const today = new Date().toLocaleDateString('sv-SE');

            if (Array.isArray(result)) {
                const todaySleep = result.find(r => r.date === today);
                setSleepHours(todaySleep?.totalHours || 0);
            } else if (result && result.date === today) {
                setSleepHours(result.totalHours || 0);
            } else {
                setSleepHours(0);
            }
        } catch (error) {
            setSleepHours(0);
        }
    };

    const fetchFoodSchedules = async (userId) => {
        try {
            const response = await AxiosClient.get(`/api/usuario/horarioalimento/day/${userId}`);
            const result = response.result || response.data?.result || [];
            console.log("Food schedules:", result);
            setFoodSchedules(Array.isArray(result) ? result : []);
        } catch (error) {
            setFoodSchedules([]);
        }
    };

    const fetchWeekExercise = async (userId) => {
        try {
            const response = await AxiosClient.get(`/api/usuario/ejercicio/semana/${userId}`);
            const result = response.result || [];
            const uniqueDays = Array.isArray(result)
                ? [...new Set(result.map(e => e.date))]
                : [];
            setWeekExerciseDates(uniqueDays);
            setWeekExerciseCount(uniqueDays.length);
        } catch (error) {
            setWeekExerciseDates([]);
            setWeekExerciseCount(0);
        }
    };

    const isTodayRegistered = () => {
        const today = new Date().toLocaleDateString('sv-SE');
        return weekExerciseDates.includes(today);
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
                            await AxiosClient.post(
                                "/api/usuario/ejercicio/save",
                                {
                                    date,
                                    time,
                                    status: true,
                                    user: profileData?.id_user,
                                }
                            );
                            fetchWeekExercise(profileData?.id_user);
                        } catch (error) {
                            console.error("Error al registrar ejercicio:", error);
                            Alert.alert("Error", "No se pudo registrar el ejercicio.");
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        if (profileData?.id_user) {
            fetchWeekExercise(profileData.id_user);
            fetchSleepData(profileData.id_user);
            fetchFoodSchedules(profileData.id_user);
        }
    }, [profileData]);

    const progress = weekExerciseCount / 7;
    const progressPercent = `${Math.min(progress * 100, 100)}%`;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <WelcomeModal visible={showModal} onClose={() => setShowModal(false)} />
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
                        <Text style={styles.bigNumber}>{comidasRegistradas}/{totalComidas}</Text>
                        <Text style={styles.cardDesc}>Registradas hoy</Text>
                    </View>
                    <View style={[styles.card, styles.smallCard]}>
                        <View style={styles.iconRow}>
                            <Luna width={24} height={24} />
                            <Text style={styles.cardTitle}>Sueño</Text>
                        </View>
                        <Text style={[styles.bigNumber, { color: "#6C7AE0" }]}>{sleepHours}h</Text>
                        <Text style={styles.cardDesc}>Anoche</Text>
                    </View>
                </View>

                {!isTodayRegistered() ? (
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
                                <View style={[styles.progressBarFill, { width: progressPercent }]} />
                            </View>
                            <Text style={{ marginLeft: 8, color: "#444" }}>
                                {weekExerciseCount}/7 días
                            </Text>
                        </View>
                    </View>
                )}

                {/* Acciones rápidas */}
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
});
