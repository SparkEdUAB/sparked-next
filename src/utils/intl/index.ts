import { DEFAULT_LANGAUGE } from "./constants";

export const translate = (word: string, word2?: string) => {
  let appLang = DEFAULT_LANGAUGE;
  const data = require("./data");
  const text = word2 ? "word2" : "word";
  //NOTE: when word does not exit we return the word back as it is

  return data[appLang]
    ? data[appLang][word]
      ? data[appLang][word][text]
      : word
    : data[DEFAULT_LANGAUGE][word]
    ? data[DEFAULT_LANGAUGE][word][text]
    : word;
};
