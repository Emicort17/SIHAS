import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, SafeAreaView, TouchableOpacity, Image, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [Lastname, setLastname] = useState("");
    const [SecondLastname, setSecondLastname] = useState("");
    const [password, setPassword] = useState("");
    const [erroMessage, setErrorMessage] = useState(false);
    const [erroPasswordMessage, setErroPasswordMessage] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);


    const handleInputEmailChange = (email) => {
        if (!email) {
            setErrorMessage(true)
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email) === true) {
                setEmail(email)
            } else {
                setErrorMessage(true)
            }
        }
    };


    const handleInputNameChange = (name) => {
        if (!name) {
            setErrorMessage(true)
        } else {
            const textRegex = /^[a-zA-Z]+$/;
            if (textRegex.test(name) === true) {
                setName(name)
            } else {
                setErrorMessage(true)
            }
        }
    };

    const handleInputLastNameChange = (Lastname) => {
        if (!Lastname) {
            setErrorMessage(true)
        } else {
            const textRegex = /^[a-zA-Z]+$/;
            if (textRegex.test(Lastname) === true) {
                setLastname(Lastname)
            } else {
                setErrorMessage(true)
            }
        }
    };

    const handleInputSecondLastNameChange = (Lastname) => {
        if (!Lastname) {
            setErrorMessage(true)
        } else {
            const textRegex = /^[a-zA-Z]+$/;
            if (textRegex.test(Lastname) === true) {
                setSecondLastname(Lastname)
            } else {
                setErrorMessage(true)
            }
        }
    };


    const handlePasswordChange = (password) => {
        if (!password) {
            setErrorMessage(true)
        } else {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (passwordRegex.test(password) === true) {
                setPassword(password)
            } else {
                setErrorMessage(true)
            }
        }
    };


    const verifyPassword = (trypassword) => {
        if (trypassword != password) {
            setErroPasswordMessage(true)
        }
    }

    const toggleVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handleRegister = async () => {
        try {
            if (email === '' && password === '' && name === '' && Lastname === '' && SecondLastname === '') {
                setErrorMessage(true)
                setErroPasswordMessage(true)
            } else {
                // Llamada a mi api
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
                </View>

                <View style={styles.container}>
                    <Text style={styles.inputext}>Correo Electronico</Text>
                    <View style={styles.div}>
                        <TextInput onChangeText={handleInputEmailChange} style={styles.input} placeholder="Correo Electronico" required />
                    </View>
                </View>
                {erroMessage && (<Text style={styles.linkError}>Por Favor coloca un correo valido</Text>)}

                <View style={styles.container}>
                    <Text style={styles.inputext}>Nombre</Text>
                    <View style={styles.div}>
                        <TextInput onChangeText={handleInputNameChange} style={styles.input} placeholder="Primer y segundo nombre" required />
                    </View>
                </View>
                {erroMessage && (<Text style={styles.linkError}>Por Favor coloca un nombre valido</Text>)}

                <View style={styles.container}>
                    <Text style={styles.inputext}>Apellido Paterno</Text>
                    <View style={styles.div}>
                        <TextInput onChangeText={handleInputLastNameChange} style={styles.input} placeholder="Correo Electronico" required />
                    </View>
                </View>
                {erroMessage && (<Text style={styles.linkError}>Por Favor coloca un apellido valido</Text>)}

                <View style={styles.container}>
                    <Text style={styles.inputext}>Apellido Materno</Text>
                    <View style={styles.div}>
                        <TextInput onChangeText={handleInputSecondLastNameChange} style={styles.input} placeholder="Correo Electronico" required />
                    </View>
                </View>
                {erroMessage && (<Text style={styles.linkError}>Por Favor coloca un apellido valido</Text>)}

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
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView >
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
})