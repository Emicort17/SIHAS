import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TextInput, SafeAreaView, TouchableOpacity, Image, ScrollView, Switch, Alert, } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from "./context/AuthContext";

export default function Password({ route, navigation }) {
    const [email, setEmail] = useState("");
    const [NewPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [erroPasswordMessage, setErroPasswordMessage] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [erroMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        if (confirmPassword === "") {
            setErroPasswordMessage(false);
        } else {
            setErroPasswordMessage(confirmPassword !== NewPassword);
        }
    }, [confirmPassword, NewPassword]);

    const { ChangePassword } = useAuth();

    const handleInputChange = (email) => {
        setEmail(email)
    };

    const toggleVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handlePasswordChange = (NewPassword) => setNewPassword(NewPassword);
    const verifyPassword = (value) => { setConfirmPassword(value); }

    const handleChangePassword = async () => {
        if (!NewPassword || !confirmPassword) {
            Alert.alert("Error", "Debes llenar ambos campos.");
            return;
        }

        if (NewPassword !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await ChangePassword(email, NewPassword);

            if (response) {
                Alert.alert("Éxito", "Tu contraseña ha sido cambiada.");
                navigation.replace("Login");
            } else {
                Alert.alert("Error", "No se pudo cambiar la contraseña.");
            }
        } catch (error) {
            console.error("Error en ChangePassword:", error);
            Alert.alert("Error inesperado", "Ocurrió un problema al cambiar la contraseña.");
        }
    };

    return (
        <SafeAreaView edges={['top']}>
            <ScrollView style={{ backgroundColor: 'white', height: '100%', paddingBottom: 10 }}>
                <View style={styles.image}>
                    <Image style={styles.logo} source={require('../../assets/logo.jpg')} />
                </View>
                <Text style={{ fontSize: 20, marginBottom: 10, marginLeft: 90 }}>Cambiar contraseña</Text>

                <View style={styles.container}>
                    <Text style={styles.inputext}>Codigo</Text>
                    <View style={styles.div}>
                        <TextInput style={styles.input} placeholder="37128" />
                        <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
                        </TouchableOpacity>
                    </View>
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

                <View style={styles.container}>
                    <Text style={styles.inputext}>Confirmar Contraseña</Text>
                    <View style={styles.div}>
                        <TextInput onChangeText={verifyPassword} style={styles.input} secureTextEntry={!passwordVisible} placeholder="Repite tu Contraseña" required />
                        <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
                            <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>
                {erroPasswordMessage && (<Text style={styles.linkError}>Por Favor coloca una contraseña valida</Text>)}

                <View style={styles.divbutton}>
                    <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                        <Text style={styles.buttonText}>Cambiar contraseña</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
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
        paddingTop: 80,
        marginBottom: 40,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    presentation: {
        paddingTop: 10,
        fontSize: 35,
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
        paddingBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label_select: {
        fontSize: 16,
        marginRight: 2,
        color: '#333'
    },
    div_select: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '8r0%',
        alignSelf: 'center',
        marginBottom: 10
    }
})