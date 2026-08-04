import { useState } from "react";

// A tiny interactive dichotomous key demonstrating the skill for Topic 1.
type Node =
  | { question: string; yes: Node; no: Node }
  | { result: string };

const KEY: Node = {
  question: "Does the organism have a backbone?",
  yes: {
    question: "Does it have feathers?",
    yes: { result: "Bird" },
    no: {
      question: "Does it have dry, scaly skin?",
      yes: { result: "Reptile" },
      no: { result: "Mammal" },
    },
  },
  no: {
    question: "Does it have jointed legs?",
    yes: { result: "Insect (or other arthropod)" },
    no: { result: "Worm (or other soft-bodied invertebrate)" },
  },
};

export function DichotomousKey() {
  const [node, setNode] = useState<Node>(KEY);
  const [trail, setTrail] = useState<string[]>([]);

  if ("result" in node) {
    return (
      <div className="igb-key">
        <p className="igb-key-trail">{trail.join(" → ")}</p>
        <p className="igb-key-result">
          Identified: <strong>{node.result}</strong>
        </p>
        <button
          type="button"
          className="igb-btn"
          onClick={() => {
            setNode(KEY);
            setTrail([]);
          }}
        >
          Start again
        </button>
      </div>
    );
  }

  return (
    <div className="igb-key">
      {trail.length > 0 && <p className="igb-key-trail">{trail.join(" → ")}</p>}
      <p className="igb-key-question">{node.question}</p>
      <div className="igb-key-choices">
        <button
          type="button"
          className="igb-btn"
          onClick={() => {
            setTrail((t) => [...t, "Yes"]);
            setNode(node.yes);
          }}
        >
          Yes
        </button>
        <button
          type="button"
          className="igb-btn"
          onClick={() => {
            setTrail((t) => [...t, "No"]);
            setNode(node.no);
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}
