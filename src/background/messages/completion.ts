import type { PlasmoMessaging } from "@plasmohq/messaging"

import { runCompletion, streamCompletion } from "~lib/openai"

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { prompt, config, options } = req.body

  let completion
  if (options.stream) {
    const onMessage = (completion) => {
      res.send({
        event: "message",
        completion
      })
    }
    const onError = (err: string) => {}
    const onClose = () => {}

    streamCompletion({ data: { prompt, config }, onMessage, onError, onClose })
  } else {
    completion = await runCompletion({
      prompt,
      config
    })

    res.send({
      event: "message",
      completion
    })
  }
}
