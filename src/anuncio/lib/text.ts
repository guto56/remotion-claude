// Parsers dos textos de copy.ts.

export type Run = { text: string; on: boolean };

// Títulos: "[palavra]" = destaque. Retorna palavras, cada uma com seus trechos.
// Ex.: "às [23h]." -> [[{às}], [{23h, on}, {.}]]
export const parseHighlight = (input: string): Run[][] => {
  const words: Run[][] = [];
  let word: Run[] = [];
  let on = false;
  let buf = "";
  const flush = () => {
    if (buf) {
      word.push({ text: buf, on });
      buf = "";
    }
  };
  for (const ch of input) {
    if (ch === "[" || ch === "]") {
      flush();
      on = ch === "[";
    } else if (ch === " ") {
      flush();
      if (word.length) words.push(word);
      word = [];
    } else {
      buf += ch;
    }
  }
  flush();
  if (word.length) words.push(word);
  return words;
};

// Mensagens: "*negrito*", "\n" = linha, "\n\n" = parágrafo.
// Retorna parágrafos -> linhas -> trechos (on = negrito).
export const parseChat = (input: string): Run[][][] =>
  input.split("\n\n").map((paragraph) =>
    paragraph.split("\n").map((line) => {
      const runs: Run[] = [];
      let on = false;
      let buf = "";
      for (const ch of line) {
        if (ch === "*") {
          if (buf) runs.push({ text: buf, on });
          buf = "";
          on = !on;
        } else {
          buf += ch;
        }
      }
      if (buf) runs.push({ text: buf, on });
      return runs;
    }),
  );
