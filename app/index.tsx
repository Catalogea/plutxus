import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sidebar } from '../components/Sidebar';
import { MessageBubble } from '../components/MessageBubble';
import { ModelSelector } from '../components/ModelSelector';
import { strings } from '../constants/strings';
import { useChatStore } from '../store/useChatStore';
import { useThemeColors } from '../store/useThemeColors';
import { useAppStore } from '../store/useAppStore';

export default function ChatScreen() {
  const colors = useThemeColors();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const currentChatId = useChatStore((s) => s.currentChatId);
  const messagesByChat = useChatStore((s) => s.messagesByChat);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const createNewChat = useChatStore((s) => s.createNewChat);
  const activeModelId = useAppStore((s) => s.activeModelId);
  const isModelLoading = useAppStore((s) => s.isModelLoading);

  const messages = currentChatId ? messagesByChat[currentChatId] ?? [] : [];

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    const text = input;
    setInput('');
    sendMessage(text);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {strings.appName}
        </Text>
        <TouchableOpacity onPress={() => createNewChat()}>
          <Ionicons name="create-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarEmoji}>🦎</Text>
          </View>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {strings.chat.emptyStateTitle}
          </Text>
          {!activeModelId && (
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
              {strings.chat.noModelDownloaded}
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={{ paddingVertical: 12 }}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      {isModelLoading && (
        <View style={styles.loadingBanner}>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            Cargando modelo...
          </Text>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.inputBar,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="attach" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={strings.chat.inputPlaceholder}
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
          />

          <ModelSelector />

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: input.trim() ? colors.primary : colors.border },
            ]}
            onPress={handleSend}
            disabled={!input.trim() || isGenerating}
          >
            <Ionicons name="arrow-up" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    textAlign: 'center',
  },
  loadingBanner: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconButton: {
    paddingBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
