import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModelCatalogItem, DownloadedModel } from '../types';
import { strings } from '../constants/strings';
import { useThemeColors } from '../store/useThemeColors';

interface Props {
  model: ModelCatalogItem;
  downloadState?: DownloadedModel;
  isActive: boolean;
  onDownload: () => void;
  onPause: () => void;
  onResume: () => void;
  onDelete: () => void;
  onSetActive: () => void;
}

export function ModelCard({
  model,
  downloadState,
  isActive,
  onDownload,
  onPause,
  onResume,
  onDelete,
  onSetActive,
}: Props) {
  const colors = useThemeColors();
  const status = downloadState?.status ?? 'not_downloaded';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: colors.text }]}>{model.name}</Text>
        {isActive && (
          <View style={[styles.activeBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.activeBadgeText}>{strings.models.active}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {model.description}
      </Text>

      <View style={styles.metaRow}>
        <Text style={[styles.metaItem, { color: colors.textMuted }]}>
          {strings.models.size}: {(model.sizeMB / 1024).toFixed(1)} GB
        </Text>
        <Text style={[styles.metaItem, { color: colors.textMuted }]}>
          {strings.models.context}: {model.contextLength}
        </Text>
        {model.supportsVision && (
          <Text style={[styles.metaItem, { color: colors.textMuted }]}>
            {strings.models.vision}
          </Text>
        )}
      </View>

      {status === 'downloading' && (
        <View style={styles.progressRow}>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${Math.round((downloadState?.progress ?? 0) * 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
            {Math.round((downloadState?.progress ?? 0) * 100)}%
          </Text>
        </View>
      )}

      <View style={styles.actionsRow}>
        {status === 'not_downloaded' || status === 'error' ? (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={onDownload}
          >
            <Ionicons name="download-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>{strings.models.download}</Text>
          </TouchableOpacity>
        ) : status === 'downloading' ? (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surfaceElevated }]}
            onPress={onPause}
          >
            <Ionicons name="pause" size={16} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              {strings.models.pause}
            </Text>
          </TouchableOpacity>
        ) : status === 'paused' ? (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={onResume}
          >
            <Ionicons name="play" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>{strings.models.resume}</Text>
          </TouchableOpacity>
        ) : (
          <>
            {!isActive && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={onSetActive}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>
                  {strings.models.setActive}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surfaceElevated }]}
              onPress={onDelete}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={[styles.actionButtonText, { color: colors.danger }]}>
                {strings.models.delete}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: 11,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
