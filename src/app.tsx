import React, { useState, Fragment, useCallback, memo } from 'react'
import Layout from './components/layouts/layout'
import { Box, Button, IconButton, Stack } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTypeImage } from './zustand/type-converter'
import LoadingButton from '@mui/lab/LoadingButton'

const App = () => {
  const { type_image } = useTypeImage((state) => state)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [filePreview, setFilesPreview] = useState<
    { name: string; link: Blob | null }[]
  >([])
  const [constType, setConstType] = useState('')
  const [loaderConvert, setLoaderConvert] = useState(false)

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploader = [...uploadFiles],
        preview = [...filePreview]
      const selectFiles: File[] = Array.prototype.slice.call(e.target.files)

      for (let i = 0; i < selectFiles.length; i++) {
        const file = selectFiles[i]
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
        } else {
          alert('Files upload duplicate.')
          break
        }
      }

      setUploadFiles(uploader)
      setFilesPreview(preview)
    },
    [uploadFiles, filePreview],
  )

  const handleRemoveFile = (_name: string) => {
    const isAmountFile = uploadFiles.length > 0 && filePreview.length > 0
    if (isAmountFile) {
      setUploadFiles((value) => value.filter((t) => t.name !== _name))
      setFilesPreview((value) => value.filter((t) => t.name !== _name))
    }
  }

  const modifyImage = useCallback(async () => {
    setLoaderConvert(true)

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
    const previewSpread = [...filePreview]
    if (uploadFiles.length > 0 && filePreview.length > 0) {
      const previewsFilterUnlink = filePreview.filter((d) => !d.link)

      const mapConverted: Promise<{
        name: string
        link: Blob
      }>[] = []

      for (let i = 0; i < previewsFilterUnlink.length; i++) {
        const preview = previewsFilterUnlink[i]
        if (!preview.link && preview.link === null) {
          const file = uploadFiles.find((f) => f.name === preview.name)
          if (file) {
            const converted = convertImageType(file, `image/${type_image}`)
            mapConverted.push(converted)
          }
        }
      }

      if (mapConverted.length > 0) {
        const resolveConverted = [
          ...previewSpread,
          ...(await Promise.all(mapConverted)),
        ].filter((a) => a.link)
        setFilesPreview(resolveConverted)
      } else setFilesPreview((files) => files)
    }
    setLoaderConvert(false)
  }, [filePreview])

  const loadFile = (data: Blob, name: string) => {
    const url = window.URL.createObjectURL(data)
    const tempLink = document.createElement('a')
    tempLink.href = url
    tempLink.setAttribute('download', `${name.split('.')[0]}.${constType}`)
    tempLink.click()
  }

  return (
    <>
      <Layout>
        {uploadFiles.length === 0 ? (
          <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <MemoButtonUpload onChange={handleChangeFile} />
          </Box>
        ) : null}

        {filePreview !== null ? (
          <Fragment>
            <Stack spacing={3} mt={4}>
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
                <LoadingButton
                  disabled={filePreview.every((c) => c.link)}
                  loading={loaderConvert}
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
                </LoadingButton>
              </Box>
            </Stack>
          </Fragment>
        ) : null}
      </Layout>
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
