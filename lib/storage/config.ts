export interface StorageConfig {
  publicBucket: string;
  privateBucket: string;
}

export function getDefaultStorageConfig(): StorageConfig {
  return {
    publicBucket: 'public',
    privateBucket: 'private',
  };
} 