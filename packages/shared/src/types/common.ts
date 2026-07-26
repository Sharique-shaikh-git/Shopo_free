/**
 * Common utility types used across the project.
 */

/**
 * Make specific fields optional in a type.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific fields required in a type.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Supported languages in the app.
 */
export type SupportedLanguage = 'ur' | 'en' | 'sd' | 'pa' | 'ps' | 'bal';

/**
 * Currency (PKR only for now).
 */
export type Currency = 'PKR';

/**
 * Pakistan provinces — used for delivery addresses.
 */
export type PakistanProvince =
  | 'sindh'
  | 'punjab'
  | 'kpk'
  | 'balochistan'
  | 'islamabad'
  | 'gilgit_baltistan'
  | 'ajk';
