export const parseJsonSSE = async <T>({
  data,
  onParse,
  onFinish
}: {
  data: ReadableStream
  onParse: (object: T) => void
  onFinish: () => void
}) => {
  const reader = data.getReader()
  const decoder = new TextDecoder()

  let done = false
  let tempState = ""

  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const newValue = decoder.decode(value).split("\n\n").filter(Boolean)

    if (tempState) {
      newValue[0] = tempState + newValue[0]
      tempState = ""
    }

    // eslint-disable-next-line @typescript-eslint/no-loop-func
    newValue.forEach((newVal) => {
      try {
        const json = JSON.parse(newVal.replace("data: ", "")) as T

        onParse(json)
      } catch (error) {
        tempState = newVal
      }
    })
  }

  onFinish()
}
