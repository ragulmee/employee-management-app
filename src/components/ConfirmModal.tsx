import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ visible, title = "Confirm", message = "Are you sure?", onConfirm, onCancel }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.confirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  message: { color: "#6b7280", marginBottom: 14 },
  row: { flexDirection: "row", justifyContent: "flex-end" },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginLeft: 8 },
  cancel: { backgroundColor: "#f3f4f6" },
  confirm: { backgroundColor: "#fee2e2" },
  cancelText: { color: "#111827" },
  confirmText: { color: "#b91c1c", fontWeight: "700" },
});
