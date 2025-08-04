import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PatientCard from '../../../components/PatientCard';

const patients = [
    { id: '1', name: 'Víctor Alejandro Oliva Quiroz', email: 'alejandro69@gmail.com' },
    { id: '2', name: 'Ana Laura Torres', email: 'ana.torres@example.com' },
    { id: '3', name: 'Carlos Méndez Ruiz', email: 'carlosmr@gmail.com' },
];

export default function PatientListScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis Pacientes</Text>
            <TextInput placeholder="Buscar Paciente" style={styles.search} />
            <FlatList
                data={patients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PatientCard
                        patient={item}
                        onPress={() => navigation.navigate('Detail', { patient: item })}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F8F9F4' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    search: { backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 15 }
});
