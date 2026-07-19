export interface ClickLimiterState {
  sessionId: string;
  sessionClicks: number;
  dayKey: string;
  dayClicks: number;
  pausedUntil: number;
  lastAppOpenTime: number;
}

export interface ClickRecordResult {
  sessionClicks: number;
  dayClicks: number;
  shouldPause: boolean;
  trigger?: 'session_limit' | 'day_limit';
}
