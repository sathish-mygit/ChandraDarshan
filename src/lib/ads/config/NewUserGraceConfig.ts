import { GraceType, type NewUserGraceConfig } from '../core/types';

export const DEFAULT_NEW_USER_GRACE: NewUserGraceConfig = {
  enabled: true,
  type: GraceType.SESSIONS,
  maxSessions: 5,
};

export function mergeGraceConfig(override?: Partial<NewUserGraceConfig>): NewUserGraceConfig {
  return {
    ...DEFAULT_NEW_USER_GRACE,
    ...override,
  };
}
