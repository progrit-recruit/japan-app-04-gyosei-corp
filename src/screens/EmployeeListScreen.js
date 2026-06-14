import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { t } from '../i18n';
import { employees } from '../data/mockData';

const STATUS_FILTER = ['all', 'normal', 'expiring', 'expired'];

export default function EmployeeListScreen({ lang, navigate }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    if (status === 'expired') return theme.colors.danger;
    if (status === 'expiring') return theme.colors.warning;
    return theme.colors.secondary;
  };

  const getStatusEmoji = (status) => {
    if (status === 'expired') return '🔴';
    if (status === 'expiring') return '🟡';
    return '🟢';
  };

  const getStatusLabel = (status) => {
    if (status === 'expired') return t(lang, 'expired');
    if (status === 'expiring') return t(lang, 'needs_renewal');
    return t(lang, 'normal');
  };

  const getFilterLabel = (f) => {
    if (f === 'all') return t(lang, 'all');
    return getStatusLabel(f);
  };

  const getDaysRemaining = (dateStr) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const filtered = employees.filter((e) => {
    const matchSearch =
      search === '' ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.visaType.includes(search);
    const matchFilter = filter === 'all' || e.status === filter;
    return matchSearch && matchFilter;
  });

  const renderItem = ({ item }) => {
    const days = getDaysRemaining(item.expiryDate);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigate('EmployeeDetail', { employee: item })}
        activeOpacity={0.8}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.flag}>{item.flag}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.visa}>{item.visaType}</Text>
            <Text style={styles.expiry}>
              {t(lang, 'expiry_date')}: {item.expiryDate}
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '18' }]}>
            <Text style={styles.badgeEmoji}>{getStatusEmoji(item.status)}</Text>
            <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
          <Text style={[styles.days, { color: getStatusColor(item.status) }]}>
            {days > 0 ? `${days}${t(lang, 'days')}` : t(lang, 'expired')}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.textLight} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t(lang, 'employees')}</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="person-add" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={theme.colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t(lang, 'search_placeholder')}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={theme.colors.textLight}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {STATUS_FILTER.map((f) => (
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
      </View>

      {/* Count */}
      <Text style={styles.countText}>{filtered.length}名</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    margin: 16,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  countText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
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
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  flag: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  visa: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  expiry: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 3,
  },
  badgeEmoji: {
    fontSize: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  days: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
  },
});
