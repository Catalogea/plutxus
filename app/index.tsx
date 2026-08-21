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
import { StarField } from '../components/StarField';

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StarField />
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSidebarOpen(true)}>
              <Ionicons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>plutxus</Text>
            <TouchableOpacity onPress={() => createNewChat()}>
              <Ionicons name="create-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.mascot}>
                <View style={styles.mascotGlow} />
                <View style={styles.mascotBody}>
                  <View style={styles.mascotEye} />
                  <View style={[styles.mascotEye, { marginLeft: 10 }]} />
                </View>
                <View style={styles.mascotTail} />
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
              style={styles.messageList}
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
          <View
            style={[
              styles.inputBar,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
              <Ionicons name="attach" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
              <Ionicons name="globe-outline" size={18} color={colors.textSecondary} />
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
        </View>
      </KeyboardAvoidingView>

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  messageList: {
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
    gap: 14,
  },
  mascot: {
    width: 120, height: 120, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  mascotGlow: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#403563', opacity: 0.28,
  },
  mascotBody: {
    width: 68, height: 84, borderRadius: 38, backgroundColor: '#C4B7FF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  mascotEye: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: '#171529',
    marginLeft: -10, marginTop: -8,
  },
  mascotTail: {
    position: 'absolute', width: 34, height: 50, borderLeftWidth: 8,
    borderBottomWidth: 8, borderColor: '#A99AE8', borderBottomLeftRadius: 26,
    left: 18, bottom: 12, transform: [{ rotate: '18deg' }],
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
