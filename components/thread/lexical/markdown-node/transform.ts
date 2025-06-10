import {
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  Transformer,
} from "@lexical/markdown";
// import { MARKDOWN_EDITOR } from "../../nodes/markdown/transform";
import { QuoteNode } from "@lexical/rich-text";

import {
  ElementTransformer
} from "@lexical/markdown";
import {
  $isMakrdownEditorCodeNode,
  MakrdownEditorCodeNode,
} from "./root";
import { LexicalNode } from "lexical";

export const MARKDOWN_EDITOR: ElementTransformer = {
  dependencies: [MakrdownEditorCodeNode],
  export: (node: LexicalNode) => {
    if (!$isMakrdownEditorCodeNode(node)) {
      return null;
    }
    const textContent = node.getTextContent();
    return (
`${textContent}`.trim()
    );
  },
  regExp: /a^/,
  replace: (parentNode, children, _match, isImport) => {
    throw new Error('Not implemented, this should never match');
  },
  type: 'element',
};
  

const TRANSFORMERS: Array<Transformer> = [
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

export const KDD_TRANSFORMERS = [
  MARKDOWN_EDITOR,
  // ALERT,
  // QUOTE_OR_ALERT_DESCRIPTION,
  ...TRANSFORMERS.filter((transformer) => { // TODO: PR to lexical to add a multiline transformer
    if (transformer.type !== 'element') {
      return transformer
    }

    if (transformer.dependencies.includes(QuoteNode)) {
      return false
    }

    return transformer
  }),
]
