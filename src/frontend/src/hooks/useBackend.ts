import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

export function useBackend() {
  // Actor with empty interface — backend methods called via local state for now
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}
