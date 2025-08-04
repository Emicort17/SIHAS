import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import NutritionSummary from '../../../components/NutritionSummary';
import SleepSummary from '../../../components/SleepSummary';
import DownloadPDFButton from '../../../components/DownloadPDFButton';
import ExerciseProgress from '../../../components/ExerciseProgress';

export default function PatientDetailScreen({ route }) {
    const { patient } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Detalles de Paciente</Text>
                <Text>Nombre: {patient.name}</Text>
                <Text>Email: {patient.email}</Text>

                <NutritionSummary
                    data={{
                        kcal: 440,
                        protein: 69,
                        carbs: 19.3,
                        fat: 11.8,
                        fiber: 8.1
                    }}
                />

                <SleepSummary data={[6, 2, 1.5, 1, 1, 1, 1]} />
                <ExerciseProgress current={3} goal={5} />
                <DownloadPDFButton />
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
    }
});
