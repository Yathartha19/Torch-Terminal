import React from "react";
export const AgentRunBridge: React.FC<any> = () => null;
export const AiInputBar: React.FC<any> = () => null;
export const AiInputBarConnect: React.FC<any> = () => null;
export const AiMiniWindow: React.FC<any> = () => null;
export const LocalAgentNotificationsBridge: React.FC<any> = () => null;
export const SelectionAskAi: React.FC<any> = () => null;

export { AiComposerProvider } from "./lib/composer";
export { redactSensitive } from "./lib/redact";
export { native } from "./lib/native";
export { useAgentsStore } from "./store/agentsStore";
export { useSnippetsStore } from "./store/snippetsStore";
export { useChatStore } from "./store/chatStore";

export async function getAllKeys() {
  return [] as string[];
}
export async function getAllCustomEndpointKeys() {
  return [] as string[];
}
export function hasAnyKey() {
  return false;
}

export default {
  AgentRunBridge,
  AiInputBar,
  AiInputBarConnect,
  AiMiniWindow,
  LocalAgentNotificationsBridge,
  SelectionAskAi,
  getAllKeys,
  getAllCustomEndpointKeys,
  hasAnyKey,
};
