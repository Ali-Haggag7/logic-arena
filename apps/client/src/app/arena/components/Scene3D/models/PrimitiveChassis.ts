import { BoxGeometry, Color, Group, Mesh, MeshStandardMaterial } from 'three';

/**
 * Builds a procedural Three.js group shaped like a combat robot.
 *
 * IMPORTANT — do NOT set group.position or group.scale here.
 * React Three Fiber's <primitive position={...} scale={...} /> will override them.
 * Instead, all geometry is offset via an inner group so the outer group
 * origin sits exactly at the foot-of-tracks (Y = 0), ready for the Arena.
 */
export function createPrimitiveChassis(chassisId: string): Group {
  const isTitan  = chassisId.includes('titan');
  const isWraith = chassisId.includes('wraith');

  // ── Materials ─────────────────────────────────────────────────────────────
  const bodyMat = new MeshStandardMaterial({
    color: '#888888',
    metalness: 0.85,
    roughness: 0.15,
    emissive: new Color('#888888'),
    emissiveIntensity: 0.25,
  });

  const trackMat = new MeshStandardMaterial({
    color: '#222222',
    roughness: 0.9,
    metalness: 0.1,
  });

  const eyeMat = new MeshStandardMaterial({
    color: '#ffffff',
    emissive: new Color('#ffffff'),
    emissiveIntensity: 2.5,
    toneMapped: false,
  });

  // ── Geometry dimensions ────────────────────────────────────────────────────
  const bodyW  = isTitan ? 1.3  : isWraith ? 0.9  : 1.1;
  const bodyH  = isTitan ? 0.8  : isWraith ? 0.6  : 0.7;
  const bodyD  = isTitan ? 0.75 : isWraith ? 0.55 : 0.65;

  const trackW = isTitan ? 0.30 : isWraith ? 0.15 : 0.22;
  const trackH = isTitan ? 0.30 : isWraith ? 0.20 : 0.26;
  const trackD = isTitan ? 0.90 : isWraith ? 0.60 : 0.80;
  const trackX = isTitan ? 0.82 : isWraith ? 0.50 : 0.66;

  // Eye — placed on the +Z face of the body, centred
  const eyeW = isTitan ? 0.50 : isWraith ? 0.30 : 0.55;
  const eyeH = isTitan ? 0.12 : isWraith ? 0.18 : 0.14;

  // Shoulder pads — only Phantom / Titan have them
  const shlW = isTitan ? 0.35 : 0.28;
  const shlH = isTitan ? 0.50 : 0.42;
  const shlD = isTitan ? 0.60 : 0.55;
  const shlX = isTitan ? 0.85 : 0.72;

  // ── Height stack (Y, measured from track bottom = 0) ──────────────────────
  //   trackBottom  = 0
  //   trackTop     = trackH
  //   bodyCentreY  = trackH + bodyH / 2   (body sits on top of tracks)
  //   eyeY         = bodyCentreY + 0.05   (eye strip near top of body face)
  //   shlY         = bodyCentreY + 0.10   (shoulders at upper body)

  const bodyCentreY = trackH + bodyH / 2;

  // ── Inner group (all geometry offset so track-bottom = Y 0) ───────────────
  const inner = new Group();

  // 1. Tracks
  const leftTrack  = new Mesh(new BoxGeometry(trackW, trackH, trackD), trackMat);
  const rightTrack = new Mesh(new BoxGeometry(trackW, trackH, trackD), trackMat);
  leftTrack.position.set(-trackX, trackH / 2, 0);
  rightTrack.position.set( trackX, trackH / 2, 0);
  leftTrack.castShadow = rightTrack.castShadow = true;
  inner.add(leftTrack, rightTrack);

  // 2. Chassis body
  const body = new Mesh(new BoxGeometry(bodyW, bodyH, bodyD), bodyMat);
  body.position.set(0, bodyCentreY, 0);
  body.castShadow = true;
  inner.add(body);

  // 3. Shoulder pads (Phantom + Titan only)
  if (!isWraith) {
    const leftShl  = new Mesh(new BoxGeometry(shlW, shlH, shlD), bodyMat);
    const rightShl = new Mesh(new BoxGeometry(shlW, shlH, shlD), bodyMat);
    leftShl.position.set(-shlX, bodyCentreY + 0.10, 0);
    rightShl.position.set( shlX, bodyCentreY + 0.10, 0);
    leftShl.castShadow = rightShl.castShadow = true;
    inner.add(leftShl, rightShl);
  }

  // 4. Eye / sensor strip on the FRONT face (+Z)
  const eye = new Mesh(new BoxGeometry(eyeW, eyeH, 0.04), eyeMat);
  eye.position.set(0, bodyCentreY + 0.05, bodyD / 2 + 0.025);
  inner.add(eye);

  // ── Outer wrapper (no position / scale — controlled by <primitive> in R3F) ─
  const outer = new Group();
  outer.add(inner);
  return outer;
}
