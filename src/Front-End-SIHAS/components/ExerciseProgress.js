import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExerciseProgress({ current, goal }) {
    const percentage = (current / goal) * 100;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resumen de ejercicio semanal</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
            </View>
            <Text style={styles.text}>{current} / {goal} días</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        elevation: 3
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12
    },
    progressBar: {
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 8,
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 8
    },
    text: {
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
