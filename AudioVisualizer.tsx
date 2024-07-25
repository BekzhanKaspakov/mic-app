import {InputAudioStream} from '@dr.pogodin/react-native-audio';
import React, {useRef, useState} from 'react';
import {View, Text} from 'react-native';
import {Svg, Line} from 'react-native-svg';

interface AudioVisualizerProps {
  stream: InputAudioStream;
  updateInterval?: number;
}

const AudioVisualizer = ({
  stream,
  updateInterval = 10,
}: AudioVisualizerProps) => {
  const [volumeData, setVolumeData] = useState<number[]>([]);
  const volumeDataRef = useRef<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  stream.addChunkListener(chunk => {
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        const newVolumeData = [...volumeData, calculateVolume(chunk)];
        volumeDataRef.current = [...volumeDataRef.current, ...newVolumeData];
        setVolumeData([...volumeDataRef.current]);
        timeoutRef.current = null;
      }, updateInterval);
    }
    // Pause the stream for the chunk processing. The point is: if your chunk
    // processing in this function is too slow, and chunks arrive faster than
    // this callback is able to handle them, it will rapidly crash the app,
    // with out of memory error. Muting the stream ignores any new chunks
    // until stream.unmute() is called, thus protecting from the crash.
    // And if your chunk processing is rapid enough, not chunks won't be
    // skipped. The "chunkId" argument is just sequential chunk numbers,
    // by which you may judge whether any chunks have been skipped between
    // this callback calls or not.
    stream.mute();

    // Do something with the chunk.

    // Resumes the stream.
    stream.unmute();
  });

  const calculateVolume = (chunk: Buffer) => {
    let sum = 0;
    for (let i = 0; i < chunk.length; i += 2) {
      const value = chunk.readInt16LE(i);
      sum += Math.abs(value);
    }
    return sum / (chunk.length / 2);
  };

  const renderLines = () => {
    const maxVolume = Math.max(...volumeData);
    const normalizedData = volumeData.map(v => (v / maxVolume) * 100);
    return normalizedData.map((value, index) => (
      <Line
        key={index}
        x1={index * 5}
        y1={100}
        x2={index * 5}
        y2={100 - value}
        stroke="blue"
        strokeWidth="2"
      />
    ));
  };

  return (
    <View>
      <Text>Audio Visualizer</Text>
      <Svg height="100" width="100%">
        {renderLines()}
      </Svg>
    </View>
  );
};

export default AudioVisualizer;
