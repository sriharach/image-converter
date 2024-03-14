import React, { useState, Fragment, useCallback } from 'react'
import { Box, Button, IconButton, Stack } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTypeName } from '@/zustand/type-converter'
import ButtonUpload from '../common/ButtonUpload'
import convertImageType from '@/libs/convertImageType'
import Pspdfkit from 'pspdfkit'
import { EHeaderStoreState, useHeaderStore } from '@/zustand/header'

// Pspdfkit.load({
//   container: '#pspdfkit',
//   document:
// })

const ImageConvert = () => {
  const { type_convert_name } = useTypeName((state) => state)
  const { text: titleKeyname } = useHeaderStore((state) => state)

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

  const modityFile = useCallback(async () => {
    setLoaderConvert(true)

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
            switch (titleKeyname) {
              case EHeaderStoreState.IMAGE:
                {
                  const converted = convertImageType(
                    file,
                    `image/${type_convert_name}`,
                    uploadFiles,
                  )
                  mapConverted.push(converted)
                }
                break
              case EHeaderStoreState.FILE:
                {
                  const blob = new Blob(
                    [new Uint8Array(await file.arrayBuffer())],
                    { type: 'application/pdf' },
                  )
                  mapConverted.push(
                    new Promise((resolve) => {
                      const findName = uploadFiles.find(
                        (f) => f.name === file.name,
                      )
                      if (findName) {
                        resolve({
                          name: findName.name,
                          link: blob,
                        })
                      }
                    }),
                  )
                }
                break

              default:
                break
            }
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
      {uploadFiles.length === 0 ? (
        <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonUpload
            accept={titleKeyname === EHeaderStoreState.FILE ? '' : 'image/*'}
            startIcon={<UploadFileIcon />}
            onChange={handleChangeFile}
          />
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
                        {`Convert to: ${type_convert_name.toUpperCase()}`}
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
                          onClick={() => loadFile(file.link as Blob, file.name)}
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
              <ButtonUpload
                disabled={filePreview.length >= 10}
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
                onClick={modityFile}
              >
                <span>Convert Files</span>
              </LoadingButton>
            </Box>
          </Stack>
        </Fragment>
      ) : null}
    </>
  )
}

export default ImageConvert
