/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useMemo} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {
  AUDIO_FORMATS,
  AUDIO_SOURCES,
  CHANNEL_CONFIGS,
  InputAudioStream,
} from '@dr.pogodin/react-native-audio';
import AudioVisualizer from './AudioVisualizer';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const stream = useMemo(() => {
    return new InputAudioStream(
      AUDIO_SOURCES.RAW,
      44100, // Sample rate in Hz.
      CHANNEL_CONFIGS.MONO,
      AUDIO_FORMATS.PCM_16BIT,
      4096, // Sampling size.
    );
  }, []);
  stream.addErrorListener(error => {
    // Do something with a stream error.
    console.log(error);
  });

  useEffect(() => {}, [stream]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <AudioVisualizer stream={stream} />
      <Button
        title="Start"
        onPress={() => {
          if (!stream.active) {
            stream.start();
          } else if (stream.muted) {
            stream.unmute();
          }
        }}
      />
      <Button
        title="Stop"
        onPress={() => {
          stream.mute();
        }}
      />
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {'asd'}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
