export interface DatabaseConnection {
  // Placeholder shape to avoid external dependencies until Drizzle is configured
  kind: 'placeholder';
}

export async function getDatabaseConnection(): Promise<DatabaseConnection> {
  throw new Error(
    'Database not configured. Install Drizzle and configure a client in lib/db/client.ts. See ARCHITECTURE.md for details.'
  );
} 