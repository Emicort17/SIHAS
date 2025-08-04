import React from "react";
import { View, Text, StyleSheet } from "react-native";
import NutriSIcon from "../../assets/icons/nutrition.svg";
import SleepIcon from "../../assets/icons/run.svg";
import ExerciseIcon from "../../assets/icons/moon.svg";
import { NOTIFICATION_TYPES } from "../../utils/constants";

const NotificationCard = ({ type, title, message, date }) => {
  const notificationType = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.NUTRITION;

  const renderIcon = () => {
    switch (type) {
      case "NUTRITION": return <NutriSIcon width={30} height={30} />;
      case "EXERCISE": return <SleepIcon width={30} height={30} />;
      case "SLEEP": return <ExerciseIcon width={30} height={30} />;
      default: return <NutriSIcon width={30} height={30} />;
    }
  };

  return (
    <View style={[styles.containerCard, { marginBottom: 12 }]}>
      <View style={[styles.iconContainer, { backgroundColor: notificationType.color + "80" }]}>
        {renderIcon()}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.bodyText}>{message}</Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  containerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    width: "100%",
    maxWidth: 400,
  },
  iconContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 45,
    marginRight: 8,
    alignSelf: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  bodyText: {
    fontSize: 12,
    color: "#555",
  },
  dateContainer: {
    width: "20%",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  dateText: {
    fontSize: 10,
    color: "#888",
  },
});
