import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { getGlobalAudioContext } from "../../../../../context/SoundContext";

export function getAmbientCtx() {
  return getGlobalAudioContext();
}

interface AmbientSynthesizerProps {
  position?: [number, number, number];
  distanceFunc?: (camPos: Vector3) => number;
  type: 'blackhole' | 'lava' | 'crystal' | 'meteor' | 'asteroid' | 'cybership' | 'moon' | 'datacube';
  maxDistance?: number;
  maxVol?: number;
}

export const AmbientSynthesizer = ({
  position,
  distanceFunc,
  type,
  maxDistance = 350,
  maxVol
}: AmbientSynthesizerProps) => {
  const { camera } = useThree();
  const gainNodeRef = useRef<GainNode | null>(null);
  const targetPos = useMemo(() => position ? new Vector3(...position) : new Vector3(), [position]);
  const objRef = useRef<Group>(null);
  const worldPosRef = useRef(new Vector3());

  useEffect(() => {
    const ctx = getAmbientCtx();
    if (!ctx) return;
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    // Connect directly to destination to avoid volume collapse from global master gain
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    const nodesToDisconnect: AudioNode[] = [];

    if (type === 'blackhole') {
      // 1. Deep Sub-bass Rumble (Sawtooth + Triangle detuning for massive rolling beat)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.value = 48; // Deep rumble

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 48.5; // Slightly detuned for rolling beat

      const filterSub = ctx.createBiquadFilter();
      filterSub.type = 'lowpass';
      filterSub.frequency.value = 65; // Remove buzz, keep heavy bassgrowl

      osc1.connect(filterSub);
      osc2.connect(filterSub);
      filterSub.connect(masterGain);

      // 2. Ghostly Cosmic Howl (NASA Sonification style filtered noise)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // White noise
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Eerie resonance bandpass filter
      const filterHowl = ctx.createBiquadFilter();
      filterHowl.type = 'bandpass';
      filterHowl.frequency.value = 120;
      filterHowl.Q.value = 5.0; // High resonance creates howling whistle

      // Modulate howl frequency slowly (0.07Hz LFO) to simulate cosmic winds shifting
      const lfoHowl = ctx.createOscillator();
      lfoHowl.type = 'sine';
      lfoHowl.frequency.value = 0.07;
      
      const lfoGainHowl = ctx.createGain();
      lfoGainHowl.gain.value = 35; // Modulates 85Hz to 155Hz

      lfoHowl.connect(lfoGainHowl);
      lfoGainHowl.connect(filterHowl.frequency);

      const howlGain = ctx.createGain();
      howlGain.gain.value = 0.45; // Volume balance for howl

      noise.connect(filterHowl);
      filterHowl.connect(howlGain);
      howlGain.connect(masterGain);

      // Start all sound generators
      osc1.start();
      osc2.start();
      noise.start();
      lfoHowl.start();

      nodesToDisconnect.push(osc1, osc2, filterSub, noise, filterHowl, lfoHowl, lfoGainHowl, howlGain);
    } else if (type === 'lava' || type === 'meteor') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; 
        b6 = white * 0.115926;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = type === 'lava' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'lava' ? 150 : 800;
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = type === 'lava' ? 0.2 : 2;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = type === 'lava' ? 50 : 300;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      noiseSource.connect(filter);
      filter.connect(masterGain);
      noiseSource.start();
      lfo.start();
      nodesToDisconnect.push(noiseSource, filter, lfo, lfoGain);
    } else if (type === 'crystal') {
      const freqs = [800, 1200, 1600, 2400];
      const compGain = ctx.createGain();
      compGain.gain.value = 0.08;
      masterGain.connect(compGain);
      compGain.connect(ctx.destination);
      masterGain.disconnect(ctx.destination);
      nodesToDisconnect.push(compGain);
      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = Math.random() * 0.5 + 0.1;
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0;
        lfo.connect(oscGain.gain); 
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        lfo.start();
        nodesToDisconnect.push(osc, lfo, oscGain);
      });
    } else if (type === 'asteroid' || type === 'moon') {
      const osc = ctx.createOscillator();
      osc.type = type === 'asteroid' ? 'triangle' : 'sine';
      osc.frequency.value = type === 'asteroid' ? 60 : 150;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = type === 'asteroid' ? 0.2 : 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = type === 'asteroid' ? 20 : 50;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(masterGain);
      osc.start();
      lfo.start();
      nodesToDisconnect.push(osc, lfo, lfoGain);
    } else if (type === 'cybership') {
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.value = 150;
      
      const osc2 = ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.value = 75; // Sub-octave

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 2; // slow engine throb
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 10;
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      osc1.connect(masterGain);
      osc2.connect(masterGain);
      osc1.start();
      osc2.start();
      lfo.start();
      nodesToDisconnect.push(osc1, osc2, lfo, lfoGain);
    } else if (type === 'datacube') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Compensate for volume drop
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 300; // Deep wind

      // Modulate the filter frequency to sound like howling wind
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // Very slow howl
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 150;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      lfo.start();
      nodesToDisconnect.push(noise, filter, lfo, lfoGain);
    }

    const resumeIfSuspended = () => {
      if (ctx.state === "suspended") void ctx.resume();
    };
    document.addEventListener("click", resumeIfSuspended, { once: true });

    return () => {
      document.removeEventListener("click", resumeIfSuspended);
      masterGain.gain.value = 0;
      try { masterGain.disconnect(); } catch (e) {}
      nodesToDisconnect.forEach(n => {
        try { n.disconnect(); } catch (e){}
        if (n instanceof OscillatorNode || n instanceof AudioBufferSourceNode) {
          try { n.stop(); } catch (e){}
        }
      });
    };
  }, [type]);

  useFrame(() => {
    if (!gainNodeRef.current) return;
    const ctx = getAmbientCtx();
    if (!ctx || ctx.state !== "running") return;

    let dist = Infinity;
    if (distanceFunc) {
      dist = distanceFunc(camera.position);
    } else if (position) {
      dist = camera.position.distanceTo(targetPos);
    } else if (objRef.current) {
      objRef.current.getWorldPosition(worldPosRef.current);
      dist = camera.position.distanceTo(worldPosRef.current);
    }

    let vol = 1.0 - Math.min(dist / maxDistance, 1.0);
    vol = Math.pow(vol, 2); 
    
    let defaultVol = 0.15;
    if (type === 'blackhole') defaultVol = 1.8;
    else if (type === 'lava') defaultVol = 0.5;
    else if (type === 'meteor') defaultVol = 0.35;
    else if (type === 'asteroid') defaultVol = 0.3;
    else if (type === 'moon') defaultVol = 0.25;
    else if (type === 'cybership') defaultVol = 0.15;
    else if (type === 'datacube') defaultVol = 0.1;
    
    gainNodeRef.current.gain.setTargetAtTime(vol * (maxVol ?? defaultVol), ctx.currentTime, 0.1);
  });

  if (position || distanceFunc) return null;
  return <group ref={objRef} />;
};
export default AmbientSynthesizer;
