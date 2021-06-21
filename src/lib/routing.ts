import { useRoute } from 'wouter'
import { useSearchParam } from 'react-use'

export function useGameId(): string {
  const [, params] = useRoute<{ gameId: string }>('/play/:gameId')
  if (!params) {
    throw new Error('No game id')
  }
  return params.gameId
}

export function useBoardId(): string {
  const [, params] = useRoute<{ boardId: string }>('/edit/:boardId')
  if (!params) {
    throw new Error('No board id')
  }
  return params.boardId
}

export function useInvitation(): string | void {
  return useSearchParam('connect') || undefined
}

export function clearSearchParams(): void {
  history.pushState({}, '', location.pathname)
}
