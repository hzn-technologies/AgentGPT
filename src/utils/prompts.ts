import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO } from "./constants";

export const createModel = (settings: ModelSettings) =>
  new OpenAI({
    openAIApiKey:
      settings.customApiKey === ""
        ? process.env.OPENAI_API_KEY
        : settings.customApiKey,
    temperature: settings.customTemperature || 0.9,
    modelName:
      settings.customModelName === "" ? GPT_35_TURBO : settings.customModelName,
    maxTokens: 400,
  });

export const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called AgentGPT. You have the following objective `{goal}`. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Use {customLanguage} code to translate your answer. Return the response as an array of strings that can be used in JSON.parse().",
  inputVariables: ["goal", "customLanguage"],
});

export const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called AgentGPT. You have the following objective `{goal}`. You have the following tasks `{task}`. Execute the task and return the response as a string on {customLanguage} language.",
  inputVariables: ["goal", "task", "customLanguage"],
});

export const createTasksPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following result `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings on {customLanguage} language that can be used in JSON.parse() and NOTHING ELSE",
  inputVariables: ["goal", "tasks", "lastTask", "result", "customLanguage"],
});





export const createAgentCreatorPromptByAI = new PromptTemplate({
  template:"Analyze the following description then create a declarative prompt using the rules below.\nRULES\n1. You always have to use in the created prompt the `you` and `your` pronounces instead of `I` or `me`\n2. You have to name the created character and call the AI by its created name if it's necessary\n3. You have to provide a declarative and formal prompt\n4. Don't use questions\n5. You have to declare that the role should be taken from now and ask the created persona to immerse itself into the created role at the end of the prompt\nDESCRIPTION\n`{description}`\n\nRespond only with a JSON object by the followoing syntax:\n{agentName:{the name of the created persona}, creatorPrompt:{}}",
  inputVariables: ["name", "description"]
}); // returns with a JSON object with the name of the AI agent and its definitive creator prompt

export const createAgentByItsCreatorPrompt = new PromptTemplate({
  template:"Process the PROMPT below then respond only with the corresponding JSON object by the follwoing syntax:\n{name:{the name of the persona}, personality:{the perosnality of the persona}, goal: {the goal of the persona}}\n\nPROMPT:\n`{creatorPrompt}`",
  inputVariables: ["creatorPrompt"]
}); // returns with a JSON object of the created persona
