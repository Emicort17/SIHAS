import { Text, StyleSheet, View , ScrollView,TouchableOpacity, Modal,Alert } from "react-native";
import { React ,useState,useCallback  } from "react"
import { useAuth } from "../../screens/auth/context/AuthContext";
import {AxiosClient} from "../../screens/auth/context/http_client";
import { useFocusEffect } from "@react-navigation/native";

const sleepEntries = []

const TimePicker = ({ value, onTimeChange, onClose }) => {
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return { hour: displayHour, minute: minutes, period }
  }

  const { hour: initialHour, minute: initialMinute, period: initialPeriod } = parseTime(value)

  const [selectedHour, setSelectedHour] = useState(initialHour)
  const [selectedMinute, setSelectedMinute] = useState(initialMinute)
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod)

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const periods = ["AM", "PM"]

  const handleConfirm = () => {
    let hour24 = selectedHour
    if (selectedPeriod === "AM" && selectedHour === 12) {
      hour24 = 0
    } else if (selectedPeriod === "PM" && selectedHour !== 12) {
      hour24 = selectedHour + 12
    }

    const formattedTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`
    onTimeChange(formattedTime)
    onClose()
  }

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 24,
            width: "90%",
            maxWidth: 320,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 24,
              color: "#1f2937",
            }}
          >
            Seleccionar Hora
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            {/* Hour Picker */}
            <View style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>Hora</Text>
              <ScrollView style={{ height: 120, width: 60 }} showsVerticalScrollIndicator={false}>
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={`hour-${hour}`}
                    style={{
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor: selectedHour === hour ? "#dbeafe" : "transparent",
                      borderRadius: 8,
                    }}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: selectedHour === hour ? "#2563eb" : "#374151",
                        fontWeight: selectedHour === hour ? "600" : "400",
                      }}
                    >
                      {hour}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={{ fontSize: 24, fontWeight: "bold", marginHorizontal: 8 }}>:</Text>

            {/* Minute Picker */}
            <View style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>Min</Text>
              <ScrollView style={{ height: 120, width: 60 }} showsVerticalScrollIndicator={false}>
                {minutes
                  .filter((m) => m % 5 === 0)
                  .map((minute) => (
                    <TouchableOpacity
                      key={`minute-${minute}`}
                      style={{
                        paddingVertical: 8,
                        alignItems: "center",
                        backgroundColor: selectedMinute === minute ? "#dbeafe" : "transparent",
                        borderRadius: 8,
                      }}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: selectedMinute === minute ? "#2563eb" : "#374151",
                          fontWeight: selectedMinute === minute ? "600" : "400",
                        }}
                      >
                        {minute.toString().padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>

            <View style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>Período</Text>
              <ScrollView style={{ height: 120, width: 60 }} showsVerticalScrollIndicator={false}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={`period-${period}`}
                    style={{
                      paddingVertical: 8,
                      alignItems: "center",
                      backgroundColor: selectedPeriod === period ? "#dbeafe" : "transparent",
                      borderRadius: 8,
                    }}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: selectedPeriod === period ? "#2563eb" : "#374151",
                        fontWeight: selectedPeriod === period ? "600" : "400",
                      }}
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#f3f4f6",
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
              onPress={onClose}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#6b7280" }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#3b82f6",
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
              onPress={handleConfirm}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default function SleepAdminScreen() {
  const [sleepEntries, setSleepEntries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)
  const { user } = useAuth();
  const [bedtime, setBedtime] = useState("20:00")
  const [wakeTime, setWakeTime] = useState("07:00")
  const [showBedtimePicker, setShowBedtimePicker] = useState(false)
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`
  }
  const calculateSleepDuration = () => {
    const [bedHours, bedMinutes] = bedtime.split(":").map(Number)
    const [wakeHours, wakeMinutes] = wakeTime.split(":").map(Number)

    const bedTimeInMinutes = bedHours * 60 + bedMinutes
    let wakeTimeInMinutes = wakeHours * 60 + wakeMinutes

    // If wake time is earlier than bed time, it's the next day
    if (wakeTimeInMinutes < bedTimeInMinutes) {
      wakeTimeInMinutes += 24 * 60
    }

    const durationInMinutes = wakeTimeInMinutes - bedTimeInMinutes
    const hours = Math.floor(durationInMinutes / 60)
    const minutes = durationInMinutes % 60
    return `${hours}h ${minutes}min`
  }

  const handleBedtimeChange = (newTime) => {
    setBedtime(newTime)
    setShowBedtimePicker(false)
    setRefreshKey((prev) => prev + 1)
  }

  const handleWakeTimeChange = (newTime) => {
    setWakeTime(newTime)
    setShowWakeTimePicker(false)
    setRefreshKey((prev) => prev + 1)
  }
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // meses empiezan en 0
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDurationToDouble = (durationStr) => {
  // "12h 30min" → ["12", "30"]
  const match = durationStr.match(/(\d+)h\s+(\d+)min/);
  if (!match) return 0;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours + minutes / 60; 
  }
    
  const fetchSleeps = async () => {
    try {
        console.log("Datos de alumno: ", user.token)
      const response = await AxiosClient.get('/api/usuario/horario/dormir/all', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSleepEntries(response.result);
    } catch (err) {
      console.error("Se nos murió xD:", err);
      Alert.alert("Error", "No se pudieron cargar los horarios");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSleeps();
    }, [])
  );
  const handleSave = async (startTime, endTime) => {
    const durationStr = calculateSleepDuration();
    const totalHours = parseDurationToDouble(durationStr);

    const payload = {
      date: getCurrentDate(),
      startTime:startTime,
      endTime: endTime ,
      totalHours: totalHours,
      user: user?.userId
    }
    const today = new Date().toISOString().split("T")[0]; // "2025-08-17"
    const alreadyExists = sleepEntries.some(
    (sleep) => sleep.date === today
    );
     if (alreadyExists) {
    Alert.alert(
      "Atención",
      "Ya has registrado tu horario para hoy ⏰",
      [
        {
          text: "OK",
          onPress: () => setModalVisible(false), // Cierra el modal
        },
      ]
    );
    return;
  }

    try {
      const response = await AxiosClient.post("/api/usuario/horario/dormir/save", payload,{
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }) 
        if (response.type=="SUCCESS") {
        Alert.alert('Éxito', 'Se registró tu hora con éxito');
        }
      
        fetchSleeps();

    } catch (error) {
      Alert.alert('ERROR', 'No se registró tu hora con éxito');

      console.error("Error al guardar:", error);

    }
    setModalVisible(false)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }
  const today = new Date().toISOString().split("T")[0]; // "2025-08-17"
  const todaySleep = sleepEntries.find(entry => entry.date === today);
  const bedtimeValue = todaySleep ? todaySleep.startTime : null;
  const wakeTimeValue = todaySleep ? todaySleep.endTime : null;
  const totalHoursValue = todaySleep ? todaySleep.totalHours : null;


  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView style={styles.boxCard}>
        <View style={styles.viewHeader} >
        <MoonIcon/>
        <Text style={styles.title}>Resumen de sueño</Text>
        </View>
        <View style={styles.MainCard}>
          <View style={styles.viewCenter}>
            <Text style={styles.textFont}> {totalHoursValue ? `${totalHoursValue} hrs` : "--"}</Text>
            <Text style={{ color: "#6b7280" }}>Dormiste anoche</Text>
            <View style={styles.viewSecond}>
              <View style={{ alignItems: "center" }}>
                <MoonIcon />
                <Text style={styles.textHours}>{bedtimeValue ? formatTime12Hour(bedtimeValue) : "--:--"}</Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>Te dormiste </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <SunIcon />
                <Text style={styles.textHours}>{wakeTimeValue ? formatTime12Hour(wakeTimeValue) : "--:--"}</Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>Te despertaste</Text>
              </View>
            </View>
          </View>
        </View>

      {sleepEntries.map((entry) => (
      <View key={entry.idSleep} style={styles.SecondCard}>
        <View style={styles.boxCardSecond}>
          <Text style={styles.textStyleSecond}> 
            {entry.date}
          </Text>
          <Text style={styles.textStyleSecond}>
            {entry.totalHours}:00 hrs
          </Text>
        </View>
        <View style={{flexDirection: "row",justifyContent: "space-between",}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <MoonIcon />
            <View style={{marginLeft: 12}}>
              <Text style={styles.textStyleSecond}>{entry.startTime}</Text>
              <Text style={styles.textStyleThird}>Dormiste a las</Text>
            </View>
          </View>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <SunIcon />
            <View style={{marginLeft: 12}}>
              <Text style={styles.textStyleSecond}>{entry.endTime}</Text>
              <Text style={styles.textStyleThird}>Te despertaste</Text>
            </View>
          </View>
        </View>

      </View>
      ))}
      </ScrollView>

     <TouchableOpacity style={styles.buttonCorner} onPress={() => setModalVisible(true)}> 
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>

      <Modal animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} 
        key={`modal-${refreshKey}`}
        >
        

        <View style={styles.modalView}>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <MoonIcon />
              <Text style={styles.textHeadeModal}>Selecciona un horario de sueño</Text>
            </View>
            <View style={{marginBottom: 20}}> 
              <Text style={styles.TextModalBody}>De</Text>
              <TouchableOpacity style={styles.touchableOpacityStyle} onPress={() => setShowBedtimePicker(true)}>
                 <Text key={`bedtime-${bedtime}`} style={{ fontSize: 16, color: "#111827" }}>
                  {formatTime12Hour(bedtime)}
                </Text>
                <ClockIcon />
              </TouchableOpacity>
            </View>
            <View style={{marginBottom: 32}}>
                <Text style={styles.TextModalBody}>A</Text>
               <TouchableOpacity style={styles.touchableOpacityStyle} onPress={() => setShowWakeTimePicker(true)}>
                <Text key={`waketime-${wakeTime}`} style={{ fontSize: 16, color: "#111827" }}>
                  {formatTime12Hour(wakeTime)}
                </Text>
                <ClockIcon />
                </TouchableOpacity>  
            </View>
             <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#f3f4f6",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={handleCancel}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#6b7280",
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#86efac",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={() =>
                  handleSave(
                    bedtime, // hora de dormir
                    wakeTime, // hora de despertar
                    calculateSleepDuration(), // duración total
                    user?.userId // id del usuario
                  )
                }
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#166534",
                  }}
                >
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

      </Modal>
      
      {showBedtimePicker && (
         <TimePicker
          key="bedtime-picker"
          value={bedtime}
          onTimeChange={handleBedtimeChange}
          onClose={() => setShowBedtimePicker(false)}
        />

      )}

      {showWakeTimePicker && (
        <TimePicker
          key="waketime-picker"
          value={wakeTime}
          onTimeChange={handleWakeTimeChange}
          onClose={() => setShowWakeTimePicker(false)}
        />
      )}
    </View>
    
    
  );
}



const MoonIcon = () => (
  <View
    style={{
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#dbeafe",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "#2563eb", fontSize: 16 }}>🌙</Text>
  </View>
)

const SunIcon = () => (
  <View
    style={{
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#fef3c7",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "#d97706", fontSize: 16 }}>☀️</Text>
  </View>
)

const ClockIcon = () => (
  <View
    style={{
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "#6b7280", fontSize: 16 }}>🕐</Text>
  </View>
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  boxCard:{
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    maxWidth: 448,
    alignSelf: "center",
  },
  viewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  MainCard:{
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  viewCenter: {
    alignItems: "center",
    marginBottom: 24,
  },
  textFont:{
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  viewSecond:{
      flexDirection: "row",
      justifyContent: "space-around",
  },
  textHours:{
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
  },
  SecondCard:{
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  boxCardSecond:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  textStyleSecond:{
    fontSize: 16, 
    fontWeight: "600", 
    color: "#111827",
  },
  textStyleThird:{
    fontSize: 12,
    color: "#6b7280",
  },
  buttonCorner:{
    position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#3b82f6",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
  },
  modalView:{ 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
   },
   modalBody:{
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
   },
   modalHeader:{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
   },
   textHeadeModal:{
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 12,
    flex: 1,
   },
   TextModalBody:{
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
   },
   touchableOpacityStyle:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
   }



});


