import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Modal,
  View,
  TextInput,
  Text,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface VoiceInputProps {
  onResult: (text: string) => void;
}

export default function VoiceInput({ onResult }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  const handleWebSpeech = useCallback(() => {
    if (typeof window === 'undefined') {
      setModalVisible(true);
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setModalVisible(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      startPulse();
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      stopPulse();
    };

    recognition.onend = () => {
      setListening(false);
      stopPulse();
    };

    recognition.start();
  }, [onResult, startPulse, stopPulse]);

  const handlePress = useCallback(() => {
    if (Platform.OS === 'web') {
      handleWebSpeech();
    } else {
      setModalVisible(true);
    }
  }, [handleWebSpeech]);

  const handleModalSubmit = useCallback(() => {
    if (inputText.trim()) {
      onResult(inputText.trim());
      setInputText('');
    }
    setModalVisible(false);
  }, [inputText, onResult]);

  return (
    <>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[styles.micButton, listening && styles.micButtonActive]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={listening ? 'mic' : 'mic-outline'}
            size={28}
            color={Colors.text}
          />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tell your story idea</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type your story idea here..."
              placeholderTextColor={Colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setInputText('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleModalSubmit}
              >
                <Text style={styles.submitText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  micButtonActive: {
    backgroundColor: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
  },
  modalTitle: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  modalInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: Spacing.md,
    color: Colors.text,
    ...Typography.body,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  submitButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  submitText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
});
