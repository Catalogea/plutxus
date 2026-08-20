import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MODEL_CATALOG } from '../constants/models';
import { strings } from '../constants/strings';
import { useAppStore } from '../store/useAppStore';
import { useThemeColors } from '../store/useThemeColors';

export function ModelSelector() {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);
  const activeModelId = useAppStore((s) => s.activeModelId);
  const downloadedModels = useAppStore((s) => s.downloadedModels);
  const setActiveModel = useAppStore((s) => s.setActiveModel);

  const downloadedList = useMemo(
    () =>
      MODEL_CATALOG.filter(
        (m) => downloadedModels[m.id]?.status === 'downloaded'
      ),
    [downloadedModels]
  );

  const activeModel = MODEL_CATALOG.find((m) => m.id === activeModelId);

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, { borderColor: colors.border }]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.triggerText, { color: colors.text }]} numberOfLines={1}>
          {activeModel ? activeModel.name : strings.chat.noModelSelected}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              {strings.chat.selectModel}
            </Text>
            {downloadedList.length === 0 ? (
              <Text style={{ color: colors.textSecondary, padding: 16 }}>
                {strings.chat.noModelDownloaded}
              </Text>
            ) : (
              downloadedList.map((model) => (
                <TouchableOpacity
                  key={model.id}
                  style={styles.item}
                  onPress={() => {
                    setActiveModel(model.id);
                    setOpen(false);
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 15 }}>
                    {model.name}
                  </Text>
                  {activeModelId === model.id && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 140,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
