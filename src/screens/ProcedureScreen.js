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
import { procedures, employees } from '../data/mockData';

const STATUS_FILTERS = ['all', 'in_progress', 'applied', 'completed'];

export default function ProcedureScreen({ lang, navigate }) {
  const [filter, setFilter] = useState('all');

  const getEmployee = (id) => employees.find((e) => e.id === id);

  const getStatusColor = (s) => {
    if (s === 'in_progress') return theme.colors.warning;
    if (s === 'applied') return theme.colors.primary;
    if (s === 'completed') return theme.colors.secondary;
    return theme.colors.textLight;
  };

  const getStatusLabel = (s) => {
    if (s === 'in_progress') return t(lang, 'in_progress');
    if (s === 'applied') return t(lang, 'applied');
    if (s === 'completed') return t(lang, 'completed');
    return s;
  };

  const getFilterLabel = (f) => {
    if (f === 'all') return t(lang, 'all');
    return getStatusLabel(f);
  };

  const getStatusIcon = (s) => {
    if (s === 'in_progress') return 'time-outline';
    if (s === 'applied') return 'paper-plane-outline';
    if (s === 'completed') return 'checkmark-circle-outline';
    return 'ellipse-outline';
  };

  const filtered = filter === 'all' ? procedures : procedures.filter((p) => p.status === filter);

  const isOverdue = (deadline) => {
    const today = new Date();
    const d = new Date(deadline);
    return d < today;
  };

  const statusCounts = {
    in_progress: procedures.filter((p) => p.status === 'in_progress').length,
    applied: procedures.filter((p) => p.status === 'applied').length,
    completed: procedures.filter((p) => p.status === 'completed').length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t(lang, 'procedures')}</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Row */}
        <View style={styles.summaryRow}>
          {[
            { key: 'in_progress', icon: 'time', color: theme.colors.warning },
            { key: 'applied', icon: 'paper-plane', color: theme.colors.primary },
            { key: 'completed', icon: 'checkmark-circle', color: theme.colors.secondary },
          ].map((item) => (
            <View key={item.key} style={styles.summaryCard}>
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={[styles.summaryCount, { color: item.color }]}>{statusCounts[item.key]}</Text>
              <Text style={styles.summaryLabel}>{getStatusLabel(item.key)}</Text>
            </View>
          ))}
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {getFilterLabel(f)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Procedure Cards */}
        <View style={styles.cardList}>
          {filtered.map((proc) => {
            const emp = getEmployee(proc.employeeId);
            const overdue = isOverdue(proc.deadline) && proc.status !== 'completed';
            return (
              <View key={proc.id} style={[styles.procCard, overdue && styles.procCardOverdue]}>
                {/* Top Row */}
                <View style={styles.procTop}>
                  <View style={styles.procIconWrap}>
                    <Ionicons name={getStatusIcon(proc.status)} size={20} color={getStatusColor(proc.status)} />
                  </View>
                  <Text style={styles.procType}>{proc.type}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(proc.status) + '18' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(proc.status) }]}>
                      {getStatusLabel(proc.status)}
                    </Text>
                  </View>
                </View>

                {/* Info Rows */}
                <View style={styles.procMeta}>
                  {emp && (
                    <View style={styles.metaRow}>
                      <Ionicons name="person-outline" size={14} color={theme.colors.textLight} />
                      <Text style={styles.metaText}>
                        {emp.flag} {emp.name}
                      </Text>
                    </View>
                  )}
                  <View style={styles.metaRow}>
                    <Ionicons name="person-circle-outline" size={14} color={theme.colors.textLight} />
                    <Text style={styles.metaText}>
                      {t(lang, 'assigned_to')}: {proc.assignedTo}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={overdue ? theme.colors.danger : theme.colors.textLight}
                    />
                    <Text style={[styles.metaText, overdue && styles.metaTextOverdue]}>
                      {t(lang, 'deadline')}: {proc.deadline}
                      {overdue && ' ⚠️'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
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
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  summaryCount: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 10,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  cardList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  procCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  procCardOverdue: {
    borderColor: theme.colors.danger + '60',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.danger,
  },
  procTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  procIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  procType: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  procMeta: {
    gap: 5,
    paddingLeft: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  metaTextOverdue: {
    color: theme.colors.danger,
    fontWeight: '600',
  },
});
