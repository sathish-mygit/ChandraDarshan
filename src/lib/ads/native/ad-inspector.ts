import { Capacitor, registerPlugin } from '@capacitor/core';

export interface AdInspectorPlugin {
  open(): Promise<void>;
}

const AdInspector = registerPlugin<AdInspectorPlugin>('AdInspector');

export async function openAdInspector(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    throw new Error('Ad Inspector is only available on native Android/iOS builds');
  }
  await AdInspector.open();
}
