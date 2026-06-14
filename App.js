import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import MainApp from './src/screens/MainApp';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lang, setLang] = useState('ja');

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={() => setIsLoggedIn(true)} setLang={setLang} lang={lang} />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      <MainApp lang={lang} />
      <StatusBar style="auto" />
    </>
  );
}
