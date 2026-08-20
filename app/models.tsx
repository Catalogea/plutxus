import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MODEL_CATALOG } from '../constants/models';
import { strings } from '../constants/strings';
import { ModelCard } from '../components/ModelCard';
import { useAppStore } from '../store/useAppStore';
import { useThemeColors } from '../store/useThemeColors';

export default function ModelsScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const downloadedModels = useAppStore((s) => s.downloadedModels);
  const activeModelId = useAppStore((s) => s.activeModelId);
  const downloadModel = useAppStore((s) => s.downloadModel);
  const pauseModelDownload = useAppStore((s) => s.pauseModelDownload);
  const resumeModelDownload = useAppStore((s) => s.resumeModelDownload);
  const deleteModel = useAppStore((s) => s.deleteModel);
  const setActiveModel = useAppStore((s) => s.setActiveModel);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {strings.models.title}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={MODEL_CATALOG}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <ModelCard
            model={item}
            downloadState={downloadedModels[item.id]}
            isActive={activeModelId === item.id}
            onDownload={() => downloadModel(item.id)}
            onPause={() => pauseModelDownload(item.id)}
            onResume={() => resumeModelDownload(item.id)}
            onDelete={() => deleteModel(item.id)}
            onSetActive={() => setActiveModel(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
});
