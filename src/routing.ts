import { useRoute } from 'wouter'

export function useGameId(): string {
  const [, params] = useRoute<{ gameId: string }>('/play/:gameId')
  if (!params) {
    throw new Error('No game id')
  }
  return params.gameId
}
