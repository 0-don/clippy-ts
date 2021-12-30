/* eslint-disable import/prefer-default-export */
import produce, { Draft } from 'immer';
import { State, StateCreator } from 'zustand';

export const immer =
  <T extends State>(
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
  ): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api);

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
