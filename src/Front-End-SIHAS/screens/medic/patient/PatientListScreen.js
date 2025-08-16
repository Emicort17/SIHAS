import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AxiosClient } from '../../auth/context/http_client';

export default function PatientListScreen() {
    const navigation = useNavigation();
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await AxiosClient.get("/api/usuario/");
                setPatients(response.result);
                setFilteredPatients(response.result);
                setError(null);
            } catch (error) {
                console.error("Error al obtener pacientes:", error);
                setError(error);
                Alert.alert(
                    "Error",
                    error.response?.data?.message || "No se pudo cargar la lista de pacientes",
                    [{ text: "OK" }]
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text.trim() === "") {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter((p) =>
                `${p.name} ${p.surname} ${p.lastname}`
                    .toLowerCase()
                    .includes(text.toLowerCase())
            );
            setFilteredPatients(filtered);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Cargando lista de pacientes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error al cargar pacientes</Text>
                <Text>{error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Pacientes</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("AddPatient")}
                >
                    <Text style={styles.addButtonText}>+ Agregar pacientes</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.searchBar}
                placeholder="Buscar paciente"
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {filteredPatients.length === 0 ? (
                <Text>No hay pacientes registrados</Text>
            ) : (
                <FlatList
                    data={filteredPatients}
                    keyExtractor={(item) => item.id_user.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.patientCard}
                            onPress={() => navigation.navigate("Detail", { patient: item })}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {item.name ? item.name[0] : "?"}
                                </Text>
                            </View>

                            <View style={styles.patientInfo}>
                                <Text style={styles.patientName}>
                                    {item.name} {item.surname} {item.lastname}
                                </Text>
                                <Text style={styles.patientEmail}>{item.email}</Text>
                            </View>

                            <View style={styles.lastUpdated}>
                                <Text style={styles.updatedText}>
                                    Último actualizado: {item.lastUpdated || "---"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F5F5F5",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    addButton: {
        backgroundColor: "#E8F5E9",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    searchBar: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 14,
    },
    patientCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        marginVertical: 6,
        borderRadius: 12,
        elevation: 2, // sombra Android
        shadowColor: "#000", // sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#C8E6C9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#424242",
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    patientEmail: {
        fontSize: 14,
        color: "#666",
    },
    lastUpdated: {
        marginLeft: 10,
    },
    updatedText: {
        fontSize: 12,
        color: "#999",
    },
    errorText: {
        color: "red",
        fontWeight: "bold",
    },
});
