import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { strings } from '../constants/strings';
import { useChatStore } from '../store/useChatStore';
import { useThemeColors } from '../store/useThemeColors';
import { useAppStore } from '../store/useAppStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function Sidebar({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const router = useRouter();
  const chats = useChatStore((s) => s.chats);
  const currentChatId = useChatStore((s) => s.currentChatId);
  const openChat = useChatStore((s) => s.openChat);
  const createNewChat = useChatStore((s) => s.createNewChat);
  const removeChat = useChatStore((s) => s.removeChat);
  const renameCurrentChat = useChatStore((s) => s.renameCurrentChat);
  const userProfile = useAppStore((s) => s.userProfile);

  const [chatsExpanded, setChatsExpanded] = useState(true);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlayRow}>
        <SafeAreaView
          style={[styles.sidebar, { backgroundColor: colors.surface }]}
          edges={['top', 'bottom']}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.appName, { color: colors.text }]}>plutxus</Text>
            <TouchableOpacity
              onPress={() => {
                createNewChat();
                onClose();
              }}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }}>
            {/* Modelos */}
            <TouchableOpacity
              style={styles.sectionRow}
              onPress={() => {
                onClose();
                router.push('/models');
              }}
            >
              <View style={styles.sectionLabel}>
                <Ionicons name="cube-outline" size={17} color={colors.textSecondary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {strings.sidebar.models}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Proyectos */}
            <TouchableOpacity
              style={styles.sectionRow}
              onPress={() => setProjectsExpanded((v) => !v)}
            >
              <View style={styles.sectionLabel}>
                <Ionicons name="folder-outline" size={17} color={colors.textSecondary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {strings.sidebar.projects}
                </Text>
              </View>
              <View style={styles.rowRight}>
                <TouchableOpacity hitSlop={8}>
                  <Ionicons name="add" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                <Ionicons
                  name={projectsExpanded ? 'chevron-down' : 'chevron-forward'}
                  size={16}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
            {projectsExpanded && (
              <Text style={[styles.emptyHint, { color: colors.textMuted }]}>
                Próximamente
              </Text>
            )}

            {/* Chats */}
            <TouchableOpacity
              style={styles.sectionRow}
              onPress={() => setChatsExpanded((v) => !v)}
            >
              <View style={styles.sectionLabel}>
                <Ionicons name="chatbubble-outline" size={17} color={colors.textSecondary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {strings.sidebar.chats}
                </Text>
              </View>
              <Ionicons
                name={chatsExpanded ? 'chevron-down' : 'chevron-forward'}
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {chatsExpanded &&
              chats.map((chat) => (
                <View key={chat.id} style={styles.chatItemWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.chatItem,
                      chat.id === currentChatId && {
                        backgroundColor: colors.surfaceElevated,
                      },
                    ]}
                    onPress={() => {
                      openChat(chat.id);
                      onClose();
                    }}
                  >
                    <Text
                      style={[styles.chatTitle, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {chat.title}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    hitSlop={8}
                    onPress={() =>
                      setMenuOpenFor(menuOpenFor === chat.id ? null : chat.id)
                    }
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>

                  {menuOpenFor === chat.id && (
                    <View
                      style={[
                        styles.chatMenu,
                        { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.chatMenuItem}
                        onPress={() => {
                           renameCurrentChat(chat.id, `${chat.title} · editado`);
                          setMenuOpenFor(null);
                        }}
                      >
                        <Text style={{ color: colors.text }}>
                          {strings.sidebar.rename}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.chatMenuItem}
                        onPress={() => {
                          removeChat(chat.id);
                          setMenuOpenFor(null);
                        }}
                      >
                        <Text style={{ color: colors.danger }}>
                          {strings.sidebar.delete}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
          </ScrollView>

          {/* Footer */}
          <TouchableOpacity
            style={[styles.footer, { borderTopColor: colors.border }]}
            onPress={() => {
              onClose();
              router.push('/settings');
            }}
          >
            <View style={styles.avatar}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>
                {(userProfile.nickname || 'P').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.footerName, { color: colors.text }]}>
              {userProfile.nickname || 'Usuario'}
            </Text>
            <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </SafeAreaView>

        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    width: '68%',
    maxWidth: 320,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emptyHint: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 12,
  },
  chatItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  chatItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  chatTitle: {
    fontSize: 14,
  },
  chatMenu: {
    position: 'absolute',
    right: 16,
    top: 36,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    zIndex: 10,
  },
  chatMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8C7BC9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
