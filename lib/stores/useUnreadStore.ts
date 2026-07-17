import { create } from 'zustand';

interface UnreadStore {
  unreadConversationIds: Set<string>;
  hydrate: (ids: string[]) => void;
  markUnread: (conversationId: string) => void;
  markRead: (conversationId: string) => void;
}

// Tracks unread *conversations* (a Set of ids), matching the boolean granularity
// getConversations() already computes — not a message count, which nothing else in the app
// tracks and would be new scope to invent.
export const useUnreadStore = create<UnreadStore>((set) => ({
  unreadConversationIds: new Set(),
  hydrate: (ids) => set({ unreadConversationIds: new Set(ids) }),
  markUnread: (conversationId) =>
    set((state) => {
      if (state.unreadConversationIds.has(conversationId)) return state;
      return { unreadConversationIds: new Set(state.unreadConversationIds).add(conversationId) };
    }),
  markRead: (conversationId) =>
    set((state) => {
      if (!state.unreadConversationIds.has(conversationId)) return state;
      const next = new Set(state.unreadConversationIds);
      next.delete(conversationId);
      return { unreadConversationIds: next };
    }),
}));
