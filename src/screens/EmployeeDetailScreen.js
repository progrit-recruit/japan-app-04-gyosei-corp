import React from 'react';
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
import { procedures } from '../data/mockData';

export default function EmployeeDetailScreen({ lang, employee, goBack }) {
  if (!employee) return null;

  const getDaysRemaining = (dateStr) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const days = getDaysRemaining(employee.expiryDate);

  const getStatusColor = (status) => {
    if (status === 'expired') return theme.colors.danger;
    if (status === 'expiring') return theme.colors.warning;
    return theme.colors.secondary;
  };

  const getStatusLabel = (status) => {
    if (status === 'expired') return t(lang, 'expired');
    if (status === 'expiring') return t(lang, 'needs_renewal');
    return t(lang, 'normal');
  };

  const relatedProcedures = procedures.filter((p) => p.employeeId === employee.id);

  const getProcStatusColor = (s) => {
    if (s === 'in_progress') return theme.colors.warning;
    if (s === 'applied') return theme.colors.primary;
    if (s === 'completed') return theme.colors.secondary;
    return theme.colors.textLight;
  };

  const getProcStatusLabel = (s) => {
    if (s === 'in_progress') return t(lang, 'in_progress');
    if (s === 'applied') return t(lang, 'applied');
    if (s === 'completed') return t(lang, 'completed');
    return s;
  };

  const documents = [
    { icon: 'card', label: t(lang, 'resident_card') },
    { icon: 'book', label: t(lang, 'passport') },
    { icon: 'medical', label: t(lang, 'insurance_card') },
    { icon: 'document-text', label: t(lang, 'employment_contract') },
  ];

  const statusColor = getStatusColor(employee.status);

  return (
    <View style={styles.container}>
      {/* Header with Back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{employee.name}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <Text style={styles.flagLarge}>{employee.flag}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{employee.name}</Text>
              <Text style={styles.profileNationality}>
                {t(lang, 'nationality')}: {employee.nationality}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {getStatusLabel(employee.status)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Visa Info Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'visa_type')}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="card-outline" size={18} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t(lang, 'visa_type')}</Text>
                <Text style={styles.infoValue}>{employee.visaType}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t(lang, 'expiry_date')}</Text>
                <Text style={styles.infoValue}>{employee.expiryDate}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Countdown */}
            <View style={styles.countdownWrap}>
              <Text style={styles.countdownLabel}>{t(lang, 'days_remaining')}</Text>
              <Text style={[styles.countdownValue, { color: statusColor }]}>
                {days > 0 ? `${days}` : '0'}
              </Text>
              <Text style={[styles.countdownUnit, { color: statusColor }]}>
                {t(lang, 'days')}
              </Text>
              {days <= 0 && (
                <View style={[styles.expiredBadge, { backgroundColor: theme.colors.danger }]}>
                  <Text style={styles.expiredText}>{t(lang, 'expired')}</Text>
                </View>
              )}
            </View>

            {/* Progress Bar */}
            {days > 0 && (
              <View style={styles.progressWrap}>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: statusColor,
                        width: `${Math.min(100, Math.max(0, (days / 365) * 100))}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Related Procedures */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'related_procedures')}</Text>
          {relatedProcedures.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="document-outline" size={28} color={theme.colors.textLight} />
              <Text style={styles.emptyText}>手続きなし</Text>
            </View>
          ) : (
            relatedProcedures.map((p) => (
              <View key={p.id} style={styles.procCard}>
                <View style={styles.procLeft}>
                  <Ionicons name="document-text-outline" size={18} color={theme.colors.primary} />
                  <View>
                    <Text style={styles.procType}>{p.type}</Text>
                    <Text style={styles.procDeadline}>
                      {t(lang, 'deadline')}: {p.deadline}
                    </Text>
                    <Text style={styles.procAssigned}>
                      {t(lang, 'assigned_to')}: {p.assignedTo}
                    </Text>
                  </View>
                </View>
                <View style={[styles.procBadge, { backgroundColor: getProcStatusColor(p.status) + '18' }]}>
                  <Text style={[styles.procBadgeText, { color: getProcStatusColor(p.status) }]}>
                    {getProcStatusLabel(p.status)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'documents')}</Text>
          <View style={styles.docsGrid}>
            {documents.map((doc, i) => (
              <View key={i} style={styles.docCard}>
                <Ionicons name={doc.icon} size={24} color={theme.colors.primary} />
                <Text style={styles.docLabel}>{doc.label}</Text>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.secondary} style={styles.docCheck} />
              </View>
            ))}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: theme.colors.primary,
    padding: 20,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagLarge: {
    fontSize: 36,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: '#fff',
  },
  profileNationality: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 10,
  },
  countdownWrap: {
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  countdownLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginRight: 8,
  },
  countdownValue: {
    fontSize: 40,
    fontWeight: '800',
  },
  countdownUnit: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  expiredBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
    alignSelf: 'center',
  },
  expiredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  progressWrap: {
    marginTop: 4,
  },
  progressBg: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  procCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  procLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  procType: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  procDeadline: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  procAssigned: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 1,
  },
  procBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  procBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  docsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  docCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '47%',
    gap: 6,
    position: 'relative',
  },
  docLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  docCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
