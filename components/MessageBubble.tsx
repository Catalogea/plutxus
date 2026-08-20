import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../types';
import { useThemeColors } from '../store/useThemeColors';

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const colors = useThemeColors();
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.container,
        { alignSelf: isUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? colors.bubbleUser : colors.bubbleAssistant,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.text }]}>
          {message.content || (message.role === 'assistant' ? '...' : '')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '85%',
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
});
