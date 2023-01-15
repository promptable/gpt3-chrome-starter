import type { PlasmoMessaging } from "@plasmohq/messaging"

import { runCompletion } from "~lib/openai"

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const compRes = await runCompletion(req.body)

  res.send({
    text: compRes.choices[0]?.text
  })
}
