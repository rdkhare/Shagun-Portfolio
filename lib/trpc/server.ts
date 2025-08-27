export type TrpcProcedure<Name extends string> = {
  name: Name;
  description: string;
};

export function getTrpcRouterPlaceholder() {
  const procedures: Array<TrpcProcedure<string>> = [
    { name: 'articles.list', description: 'List articles (placeholder)' },
    { name: 'articles.get', description: 'Get article by slug (placeholder)' },
  ];
  return { procedures };
} 