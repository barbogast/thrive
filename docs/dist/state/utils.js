import {produce} from "../../_snowpack/pkg/immer.js";
export const immerMiddleware = (config) => (set, get, api) => config((fn) => set(produce(fn)), get, api);
