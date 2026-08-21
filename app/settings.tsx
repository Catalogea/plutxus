import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { strings } from '../constants/strings';
import { useAppStore } from '../store/useAppStore';
import { useThemeColors } from '../store/useThemeColors';
import { AppearanceMode, AppLanguage } from '../types';

function SectionHeader({
  title,
  icon,
  expanded,
  onToggle,
  collapsible = true,
}: {
  title: string;
  icon: 'sunny-outline' | 'language-outline' | 'person-outline' | 'options-outline' | 'key-outline';
  expanded?: boolean;
  onToggle?: () => void;
  collapsible?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={onToggle}
      disabled={!collapsible}
      activeOpacity={collapsible ? 0.6 : 1}
    >
      <View style={styles.sectionLabel}>
        <Ionicons name={icon} size={18} color={colors.text} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {collapsible && (
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-forward'}
          size={16}
          color={colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const appearance = useAppStore((s) => s.appearance);
  const setAppearance = useAppStore((s) => s.setAppearance);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const userProfile = useAppStore((s) => s.userProfile);
  const setUserProfile = useAppStore((s) => s.setUserProfile);

  const [aboutYouExpanded, setAboutYouExpanded] = useState(true);
  const [modelsExpanded, setModelsExpanded] = useState(false);
  const [apiKeysExpanded, setApiKeysExpanded] = useState(false);

  const [nickname, setNickname] = useState(userProfile.nickname);
  const [occupation, setOccupation] = useState(userProfile.occupation);
  const [passions, setPassions] = useState(userProfile.passions);

  const saveProfile = () => {
    setUserProfile({ nickname, occupation, passions });
  };

  const appearanceOptions: { key: AppearanceMode; label: string }[] = [
    { key: 'light', label: strings.settings.light },
    { key: 'dark', label: strings.settings.dark },
    { key: 'auto', label: strings.settings.auto },
  ];

  const languageOptions: { key: AppLanguage; label: string }[] = [
    { key: 'system', label: strings.settings.system },
    { key: 'es', label: strings.settings.spanish },
  ];

  return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {strings.settings.title}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Apariencia */}
        <SectionHeader
          title={strings.settings.appearance}
          icon="sunny-outline"
          collapsible={false}
        />
        <View style={styles.segmentRow}>
          {appearanceOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.segmentButton,
                {
                  backgroundColor:
                    appearance === opt.key ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setAppearance(opt.key)}
            >
              <Text
                style={{
                  color: appearance === opt.key ? '#fff' : colors.text,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Idioma */}
        <SectionHeader
          title={strings.settings.language}
          icon="language-outline"
          collapsible={false}
        />
        <View style={styles.segmentRow}>
          {languageOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.segmentButton,
                {
                  backgroundColor:
                    language === opt.key ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setLanguage(opt.key)}
            >
              <Text
                style={{
                  color: language === opt.key ? '#fff' : colors.text,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.segmentButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
              {strings.settings.more}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Sobre Ti */}
        <SectionHeader
          title={`${strings.settings.aboutYou} · ${strings.settings.aboutYouSubtitle}`}
          icon="person-outline"
          expanded={aboutYouExpanded}
          onToggle={() => setAboutYouExpanded((v) => !v)}
        />
        {aboutYouExpanded && (
          <View style={styles.formSection}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {strings.settings.nickname}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
              ]}
              value={nickname}
              onChangeText={setNickname}
              onBlur={saveProfile}
              placeholder={strings.settings.nickname}
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {strings.settings.occupation}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
              ]}
              value={occupation}
              onChangeText={setOccupation}
              onBlur={saveProfile}
              placeholder={strings.settings.occupation}
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {strings.settings.passions}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                styles.multiline,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
              ]}
              value={passions}
              onChangeText={setPassions}
              onBlur={saveProfile}
              placeholder={strings.settings.passions}
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>
        )}

        {/* Modelos */}
        <SectionHeader
          title={strings.settings.models}
          icon="options-outline"
          expanded={modelsExpanded}
          onToggle={() => setModelsExpanded((v) => !v)}
        />
        {modelsExpanded && (
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/models')}
          >
            <Text style={{ color: colors.text }}>{strings.models.title}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* API Keys */}
        <SectionHeader
          title={strings.settings.apiKeys}
          icon="key-outline"
          expanded={apiKeysExpanded}
          onToggle={() => setApiKeysExpanded((v) => !v)}
        />
        {apiKeysExpanded && (
          <View style={styles.formSection}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              {strings.settings.apiKeysComingSoon}
            </Text>
          </View>
        )}

        {/* Ítems simples */}
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity style={styles.linkRow}>
            <View style={styles.linkLabel}>
              <Ionicons name="sparkles-outline" size={18} color={colors.text} />
              <Text style={{ color: colors.text }}>{strings.settings.meetCreator}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <View style={styles.linkLabel}>
              <Ionicons name="heart-outline" size={18} color={colors.text} />
              <Text style={{ color: colors.text }}>{strings.settings.supportProject}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <View style={styles.linkLabel}>
              <Ionicons name="star-outline" size={18} color={colors.text} />
              <Text style={{ color: colors.text }}>{strings.settings.rateApp}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    letterSpacing: 0.2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  segmentButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  formSection: {
    paddingHorizontal: 16,
    gap: 6,
  },
  label: {
    fontSize: 12,
    marginTop: 8,
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linkLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
