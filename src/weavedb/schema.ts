const schema = {
  type: "object",
  required: [
    "note_id",
    "created_at",
    "updated_at",
    "owner_address",
    "title",
    "body",
    "private",
    "likes",
  ],
  properties: {
    note_id: {
      type: "string",
    },
    created_at: {
      type: "number",
    },
    updated_at: {
      type: "number",
    },
    owner_address: {
      type: "string",
    },
    title: {
      type: "string",
    },
    body: {
      type: "string",
    },
    private: {
      type: "boolean",
    },
    likes: {
      type: "number",
    },
  },
};
export default schema;
