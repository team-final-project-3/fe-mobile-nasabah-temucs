import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HistoryCard = ({item}) => {

    const formattedDate = new Date (item.booking_date)
    return (
        <View style={StyleSheet.historyCard}>
            <View style={StyleSheet.cardHeader} >
                <Text style={StyleSheet.ticketNumber}></Text>
            </View>
        </View>
    )
}