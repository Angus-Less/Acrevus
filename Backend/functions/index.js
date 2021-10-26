"use strict";

const functions = require("firebase-functions");
const OpenAI = require("openai-api");

const openai = new OpenAI(functions.config().openai.access_token);

// Summarise description of a site when made
exports.summariseDescription =
  functions.firestore.document("/openai/{word}").onCreate(
      async (snap) => {
        const document = snap.data();
        const OpenAIinput = document.desc;
        const response = await openai.complete({
          engine: "davinci-instruct-beta",
          prompt:
            "I was asked to summarise the below paragraph " +
            "for an external audience:\n\"\"\"" +
            OpenAIinput +
            "\n\"\"\"\nI briefly summarised it as such:\n\"\"\"",
          maxTokens: 100,
          temperature: 0.9,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0,
          bestOf: 1,
          n: 1,
          stream: false,
          stop: ["\"\"\"", "\n"],
        });// @ts-ignore

        const expandedResponse = response.data;

        return snap.ref.set({
          name: document.name,
          rating: document.rating,
          longDesc: OpenAIinput,
          desc: expandedResponse.choices[0].text,
        });
      });
