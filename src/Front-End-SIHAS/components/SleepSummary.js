import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SleepSummary({ data }) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const maxHours = Math.max(...data);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resumen de sueño semanal</Text>
            <View style={styles.chart}>
                {data.map((hours, index) => {
                    const barHeight = (hours / maxHours) * 80; // altura proporcional
                    return (
                        <View key={index} style={styles.barContainer}>
                            <View style={[styles.bar, { height: barHeight }]} />
                            <Text style={styles.label}>{days[index]}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginVertical: 10,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 120,
    },
    barContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 100,
    },
    bar: {
        width: 12,
        backgroundColor: '#4285F4',
        borderRadius: 6,
        marginBottom: 6,
    },
    label: {
        fontSize: 12,
        marginTop: 4,
    },
});
