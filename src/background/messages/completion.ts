import type { PlasmoMessaging } from "@plasmohq/messaging"

import { runCompletion } from "~lib/openai"

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const completion = await runCompletion(req.body)
  res.send(completion)
}
