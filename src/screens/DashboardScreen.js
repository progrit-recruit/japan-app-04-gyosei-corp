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
import { employees, procedures } from '../data/mockData';

export default function DashboardScreen({ lang, navigate }) {
  const alertEmployees = employees.filter(
    (e) => e.status === 'expiring' || e.status === 'expired'
  );
  const thisMonthProcedures = procedures.filter(
    (p) => p.status === 'in_progress' || p.status === 'applied'
  );
  const expiringCount = alertEmployees.length;

  const getDaysRemaining = (dateStr) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

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

  const stats = [
    {
      label: t(lang, 'total_employees'),
      value: employees.length,
      icon: 'people',
      color: theme.colors.primary,
      bg: '#EFF6FF',
    },
    {
      label: t(lang, 'this_month_procedures'),
      value: thisMonthProcedures.length,
      icon: 'document-text',
      color: theme.colors.secondary,
      bg: '#ECFDF5',
    },
    {
      label: t(lang, 'expiring_soon'),
      value: expiringCount,
      icon: 'warning',
      color: theme.colors.danger,
      bg: '#FEF2F2',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>手続き管理</Text>
          <Text style={styles.headerSub}>for Business</Text>
        </View>
        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={22} color={theme.colors.primary} />
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
            <View style={[styles.statIconWrap, { backgroundColor: s.color + '22' }]}>
              <Ionicons name={s.icon} size={22} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Alert Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="alert-circle" size={18} color={theme.colors.danger} />
          <Text style={styles.sectionTitle}>{t(lang, 'expiry_alert')}</Text>
        </View>

        {alertEmployees.map((emp) => {
          const days = getDaysRemaining(emp.expiryDate);
          return (
            <TouchableOpacity
              key={emp.id}
              style={styles.alertCard}
              onPress={() => navigate('EmployeeDetail', { employee: emp })}
              activeOpacity={0.8}
            >
              <View style={styles.alertLeft}>
                <Text style={styles.alertFlag}>{emp.flag}</Text>
                <View>
                  <Text style={styles.alertName}>{emp.name}</Text>
                  <Text style={styles.alertVisa}>{emp.visaType}</Text>
                </View>
              </View>
              <View style={styles.alertRight}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(emp.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(emp.status) }]}>
                    {getStatusLabel(emp.status)}
                  </Text>
                </View>
                <Text style={[styles.daysText, { color: getStatusColor(emp.status) }]}>
                  {days > 0 ? `${days}${t(lang, 'days')}` : t(lang, 'expired')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t(lang, 'quick_actions')}</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <View style={styles.actionIcon}>
              <Ionicons name="person-add" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>{t(lang, 'add_employee')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <View style={styles.actionIcon}>
              <Ionicons name="document-text" size={24} color={theme.colors.secondary} />
            </View>
            <Text style={styles.actionText}>{t(lang, 'new_procedure')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  headerSub: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    padding: 12,
    alignItems: 'center',
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 10,
  },
  alertCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  alertFlag: {
    fontSize: 24,
  },
  alertName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  alertVisa: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  alertRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  daysText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
});
