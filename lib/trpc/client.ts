export interface TrpcClientPlaceholder {
  call(name: string, input?: unknown): Promise<unknown>;
}

export function createTrpcClientPlaceholder(): TrpcClientPlaceholder {
  return {
    async call(name: string) {
      throw new Error(`tRPC not configured. Attempted to call procedure: ${name}`);
    },
  };
} 