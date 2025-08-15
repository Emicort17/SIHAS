import React, { use, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { useAuth } from "../auth/context/AuthContext";
import WelcomeModal from "../components/WelcomeModal";
export default function HomeAdminScreen() {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    console.log("user: ", user)
    useEffect(() => {
        if (user?.status === false) {
            setShowModal(true);
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <WelcomeModal visible={showModal} onClose={() => setShowModal(false)} />
            <Text style={styles.title}>Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    }
});
