"use strict";

const functions = require("firebase-functions");
const OpenAI = require("openai-api");

const openai = new OpenAI(functions.config().openai.access_token);

// Shorten URL written to /links/{linkID}.
exports.shortenUrl = functions.firestore.document("/openai/{word}").onCreate(
    async (snap) => {
      const document = snap.data();
      const OpenAIinput = document.OpenAIinput;
      const response = await openai.complete({
        engine: "davinci",
        prompt: OpenAIinput,
        maxTokens: 5,
        temperature: 0.9,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ["\n", "testing"],
      });// @ts-ignore

      const expandedResponse = response.data;

      return snap.ref.set({
        input: OpenAIinput,
        APIresponse: expandedResponse,
        output: expandedResponse.choices[0].text,
      });
    });
