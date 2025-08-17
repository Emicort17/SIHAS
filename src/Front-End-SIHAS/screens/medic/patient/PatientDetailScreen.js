import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AxiosClient, AxiosFileClient } from '../../auth/context/http_client';

import NutritionSummary from '../../../components/NutritionSummary';
import SleepSummary from '../../../components/SleepSummary';
import DownloadPDFButton from '../../../components/DownloadPDFButton';
import ExerciseProgress from '../../../components/ExerciseProgress';

export default function PatientDetailScreen({ route }) {
    const { patient } = route.params;
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await AxiosClient.get(`/api/usuario/summary/${patient.id_user}`);
                setSummary(response); // AxiosClient ya devuelve res.data
            } catch (error) {
                console.error("Error al obtener el resumen del paciente:", error);
                Alert.alert("Error", "No se pudo cargar el resumen del paciente.");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [patient.id_user]);

    // Convierte ArrayBuffer a Base64
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000; // para no romper memoria en archivos grandes
        for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, chunk);
        }
        return btoa(binary);
    };

    const downloadPDF = async (patient) => {
        try {
            const response = await AxiosFileClient.get(
                `/api/usuario/summary/pdf/${patient.id_user}`,
                { responseType: 'arraybuffer', transformResponse: undefined }
            );

            const base64 = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );

            const fileUri = FileSystem.cacheDirectory + `Resumen_${patient.name}_${patient.surname}.pdf`;

            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Descarga', 'PDF descargado en: ' + fileUri);
            }
        } catch (error) {
            console.error('Error al descargar PDF:', error.response?.status, error.message);
            Alert.alert('Error', 'No se pudo descargar el PDF');
        }
    };
    const handleDownloadPDF = () => downloadPDF(patient);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Cargando detalles del paciente...</Text>
            </View>
        );
    }

    if (!summary) {
        return (
            <View style={styles.container}>
                <Text>No se pudo cargar el resumen del paciente.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Detalles de Paciente</Text>
                <Text>Nombre: {patient.name} {patient.surname} {patient.lastname}</Text>
                <Text>Email: {patient.email}</Text>

                <NutritionSummary
                    data={{
                        kcal: summary.kcal ?? 0,
                        protein: summary.protein ?? 0,
                        carbs: summary.carbs ?? 0,
                        fat: summary.fat ?? 0,
                        fiber: summary.fiber ?? 0
                    }}
                />

                <SleepSummary data={summary.sleepHoursPerDay || [0,0,0,0,0,0,0]} />

                <ExerciseProgress
                    current={summary.currentExerciseCount ?? 0}
                    goal={summary.exerciseGoal ?? 0}
                />

                <DownloadPDFButton onPress={handleDownloadPDF} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
