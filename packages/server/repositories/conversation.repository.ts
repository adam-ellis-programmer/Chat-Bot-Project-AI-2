// Implementation detail (store in memory) -- keep private
const conversations = new Map<string, string>()

// Only export the public interface of the module

// export as methods (not helpers)
export const conversationRepository = {
  getLastResponseId(conversationId: string) {
    return conversations.get(conversationId)
  },

  setLastResponseId(conversationId: string, responseId: string) {
    conversations.set(conversationId, responseId)
    return
  },
}
