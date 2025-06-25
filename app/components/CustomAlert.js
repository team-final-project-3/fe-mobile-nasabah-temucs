import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomAlert = ({
  visible,
  title = "Peringatan",
  message,
  onClose,
  isConfirmation = false,
  onConfirm,
  cancelButtonText = "Batal",
  confirmButtonText = "Lanjutkan",
  iconName,
  iconColor = '#fff',
  iconBackgroundColor = '#F47B00',
  iconSize = 60,
  singleButtonText = "OK",
  showCloseButton = false,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* {showCloseButton && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close-circle" size={24} color="#888" />
            </TouchableOpacity>
          )} */}

          {isConfirmation ? (
            <View style={styles.rowHeader}>
              {iconName && (
                <View style={[styles.iconSmallCircle, { backgroundColor: iconBackgroundColor }]}>
                  <MaterialCommunityIcons name={iconName} size={58} color={iconColor} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { textAlign: 'left' }]}>{title}</Text>
                {message ? <Text style={[styles.alertMessage, { textAlign: 'left' }]}>{message}</Text> : null}
              </View>
            </View>
          ) : (
            <>
              {iconName && (
                <View style={[styles.iconCircle, { backgroundColor: iconBackgroundColor }]}>
                  <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
                </View>
              )}
              <Text style={styles.alertTitle}>{title}</Text>
              {message ? <Text style={styles.alertMessage}>{message}</Text> : null}
            </>
          )}

          {isConfirmation ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
                <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onClose} style={styles.alertButton}>
              <Text style={styles.alertButtonText}>{singleButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconSmallCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  alertButton: {
    backgroundColor: '#1E4064',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    minWidth: 150,
    marginTop: 18, 
    
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 18, 
    
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 17,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#28A745',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
