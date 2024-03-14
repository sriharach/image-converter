export default (
  inputImage: File,
  outputFormat: string,
  uploadFiles: File[],
) => {
  return new Promise<{
    name: string
    link: Blob
  }>((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    if (ctx) {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('blob :>> ', blob);
              const found = uploadFiles.find((f) => f.name === inputImage.name)
              if (found) {
                resolve({
                  name: found.name,
                  link: blob,
                })
              }
            }
          },
          outputFormat,
          0.8,
        )
      }
      img.onerror = (err) => {
        reject(err)
      }
      img.src = URL.createObjectURL(inputImage)
    }
  })
}
