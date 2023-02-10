const rules = {
  let: {
    id: [
      "join",
      ":",
      [
        { var: "resource.newData.note_id" },
        { var: "resource.newData.owner_address" },
      ],
    ],
  },
  "allow create": {
    and: [
      { "!=": [{ var: "request.auth.signer" }, null] },
      {
        "==": [{ var: "resource.id" }, { var: "id" }],
      },
      {
        "==": [
          { var: "request.auth.signer" },
          { var: "resource.newData.owner_address" },
        ],
      },
      {
        "==": [
          { var: "request.block.timestamp" },
          { var: "resource.newData.created_at" },
        ],
      },
      {
        "==": [{ var: "resource.newData.likes" }, 0],
      },
    ],
  },
  "allow update": {
    and: [
      {
        "==": [
          { var: "request.auth.signer" },
          { var: "resource.data.owner_address" },
        ],
      },
      {
        "==": [
          { var: "request.block.timestamp" },
          { var: "resource.newData.updated_at" },
        ],
      },
    ],
  },
  "allow delete": {
    "==": [
      { var: "request.auth.signer" },
      { var: "resource.data.owner_address" },
    ],
  },
};

export default rules;
