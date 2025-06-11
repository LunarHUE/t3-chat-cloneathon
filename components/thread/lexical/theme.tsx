/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const theme = {
  code: "bg-lightgray font-mono block px-4 py-4 leading-[1.53] text-sm mt-2 mb-2 tab-[2] overflow-x-auto relative",
  codeHighlight: {
    atrule: "text-token-attr",
    attr: "text-token-attr",
    boolean: "text-token-property",
    builtin: "text-token-selector",
    cdata: "text-token-comment",
    char: "text-token-selector",
    class: "text-token-function",
    "class-name": "text-token-function",
    comment: "text-token-comment",
    constant: "text-token-property",
    deleted: "text-token-property",
    doctype: "text-token-comment",
    entity: "text-token-operator",
    function: "text-token-function",
    important: "text-token-variable",
    inserted: "text-token-selector",
    keyword: "text-token-attr",
    namespace: "text-token-variable",
    number: "text-token-property",
    operator: "text-token-operator",
    prolog: "text-token-comment",
    property: "text-token-property",
    punctuation: "text-token-punctuation",
    regex: "text-token-variable",
    selector: "text-token-selector",
    string: "text-token-selector",
    symbol: "text-token-property",
    tag: "text-token-property",
    url: "text-token-operator",
    variable: "text-token-variable",
  },
  alert: "bg-black",
  // heading: {
  //     h1: '',
  //     h2: '',
  //     h3: '',
  //     h4: '',
  //     h5: '',
  // },
  // image: 'editor-image',
  // link: 'text-purple underline',
  list: {
    listitem: "ml-8 my-2",
    nested: {
      listitem: "list-none",
    },
    ol: "pl-4 m-0",
    ul: "pl-4 m-0",
  },
  // ltr: 'text-left',
  // paragraph: 'mb-2 relative',
  // placeholder: 'text-gray-500 overflow-hidden absolute text-ellipsis top-4 left-2.5 text-base pointer-events-none inline-block',
  // quote: 'm-0 ml-5 text-base text-[rgb(101,103,107)] border-l-4 border-[rgb(206,208,212)] pl-4 italic',
  // rtl: 'text-right',
  link: "p-1 rounded hover:bg-accent transition-colors cursor-pointer",
  text: {
    bold: "font-bold",
    code: "bg-[rgb(240,242,245)] px-1 py-0.5 font-mono text-[94%]",
    // hashtag: '/* No direct Tailwind equivalent for this class */',
    italic: "italic",
    // overflowed: '/* No direct Tailwind equivalent for this class */',
    strikethrough: "line-through",
    underline: "underline",
    underlineStrikethrough: "underline-strikethrough",
  },
  tokenAnsi: {
    comment: "text-slate-500",
    punctuation: "text-gray-500",
    property: "text-[#905]",
    selector: "text-[#690]",
    operator: "text-[#9a6e3a]",
    attrName: "text-[#07a]",
    variableName: "text-[#e90]",
    functionName: "text-[#dd4a68]",
  },
};

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function Disclaimer() {
  return (
    <Alert variant={"primary"}>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Edit in Markdown Enabled:</AlertTitle>
      <AlertDescription>
        <p>
          Please be aware that markdown support is still in development and may
          not work as expected. Please report any issues you encounter.
        </p>
        <br />
        <p>
          <strong>Disable direct markdown editing</strong> by toggling the
          setting in the toolbar settings.
        </p>
        <br />
        <h2 className="text-base">
          <strong>Known Issues:</strong>
        </h2>
        <ul className="list-disc ml-7">
          <li>
            <strong>Bold</strong> is not supported in Headers
          </li>
          <li>
            <i>Italics</i> is not supported in Headers
          </li>
          <li>
            <strong>Bold</strong> is not supported in Alert Title
          </li>
        </ul>
        <br />
        <p>
          <strong>DO NOT</strong> manually add these formats in the markdown
          editor to the affected nodes, as the formatting will break
        </p>
      </AlertDescription>
    </Alert>
  );
}
import { useEffect, useState } from "react";

function Placeholder() {
  const [baseMessage, setBaseMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const messages = [
      "Ask me anything about AI...",
      "Exploring neural networks...",
      "Let's discuss machine learning...",
      "Generate AI-powered content here...",
      "Your AI assistant is listening...",
      "Need help with programming?",
      "Brainstorming together...",
      "Curious about deep learning?",
      "Let's solve problems together...",
      "Looking for research insights?",
      "Create with AI assistance...",
      "Ready to answer your questions...",
      "Generate ideas with me...",
      "What would you like to learn today?",
    ];

    if (!baseMessage) {
      setBaseMessage(messages[currentMessageIndex]);
    }
  }, [baseMessage, currentMessageIndex]);

  useEffect(() => {
    if (!isTyping && !isDeleting && baseMessage) {
      // Start typing
      setIsTyping(true);
    } else if (isTyping && message === baseMessage) {
      // Finished typing, pause before deleting
      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
        setIsDeleting(true);
      }, 1500);

      return () => clearTimeout(typingTimeout);
    } else if (isDeleting && message === "") {
      // Finished deleting, move to next message
      const deletingTimeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % 14);
        setBaseMessage("");
      }, 500);

      return () => clearTimeout(deletingTimeout);
    }
  }, [isTyping, isDeleting, message, baseMessage]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTyping) {
      interval = setInterval(() => {
        setMessage((prev) => {
          if (prev.length === baseMessage.length) {
            clearInterval(interval);
            return prev;
          }
          return baseMessage.slice(0, prev.length + 1);
        });
      }, 125);
    } else if (isDeleting) {
      interval = setInterval(() => {
        setMessage((prev) => {
          if (prev.length === 0) {
            clearInterval(interval);
            return "";
          }
          return prev.slice(0, prev.length - 1);
        });
      }, 75);
    }

    return () => clearInterval(interval);
  }, [isTyping, isDeleting, baseMessage]);

  // Blinking caret effect
  useEffect(() => {
    const caretInterval = setInterval(() => {
      setShowCaret((prev) => !prev);
    }, 500);

    return () => clearInterval(caretInterval);
  }, []);

  return (
    <div className="text-muted-foreground overflow-hidden absolute text-ellipsis top-8.5 left-[12px] text-normal select-none inline-block pointer-events-none px-5 py-6">
      <span className="font-semibold opacity-65">
        {message}
        <span
          className={`border-r-2 border-current ml-0.5 ${showCaret ? "opacity-100" : "opacity-0"}`}
          style={{ height: ".9em", display: "inline-block" }}
        ></span>
      </span>
      <span
        className="absolute top-0 left-0 p-5 text-transparent gradient-shadow font-semibold opacity-20"
        style={{
          filter: "blur(2px)",
        }}
      >
        {message}
      </span>
    </div>
  );
}

import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode, $createCodeHighlightNode } from "@lexical/code";
// import { $createAlertNode } from './nodes/alert';
// import { $createAlertTitleNode } from './nodes/alert/title';
// import { $createAlertDescriptionNode } from './nodes/alert/description';
// import { $createLinkNode } from "@lexical/link";

function populatePlainText(text: string) {
  const root = $getRoot();

  const paragraph = $createParagraphNode();
  paragraph.append($createTextNode(text));
  root.append(paragraph);
}

function prePopulate() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const paragraph = $createParagraphNode();
    paragraph.append($createTextNode("Hello, world!"));
    root.append(paragraph);

    // const alert = $createAlertNode('destructive');
    // alert.append($createAlertTitleNode('Known Issues:'));
    // alert.append($createAlertDescriptionNode('This is a development page. Please do not use it for production.'));
    // root.append(alert);

    // const default_alert = $createAlertNode('default');
    // default_alert.append($createAlertTitleNode('Note:'));
    // default_alert.append($createAlertDescriptionNode('Starting in .NET 9, a build warning is emitted if your project targets .NET Standard 1.x.'));
    // default_alert.append($createAlertDescriptionNode());
    // default_alert.append($createAlertDescriptionNode('For more information, see Warning emitted for .NET Standard 1.x targets.'));
    // root.append(default_alert);

    // const primary_alert = $createAlertNode('primary');
    // primary_alert.append($createAlertTitleNode('Known Issues:'));
    // primary_alert.append($createAlertDescriptionNode('This is a development page. Please do not use it for production.'));
    // root.append(primary_alert);

    const heading = $createHeadingNode("h1");
    heading.append($createTextNode("Welcome to the KDD Text Editor!"));
    root.append(heading);

    const quote = $createQuoteNode();
    quote.append(
      $createTextNode(
        "Wesley Baldwin is so tired of writing code for this project. He just wants to go to bed.",
      ),
    );
    root.append(quote);

    const link = $createParagraphNode();
    link.append($createTextNode("Check out the "));
    // link.append($createLinkNode('https://kddresearch.org').append($createTextNode('KDD website')));
    link.append($createTextNode(" for more information."));
    root.append(link);

    const codestr = `// this is javascript

const x = 5;
console.log(x);`;

    const code = $createCodeNode("js");
    code.append($createCodeHighlightNode(codestr));
    root.append(code);

    const pyCodeStr = `# This is python

def foo():
    print("Hello, world!")

foo()`;

    const pyCode = $createCodeNode("py");
    pyCode.append($createCodeHighlightNode(pyCodeStr));
    root.append(pyCode);
  }
}

export default theme;

export { Placeholder, prePopulate, populatePlainText };
