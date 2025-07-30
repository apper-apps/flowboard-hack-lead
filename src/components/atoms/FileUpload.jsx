import React, { useState, useRef, useCallback } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

const FileUpload = ({ 
  onFilesChange, 
  maxFiles = 5, 
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif'],
  className = "",
  files = []
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const fileInputRef = useRef(null)

  const validateFile = useCallback((file) => {
    // Check file size
    if (file.size > maxSize) {
      toast.error(`File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`)
      return false
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      toast.error(`File type "${fileExtension}" is not supported`)
      return false
    }

    return true
  }, [maxSize, acceptedTypes])

  const processFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList)
    const validFiles = []

    // Check total file count
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate each file
    for (const file of newFiles) {
      if (validateFile(file)) {
        // Create file object with metadata
        const fileObj = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        }
        validFiles.push(fileObj)
      }
    }

    if (validFiles.length > 0) {
      // Simulate upload progress
      validFiles.forEach(fileObj => {
        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 0 }))
        
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileObj.id] || 0
            if (currentProgress >= 100) {
              clearInterval(interval)
              return prev
            }
            return { ...prev, [fileObj.id]: currentProgress + 10 }
          })
        }, 100)
      })

      onFilesChange([...files, ...validFiles])
      toast.success(`${validFiles.length} file(s) uploaded successfully`)
    }
  }, [files, maxFiles, validateFile, onFilesChange])

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles)
    }
  }, [processFiles])

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = e.target.files
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles)
    }
    // Clear input value to allow selecting same file again
    e.target.value = ''
  }, [processFiles])

  const handleRemoveFile = useCallback((fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    onFilesChange(updatedFiles)
    setUploadProgress(prev => {
      const { [fileId]: removed, ...rest } = prev
      return rest
    })
    toast.success('File removed')
  }, [files, onFilesChange])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase()
    switch (extension) {
      case 'pdf': return 'FileText'
      case 'doc':
      case 'docx': return 'FileText'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'Image'
      default: return 'File'
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5",
          isDragOver && "border-primary bg-primary/10 scale-105",
          "file-upload-zone"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-200",
            isDragOver && "bg-primary text-white scale-110"
          )}>
            <ApperIcon name="Upload" size={24} />
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {acceptedTypes.join(', ')} up to {Math.round(maxSize / 1024 / 1024)}MB each
            </p>
            <p className="text-xs text-gray-400">
              Maximum {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Attached Files ({files.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {files.map((fileObj) => {
              const progress = uploadProgress[fileObj.id] || 100
              const isUploading = progress < 100

              return (
                <div
                  key={fileObj.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <ApperIcon 
                      name={getFileIcon(fileObj.name)} 
                      size={20} 
                      className="text-gray-500" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {fileObj.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileObj.size)}
                    </p>
                    
                    {isUploading && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploading... {progress}%
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isUploading && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Simulate download
                            toast.info(`Downloading ${fileObj.name}`)
                          }}
                          className="text-gray-500 hover:text-primary"
                        >
                          <ApperIcon name="Download" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile(fileObj.id)
                          }}
                          className="text-gray-500 hover:text-error"
                        >
                          <ApperIcon name="X" size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload