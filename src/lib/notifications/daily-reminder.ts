import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { t } from '@/lib/i18n/labels';
import type { AppLanguage, AppPreferences } from '@/lib/types';

export const DAILY_READING_REMINDER_ID = 1;
export const DEFAULT_DAILY_REMINDER_TIME = '07:00';
export const DAILY_READING_ROUTE = '/jyotish/';

function isHybridPlatform(): boolean {
  const platform = Capacitor.getPlatform();
  return platform === 'android' || platform === 'ios';
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (!isHybridPlatform()) {
      return false;
    }

    let permission = await LocalNotifications.checkPermissions();
    if (permission.display === 'prompt') {
      permission = await LocalNotifications.requestPermissions();
    }

    return permission.display === 'granted';
  } catch (error) {
    console.warn('[DailyReminder] Error requesting notification permission:', error);
    return false;
  }
}

export async function canSendNotifications(): Promise<boolean> {
  try {
    if (!isHybridPlatform()) {
      return false;
    }

    const permission = await LocalNotifications.checkPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.warn('[DailyReminder] Error checking notification permissions:', error);
    return false;
  }
}

export async function cancelDailyReadingReminder(): Promise<void> {
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: DAILY_READING_REMINDER_ID }],
    });
  } catch (error) {
    console.warn('[DailyReminder] Error canceling reminder:', error);
  }
}

export async function scheduleDailyReadingReminder(
  time: string,
  language: AppLanguage,
): Promise<void> {
  try {
    if (!(await canSendNotifications())) {
      console.warn('[DailyReminder] Cannot schedule — notifications not granted.');
      return;
    }

    const [hour, minute] = time.split(':').map(Number);

    await cancelDailyReadingReminder();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: DAILY_READING_REMINDER_ID,
          title: t('dailyReminderNotifTitle', language),
          body: t('dailyReminderNotifBody', language),
          schedule: {
            on: { hour, minute },
            repeats: true,
          },
          smallIcon: 'ic_stat_moon',
          extra: {
            route: DAILY_READING_ROUTE,
          },
        },
      ],
    });
  } catch (error) {
    console.warn('[DailyReminder] Error scheduling reminder:', error);
  }
}

export async function syncDailyReadingReminder(
  preferences: AppPreferences,
): Promise<void> {
  if (!isHybridPlatform()) {
    return;
  }

  const reminder = preferences.dailyReminder;
  if (!reminder?.enabled || !preferences.birthProfile) {
    await cancelDailyReadingReminder();
    return;
  }

  if (!(await canSendNotifications())) {
    return;
  }

  await scheduleDailyReadingReminder(
    reminder.time || DEFAULT_DAILY_REMINDER_TIME,
    preferences.language,
  );
}
