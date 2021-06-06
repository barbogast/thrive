import {useRoute} from "../_snowpack/pkg/wouter.js";
export function useGameId() {
  const [, params] = useRoute("/play/:gameId");
  if (!params) {
    throw new Error("No game id");
  }
  return params.gameId;
}
