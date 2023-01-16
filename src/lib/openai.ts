import { parseJsonSSE } from "~parseJSONSSE"

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const runCompletion = async ({
  prompt,
  config = {
    model: "text-davinci-003",
    max_tokens: 128,
    temperature: 0.7
  }
}: {
  prompt: string
  config: any
}) => {
  const data = { prompt, ...config, provider: undefined }
  try {
    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY
      }
    })

    const compRes = await res.json()

    return compRes.choices[0].text
  } catch (e) {
    console.error(e)
  }
}

export const streamCompletion = async (args: {
  data: {
    prompt: string
    config: any
  }
  onMessage: (completion: string) => void
  onError: (err: string) => void
  onClose: () => void
}) => {
  const { data, onMessage, onClose } = args

  const payload = {
    prompt: data.prompt,
    model: "text-davinci-003",
    max_tokens: 128,
    temperature: 0.7,
    stream: true
  }

  const res = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`
    },
    method: "POST",
    body: JSON.stringify(payload)
  })

  parseJsonSSE({
    data: res.body,
    onParse: (obj) => {
      onMessage(
        //@ts-ignore
        obj.choices?.[0].text
      )
    },
    onFinish: () => {}
  })
}
