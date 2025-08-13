import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

export default function SendEmail() {
    
    const [email, setEmail] = useState("");
    const [erroMessage, setErrorMessage] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if (email === "") {
            setErrorMessage(false)
        } else {
            setErrorMessage(!emailRegex.test(email))
        }
    }, [email])

    return (
        <SafeAreaView edges={['top']}>
            <ScrollView style={{ backgroundColor: 'white', height: '100%', paddingBottom: 10 }}>

                <View style={styles.container}>
                    <Text style={styles.inputext}>Correo Electronico</Text>
                    <View style={styles.div}>
                        <TextInput onChangeText={handleInputEmailChange} style={styles.input} placeholder="Correo Electronico" required />
                    </View>
                </View>
                {erroMessage && (<Text style={styles.linkError}>Por Favor coloca un correo valido</Text>)}


            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    },
    input: {
        height: 50,
        width: '90%',
        backgroundColor: '#F0F4F8',
        borderColor: '#F0F4F8',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        elevation: 6, // Android
        shadowColor: '#000', // iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,

    },
    inputext: {
        alignSelf: 'left',
        marginBottom: 6,
        paddingHorizontal: 30

    }, 
    div: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },

})