import { CoreAssistantMessage, CoreSystemMessage, CoreToolMessage, CoreUserMessage, FilePart, generateText, ImagePart, TextPart, UIMessage } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google"

const generateRequestSchema = z.object({
    chatId: z.string().uuid(),
    model: z.enum(["gpt-4.1", "gpt-4.1-mini", "gpt-4o-mini", "gpt-4o", "claude-4-sonnet-20250514", "claude-3-7-sonnet-20250219", "gemini-2.5-flash-preview-04-17", "gemini-2.5-pro-exp-03-25"]),
    messages: z.array(z.object({
        sender: z.enum(["system", "user", "model"]),
        content: z.string(),
        attachments: z.array(z.string().uuid()).optional()
    }))
})

const generateResponseSchema = z.object({
    response: z.string()
})

export async function generate({model, messages}: z.infer<typeof generateRequestSchema>): Promise<z.infer<typeof generateResponseSchema>> {
    let sdkModel;
    
    switch (model)
    {
        case "gpt-4.1":
        case "gpt-4.1-mini":
        case "gpt-4o-mini":
        case "gpt-4o":
            sdkModel = openai(model)
            break;
        case "claude-4-sonnet-20250514":
        case "claude-3-7-sonnet-20250219":
            sdkModel = anthropic(model)
            break;
        case "gemini-2.5-flash-preview-04-17":
        case "gemini-2.5-pro-exp-03-25":
            sdkModel = google(model)
    }

    const { text } = await generateText({
        model: sdkModel,
        messages: toSdkMessages(messages),
        temperature: 2
    })

    return {
        response: text
    }
}

type sdkMessages = Array<sdkMessage>
type sdkMessage = CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage 

function toSdkMessages(messages: z.infer<typeof generateRequestSchema.shape.messages>): sdkMessages {
    let sdkMessages: sdkMessages = []
    
    messages.map((message) => {
        let sdkMessage: sdkMessage; 
        switch (message.sender) {
            case "system":
                sdkMessage = { role: "system", content: message.content }
                break;
            case "model":
                sdkMessage = { role: "assistant", content: message.content }
                break;
            case "user":
                sdkMessage = { role: "user", content: [getTextPart(message.content)] } 
                break;
        }

        sdkMessages.push(sdkMessage)
    })

    return sdkMessages
}

function getFile(fileId: string): TextPart | ImagePart | FilePart {
    return { type: "text", text: "" }
}

function getTextPart(content: string): TextPart {
    return { type: "text", text: content }
}