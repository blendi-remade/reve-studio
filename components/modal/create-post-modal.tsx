'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Zap, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreatePostModalProps {
  onClose: () => void
}

export function CreatePostModal({ onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }

    setFile(selectedFile)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const uploadFile = async (file: File): Promise<string> => {
    // Get signed upload URL
    const uploadUrlResponse = await fetch('/api/storage/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type
      })
    })

    if (!uploadUrlResponse.ok) {
      throw new Error('Failed to get upload URL')
    }

    const { uploadUrl, publicUrl } = await uploadUrlResponse.json()

    // Upload file to GCS with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(Math.round(percentComplete))
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(publicUrl) // Return the public URL instead of file path
        } else {
          reject(new Error('Upload failed'))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
  }

  const handleSubmit = async () => {
    if (!file || !title.trim()) {
      setError('Please add both an image and title')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Upload image to GCS
      const imageUrl = await uploadFile(file)

      // Create post in database
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          image_url: imageUrl // This is now the full public URL
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const { post } = await response.json()
      
      // Navigate to the new post
      router.push(`/post/${post.id}`)
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err instanceof Error ? err.message : 'Failed to create post')
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-white/80" onClick={onClose}></div>
      
      {/* Scrollable container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto reve-scroll">
        <Card className="relative border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-0 transition-transform bg-white m-4">
          {/* Fun corner decorations */}
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-200 rotate-12 border-2 border-black"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-black rotate-45"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-10 rotate-[12deg] hover:rotate-0"
          >
            <X className="w-4 h-4" />
          </button>
          
          <CardHeader className="text-center border-b-2 border-black border-dashed pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-black text-white p-4 rotate-[2deg] hover:rotate-0 transition-transform">
                <Zap className="w-12 h-12" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono">
              🍌 Create New Post
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2 rotate-[-0.5deg]">
              Upload an image to start the remix chain!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6 pb-6">
            {error && (
              <div className="bg-red-100 border-2 border-red-500 p-3 rotate-[0.5deg] text-sm text-red-700">
                {error}
              </div>
            )}
            
            {/* Title input */}
            <div className="space-y-2">
              <label className="text-sm font-mono font-semibold rotate-[-0.5deg] inline-block">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your masterpiece a title..."
                className="w-full px-4 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200 outline-none font-mono"
                disabled={uploading}
              />
            </div>

            {/* Image upload area */}
            <div className="space-y-2">
              <label className="text-sm font-mono font-semibold rotate-[0.5deg] inline-block">
                Image
              </label>
              <div 
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`
                  border-2 border-black border-dashed p-8 text-center cursor-pointer
                  transition-all duration-200 rotate-[-0.5deg] hover:rotate-0
                  ${preview ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}
                  ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                    {!uploading && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                          setPreview(null)
                          setUploadProgress(0)
                        }}
                        className="border-2 border-black hover:bg-black hover:text-white"
                      >
                        Change Image
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-4 rotate-12" />
                    <p className="text-lg font-semibold mb-2">Drop an image here</p>
                    <p className="text-sm text-gray-600 font-mono">or click to browse</p>
                  </>
                )}
              </div>
            </div>

            {/* Upload progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-mono">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 border-2 border-black h-8 relative overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-yellow-200 border-r-2 border-black transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-black opacity-10 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Demo content to show scrolling */}
            <div className="space-y-4">
              <div className="border-2 border-black border-dashed p-4 bg-yellow-50">
                <h3 className="font-mono font-bold mb-2 rotate-[-0.5deg]">✨ Pro Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rotate-45"></div>
                    <span>Best results with high-contrast images</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rotate-45"></div>
                    <span>Square images work great for remixing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rotate-45"></div>
                    <span>Clear subjects get the best AI edits</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-2 border-black p-4 bg-gray-50 rotate-[0.5deg]">
                <h3 className="font-mono font-bold mb-2">🍌 What happens next?</h3>
                <p className="text-sm">
                  Your image becomes the root of a remix tree! Other users can add prompts 
                  to edit your image, creating a branching chain of AI-generated variations.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t-2 border-black border-dashed pt-6">
            <div className="w-full flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={uploading}
                className="flex-1 border-2 border-black hover:bg-gray-100 rotate-[0.5deg] hover:rotate-0"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!file || !title.trim() || uploading}
                className="flex-1 bg-black text-white border-2 border-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] rotate-[-0.5deg] hover:rotate-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Create Post
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}