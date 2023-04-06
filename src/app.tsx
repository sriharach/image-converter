import React, { useState, memo, Fragment } from 'react'
import Content from './components/layouts/content'
import { Box, Button, IconButton, Stack } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTypeImage } from './zustand/type-converter'

const App = () => {
  const { type_image } = useTypeImage((state) => state)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [filePreview, setFilesPreview] = useState<
    { name: string; link: Blob | null }[]
  >([])
  const [constType, setConstType] = useState('')

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploader = [...uploadFiles],
      preview = [...filePreview]
    const selectFiles: File[] = Array.prototype.slice.call(e.target.files)

    selectFiles.forEach((file) => {
      if (
        uploader.findIndex((f) => f.name === file.name) === -1 &&
        preview.findIndex((f) => f.name === file.name) === -1
      ) {
        if (uploader.length != 10 && preview.length != 10) {
          uploader.push(file)
          preview.push({
            name: file.name,
            link: null,
          })
        }
      }
    })

    setUploadFiles(uploader)
    setFilesPreview(preview)
  }

  const handleRemoveFile = (_name: string) => {
    const isAmountFile = uploadFiles.length > 0 && filePreview.length > 0
    if (isAmountFile) {
      setUploadFiles((value) => value.filter((t) => t.name !== _name))
      setFilesPreview((value) => value.filter((t) => t.name !== _name))
    }
  }

  const modifyImage = async () => {
    if (uploadFiles.length > 0) {
      const temarr: Promise<{
        name: string
        link: Blob
      }>[] = []

      // eslint-disable-next-line no-inner-declarations
      function convertImageType(inputImage: File, outputFormat: string) {
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
                    const found = uploadFiles.find(
                      (f) => f.name === inputImage.name,
                    )
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
      const isLink = filePreview.find((d) => !d.link)
      if (isLink) {
        setConstType(type_image)
        for (let index = 0; index < uploadFiles.length; index++) {
          const file = uploadFiles[index]
          const converted = convertImageType(file, `image/${type_image}`)
          temarr.push(converted)
        }
        setFilesPreview(await Promise.all(temarr))
      } else {
        setFilesPreview((files) => files)
      }
    }
  }

  const loadFile = (data: Blob, name: string) => {
    const url = window.URL.createObjectURL(data)
    const tempLink = document.createElement('a')
    tempLink.href = url
    tempLink.setAttribute('download', `${name.split('.')[0]}.${constType}`)
    tempLink.click()
  }

  return (
    <>
      <Content>
        <Stack spacing={3}>
          <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <MemoButtonUpload
              style={{ display: uploadFiles.length ? 'none' : 'flex' }}
              onChange={handleChangeFile}
            />
          </Box>

          {filePreview !== null ? (
            <Fragment>
              <Button
                size='small'
                color='error'
                sx={{
                  display: filePreview.length > 1 ? 'block' : 'none',
                  textTransform: 'none',
                  width: '130px',
                  justifySelf: 'center',
                }}
                variant='outlined'
                onClick={() => {
                  setUploadFiles([])
                  setFilesPreview([])
                  setConstType('')
                }}
              >
                <span>Remove All</span>
              </Button>
              <Box
                sx={{
                  maxHeight: '378px',
                  overflowX: 'auto',
                }}
              >
                <Stack spacing={3}>
                  {filePreview.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'secondary.light',
                        padding: '0.8rem',
                        borderRadius: '0.4rem',
                        boxShadow:
                          'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;',
                      }}
                    >
                      <Box
                        sx={{
                          display: { md: 'grid', sm: 'flex' },
                          alignItems: 'center',
                          gridTemplateColumns: {
                            md: 'repeat(3, 300px)',
                            sm: 'none',
                          },
                          columnGap: '8px',
                        }}
                      >
                        <Box component={'span'}>{file.name}</Box>
                        <Box component={'span'} textAlign={'center'}>
                          {`Convert to: ${type_image.toUpperCase()}`}
                        </Box>
                        {file.link !== null && (
                          <Button
                            size='small'
                            sx={{
                              textTransform: 'none',
                              width: '130px',
                              justifySelf: 'center',
                            }}
                            variant='contained'
                            onClick={() =>
                              loadFile(file.link as Blob, file.name)
                            }
                          >
                            <span>Download</span>
                          </Button>
                        )}
                      </Box>
                      <IconButton
                        onClick={() => handleRemoveFile(file.name)}
                        aria-label='delete'
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Box
                sx={{
                  display: filePreview.length === 0 ? 'none' : 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <MemoButtonUpload
                  disable={filePreview.length >= 10}
                  onChange={handleChangeFile}
                  text='Upload more files'
                />
                <Button
                  sx={{
                    textTransform: 'none',
                    width: '186px',
                    fontSize: 18,
                    height: '60px',
                  }}
                  variant='contained'
                  onClick={modifyImage}
                >
                  <span>Convert Files</span>
                </Button>
              </Box>
            </Fragment>
          ) : null}
        </Stack>
      </Content>
    </>
  )
}

export default App

interface IButtonUpload {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  style?: React.CSSProperties
  text?: string
  disable?: boolean
}

const MemoButtonUpload = memo(function ButtonUpload({
  onChange,
  style,
  text = 'Upload',
  disable,
}: IButtonUpload) {
  return (
    <Button
      disabled={disable}
      sx={{
        ...style,
        height: '60px',
        width: '248px',
        textTransform: 'none',
        fontSize: 18,
      }}
      variant='outlined'
      component='label'
      startIcon={<UploadFileIcon />}
    >
      <span>{text}</span>
      <input hidden accept='image/*' multiple type='file' onChange={onChange} />
    </Button>
  )
})
