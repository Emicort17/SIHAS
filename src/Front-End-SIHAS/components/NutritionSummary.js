import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NutritionSummary({ data }) {
    return (
        <View style={styles.card}>
            <Text style={styles.kcalText}>{data.kcal} kcal</Text>
            <Text style={styles.label}>Total de calorías</Text>

            <View style={styles.nutrientsContainer}>
                <View style={styles.row}>
                    <Text style={styles.labelStrong}>Proteína:</Text>
                    <Text>{data.protein} g</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.labelStrong}>Carbohidratos:</Text>
                    <Text>{data.carbs} g</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.labelStrong}>Grasa:</Text>
                    <Text>{data.fat} g</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.labelStrong}>Fibra:</Text>
                    <Text>{data.fiber} g</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        elevation: 3
    },
    kcalText: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4
    },
    label: {
        textAlign: 'center',
        color: '#777',
        marginBottom: 16
    },
    nutrientsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    labelStrong: {
        fontWeight: '600'
    }
});
