import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LogOut } from "lucide-react-native";

const LogoutButton = ({ onPress }) => {
  const handlePress = () => {
    console.log('[LogoutButton] Tombol Keluar ditekan');
    if (onPress) {
      onPress();
    }
  };
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        borderRadius: 16,
        padding: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <LogOut color="#ffff" size={20} />
      <Text style={{ color: "#ffff", fontWeight: "800", marginLeft: 8 }}>
        Keluar
      </Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;