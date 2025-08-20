import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, TextInput, Text, Image, TouchableOpacity, } from "react-native";
import { useAuth } from "./context/AuthContext";

export default function ChangePassword() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erroMessage, setErrorMessage] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=(?:[^A-Z]*[A-Z]){1}[^A-Z]*$)[A-Za-z\d]{8}$/;


    const handleInputChange = (email) => {
        setEmail(email)
    };

    const handlePasswordChange = (password) => {
        setPassword(password)
    };

    const toggleVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    useEffect(() => {
        if (email === "") {
            setErrorMessage(false)
        } else {
            setErrorMessage(!emailRegex.test(email))
        }
    }, [email])

    useEffect(() => {
        if (password === "") {
            setPasswordError(false);
        } else {
            setPasswordError(!passwordRegex.test(password));
        }
    }, [password]);

    const handleEmail = async () => {
        try {
            if (!email) {
                setErrorMessage(true)
            } else {
                setErrorMessage(false)
                const sendemail = await SendEmail(email);
                if (!sendemail) {
                    Alert.alert("Error", "Credenciales incorrectas")
                } else {
                    navigation.navigate('Register')
                }
                setErrorMessage(false)
            }
        } catch {
            setErrorMessage('');
            setTimeout(() => setErrorMessage('Usuario o contraseña incorrectos'), 10);
        }
    }

    return (
        <SafeAreaView edges={['top']}>
            <ScrollView style={{ backgroundColor: 'white', height: '100%', paddingBottom: 10 }}>

                <View style={styles.image}>
                    <Image style={styles.logo} source={require('../../assets/logo.jpg')} />
                    <Text style={styles.presentation}>Cambia tu contraseña</Text>
                    <Text>TColoca tu correo y tu nueva contraseña</Text>
                </View>

                <View style={styles.container}>
                    <Text style={styles.inputext}>Correo Electronico</Text>
                    <View style={styles.div}>
                        <TextInput onChangeText={handleInputChange} style={styles.input} placeholder="Correo Electronico" required />
                    </View>
                </View>
                {erroMessage && (<Text style={styles.linkError}>Por Favor coloca un correo valido</Text>)}

                <View style={styles.container}>
                    <Text style={styles.inputext}>Contraseña</Text>
                    <View style={styles.div}>
                        <TextInput onChangeText={handlePasswordChange} style={styles.input} secureTextEntry={!passwordVisible} placeholder="Contraseña" required />
                        <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
                            <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>
                {erroMessage && (<Text style={styles.linkError}>Por Favor coloca una contraseña valida</Text>)}





                <View style={styles.divbutton}>
                    <TouchableOpacity style={styles.button} onPress={handleEmail}>
                        <Text style={styles.buttonText}>Enviar mensaje</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    div: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
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
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    inputext: {
        alignSelf: 'left',
        marginBottom: 6,
        paddingHorizontal: 30

    },
    link: {
        alignSelf: 'left',
        paddingHorizontal: 30
    },
    linkRegister: {
        alignSelf: 'left',
        paddingHorizontal: 30,
        top: 10
    },
    linkError: {
        alignSelf: 'left',
        top: -5,
        paddingHorizontal: 30,
        color: 'red'
    }
    ,
    register: {
        alignSelf: 'left',
        paddingHorizontal: 30,
        alignItems: 'center',
        color: 'blue'
    },
    icon: {
        position: 'absolute',
        right: 40,
        top: 10,
        padding: 5
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white'
    },
    image: {
        paddingTop: 100,
        marginBottom: 40,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    presentation: {
        paddingTop: 10,
        fontSize: 25,
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#C8E6C9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: '#424242',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    divbutton: {
        paddingTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
})