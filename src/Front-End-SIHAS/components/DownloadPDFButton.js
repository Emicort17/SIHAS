import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function DownloadPDFButton({ onPress }) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >
            <Feather name="file-text" size={20} color="white" />
            <Text style={styles.text}>Descargar PDF</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 20
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16
    }
});
