declare module "@/modules/ai" {
  export const AgentRunBridge: any;
  export const AiInputBar: any;
  export const AiInputBarConnect: any;
  export const AiMiniWindow: any;
  export const LocalAgentNotificationsBridge: any;
  export const SelectionAskAi: any;

  export function getAllKeys(): Promise<string[]>;
  export function getAllCustomEndpointKeys(): Promise<string[]>;
  export function hasAnyKey(): boolean;

  export function useChatStore<T = any>(selector?: (s: any) => T): T;
  export namespace useChatStore {
    function getState(): any;
    function subscribe(cb: any): () => void;
  }

  export function useSnippetsStore<T = any>(selector?: (s: any) => T): T;
  export namespace useSnippetsStore {
    function getState(): any;
    function subscribe(cb: any): () => void;
    function hydrate(): Promise<void>;
  }

  export function useAgentsStore<T = any>(selector?: (s: any) => T): T;
  export namespace useAgentsStore {
    function getState(): any;
    function subscribe(cb: any): () => void;
    function hydrate(): Promise<void>;
  }

  const _default: any;
  export default _default;
}

declare module "@/modules/ai/lib/redact" {
  export function redactSensitive<T>(v: T): T;
}

declare module "@/modules/ai/lib/native" {
  export const native: any;
}

declare module "@/modules/ai/store/snippetsStore" {
  export function useSnippetsStore<T = any>(selector?: (s: any) => T): T;
  export namespace useSnippetsStore {
    function getState(): any;
    function subscribe(cb: any): () => void;
    function hydrate(): Promise<void>;
  }
}

declare module "@/modules/ai/store/chatStore" {
  export function useChatStore<T = any>(selector?: (s: any) => T): T;
  export namespace useChatStore {
    function getState(): any;
    function subscribe(cb: any): () => void;
  }
  export function getOrCreateChat(): any;
}

declare module "@/modules/agents/lib/review" {
  export function firePendingReviewForSession(id?: any): Promise<void>;
}

declare module "@/modules/agents/store/managedAgentsStore" {
  export function useManagedAgentsStore<T = any>(selector?: (s: any) => T): T;
  export namespace useManagedAgentsStore {
    function getState(): any;
    function subscribe(cb: any): () => void;
  }
}
