import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { t } from '../i18n';
import { complianceItems as initialItems } from '../data/mockData';

export default function ComplianceScreen({ lang }) {
  const [items, setItems] = useState(initialItems);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: !item.status } : item))
    );
  };

  const completedCount = items.filter((i) => i.status).length;
  const totalCount = items.length;
  const score = Math.round((completedCount / totalCount) * 100);

  const getScoreColor = () => {
    if (score >= 80) return theme.colors.secondary;
    if (score >= 50) return theme.colors.warning;
    return theme.colors.danger;
  };

  const scoreColor = getScoreColor();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t(lang, 'compliance')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreCardTitle}>{t(lang, 'compliance_score')}</Text>

          {/* Circular-ish Score Display */}
          <View style={styles.scoreCircleWrap}>
            <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
              <Text style={[styles.scorePercent, { color: scoreColor }]}>%</Text>
            </View>
          </View>

          <Text style={styles.scoreSubText}>
            {completedCount} / {totalCount} {t(lang, 'requirements')}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${score}%`, backgroundColor: scoreColor },
              ]}
            />
          </View>

          {/* Score Message */}
          <View style={[styles.scoreMsgWrap, { backgroundColor: scoreColor + '14' }]}>
            <Ionicons
              name={score >= 80 ? 'checkmark-circle' : score >= 50 ? 'warning' : 'alert-circle'}
              size={18}
              color={scoreColor}
            />
            <Text style={[styles.scoreMsg, { color: scoreColor }]}>
              {score >= 80
                ? lang === 'ja' ? '良好なコンプライアンス状態です' : 'Good compliance status'
                : score >= 50
                ? lang === 'ja' ? '一部改善が必要です' : 'Some improvements needed'
                : lang === 'ja' ? '早急な対応が必要です' : 'Urgent action required'}
            </Text>
          </View>
        </View>

        {/* Checklist */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t(lang, 'requirements')}</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{completedCount}/{totalCount}</Text>
            </View>
          </View>

          {/* Completed Items */}
          <Text style={styles.groupLabel}>
            {lang === 'ja' ? '達成済み' : 'Completed'}
          </Text>
          {items.filter((i) => i.status).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.checkItem, styles.checkItemOk]}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkBox, styles.checkBoxChecked]}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
              <Text style={styles.checkText}>{item.requirement}</Text>
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.secondary} />
            </TouchableOpacity>
          ))}

          {/* Incomplete Items */}
          {items.filter((i) => !i.status).length > 0 && (
            <>
              <Text style={[styles.groupLabel, { color: theme.colors.danger, marginTop: 12 }]}>
                {t(lang, 'issue_found')}
              </Text>
              {items.filter((i) => !i.status).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.checkItem, styles.checkItemNG]}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkBox, styles.checkBoxUnchecked]}>
                    <Ionicons name="close" size={14} color={theme.colors.danger} />
                  </View>
                  <Text style={[styles.checkText, styles.checkTextNG]}>{item.requirement}</Text>
                  <Ionicons name="alert-circle" size={18} color={theme.colors.danger} />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={16} color={theme.colors.textLight} />
          <Text style={styles.infoNoteText}>
            {lang === 'ja'
              ? '各項目をタップして達成状況を更新できます'
              : 'Tap each item to update its completion status'}
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scoreCard: {
    margin: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreCardTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 16,
  },
  scoreCircleWrap: {
    marginBottom: 12,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 52,
  },
  scorePercent: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  scoreSubText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: 16,
  },
  progressBg: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreMsgWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    width: '100%',
  },
  scoreMsg: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  sectionBadgeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: '#fff',
  },
  groupLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginBottom: 8,
    marginLeft: 2,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    gap: 12,
  },
  checkItemOk: {
    borderColor: theme.colors.secondary + '40',
  },
  checkItemNG: {
    borderColor: theme.colors.danger + '40',
    backgroundColor: '#FEF2F2',
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxChecked: {
    backgroundColor: theme.colors.secondary,
  },
  checkBoxUnchecked: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  checkText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '500',
  },
  checkTextNG: {
    color: theme.colors.danger,
    fontWeight: '600',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  infoNoteText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    flex: 1,
  },
});
