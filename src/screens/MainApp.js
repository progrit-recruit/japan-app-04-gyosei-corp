import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { t } from '../i18n';
import DashboardScreen from './DashboardScreen';
import EmployeeListScreen from './EmployeeListScreen';
import EmployeeDetailScreen from './EmployeeDetailScreen';
import ProcedureScreen from './ProcedureScreen';
import ComplianceScreen from './ComplianceScreen';

const TABS = [
  { key: 'dashboard', icon: 'grid-outline', activeIcon: 'grid' },
  { key: 'employees', icon: 'people-outline', activeIcon: 'people' },
  { key: 'procedures', icon: 'document-text-outline', activeIcon: 'document-text' },
  { key: 'compliance', icon: 'shield-checkmark-outline', activeIcon: 'shield-checkmark' },
];

export default function MainApp({ lang }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentScreen, setCurrentScreen] = useState(null);
  const [screenParams, setScreenParams] = useState(null);

  const navigate = (screen, params) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const goBack = () => {
    setCurrentScreen(null);
    setScreenParams(null);
  };

  const handleTabPress = (tabKey) => {
    setCurrentTab(tabKey);
    setCurrentScreen(null);
    setScreenParams(null);
  };

  const renderScreen = () => {
    if (currentScreen === 'EmployeeDetail') {
      return (
        <EmployeeDetailScreen
          lang={lang}
          employee={screenParams?.employee}
          goBack={goBack}
        />
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return <DashboardScreen lang={lang} navigate={navigate} />;
      case 'employees':
        return <EmployeeListScreen lang={lang} navigate={navigate} />;
      case 'procedures':
        return <ProcedureScreen lang={lang} navigate={navigate} />;
      case 'compliance':
        return <ComplianceScreen lang={lang} />;
      default:
        return <DashboardScreen lang={lang} navigate={navigate} />;
    }
  };

  const isDetailScreen = currentScreen !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Bar */}
      {!isDetailScreen && (
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabItem}
                onPress={() => handleTabPress(tab.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive ? theme.colors.primary : theme.colors.textLight}
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {t(lang, tab.key)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
