import React,{useEffect,useState} from "react";
import { Text, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ← Importación faltante
import WelcomeModal from "./components/WelcomeModal";
export default function HomeUserScreen() {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const checkFormStatus = async () => {
      try {
        const formCompleted = await AsyncStorage.getItem('formCompleted');
        console.log('Form completed status:', formCompleted); // Para debug
        if (formCompleted === 'false') {
          setShowModal(true); 
        }
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
      }
    };

    checkFormStatus();
  }, []);

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
