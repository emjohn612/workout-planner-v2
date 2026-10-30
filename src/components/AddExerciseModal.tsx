import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../theme/theme";
import { MUSCLE_GROUPS } from "../exerciseLibrary";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (name: string, muscleGroup: string) => void;
}

const AddExerciseModal: React.FC<Props> = ({ visible, onCancel, onSubmit }) => {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<string>(MUSCLE_GROUPS[0]);

  const submit = () => {
    if (name.trim().length === 0) return;
    onSubmit(name.trim(), muscleGroup);
    setName("");
    setMuscleGroup(MUSCLE_GROUPS[0]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Custom Exercise</Text>
          <TextInput
            style={styles.input}
            placeholder="Exercise name"
            placeholderTextColor={COLORS.secondaryLightGreyHex}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Muscle group</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipRow}
          >
            {MUSCLE_GROUPS.map((group) => (
              <Pressable
                key={group}
                onPress={() => setMuscleGroup(group)}
                style={[styles.chip, muscleGroup === group && styles.chipActive]}
              >
                <Text style={styles.chipText}>{group}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            onPress={submit}
            style={[styles.submitBtn, name.trim().length === 0 && styles.disabled]}
          >
            <Text style={styles.submitText}>Add Exercise</Text>
          </Pressable>
          <Pressable onPress={onCancel} style={styles.closeBtn}>
            <FontAwesome name="close" color={COLORS.primaryRedHex} size={20} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: COLORS.primaryGreyHex,
    padding: 24,
    borderRadius: 12,
    width: "88%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: { fontSize: 22, color: COLORS.primaryRedHex, marginBottom: 15 },
  input: {
    width: "100%",
    borderColor: COLORS.primaryLightGreyHex,
    borderWidth: 1,
    padding: 10,
    color: COLORS.primaryWhiteHex,
    marginBottom: 15,
    borderRadius: 6,
  },
  label: {
    alignSelf: "flex-start",
    color: COLORS.secondaryLightGreyHex,
    marginBottom: 8,
  },
  chipRow: { flexGrow: 0, marginBottom: 20, width: "100%" },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.secondaryDarkGreyHex,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.primaryRedHex },
  chipText: { color: COLORS.primaryWhiteHex },
  submitBtn: {
    backgroundColor: COLORS.primaryRedHex,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  disabled: { opacity: 0.4 },
  submitText: { color: COLORS.primaryWhiteHex, fontSize: 18 },
  closeBtn: { marginTop: 14, padding: 4 },
});

export default AddExerciseModal;
