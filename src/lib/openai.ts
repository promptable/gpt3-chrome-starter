import axios from "axios"

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const runCompletion = async ({
  prompt,
  config
}: {
  prompt: string
  config: any
}) => {
  const data = { prompt, ...config, provider: undefined }
  try {
    const res = await axios("https://api.openai.com/v1/completions", {
      method: "POST",
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY
      }
    })

    return res.data
  } catch (e) {
    console.error(e)
  }
}
