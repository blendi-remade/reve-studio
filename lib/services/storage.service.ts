import { Storage } from '@google-cloud/storage'

interface GCSFile {
  name: string
  size: number
  updated: string
}

export class StorageService {
  private storage: Storage
  private bucketName: string

  constructor() {
    this.storage = new Storage({
      credentials: JSON.parse(process.env.GCS_CREDENTIALS!)
    })
    this.bucketName = process.env.GCS_BUCKET_NAME!
  }

  static create() {
    return new StorageService()
  }

  // Generate a signed upload URL for image uploads
  async generateUploadUrl(
    fileName: string,
    contentType: string,
    directory: string = 'banana-peel'
  ): Promise<{ uploadUrl: string; filePath: string; publicUrl: string }> {
    const fileExtension = fileName.split('.').pop()
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    const filePath = `${directory}/${uniqueFileName}`

    const bucket = this.storage.bucket(this.bucketName)
    const file = bucket.file(filePath)

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 30 * 60 * 1000, // 30 minutes expiration
      contentType: contentType,
      queryParams: {
        "x-goog-content-length-range": "0,10485760" // Allow files up to 10MB
      }
    })

    // Get the public URL for the file
    const publicUrl = this.getPublicUrl(filePath)

    return {
      uploadUrl: url,
      filePath: filePath,
      publicUrl: publicUrl
    }
  }

  // Generate a signed download URL for viewing images
  async generateSignedDownloadUrl(
    fullPath: string,
    expirationMinutes: number = 60 // 1 hour
  ): Promise<string> {
    // Extract just the path portion after the bucket name if a full GCS URL is provided
    const path = fullPath.replace(`https://storage.googleapis.com/${this.bucketName}/`, '')
    
    const bucket = this.storage.bucket(this.bucketName)
    const file = bucket.file(path)
    
    // Generate a signed URL that expires after the specified minutes
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + (expirationMinutes * 60 * 1000), 
    })
    
    return url
  }

  // Get public URL (if bucket is public)
  getPublicUrl(path: string): string {
    const bucket = this.storage.bucket(this.bucketName)
    const file = bucket.file(path)
    return file.publicUrl()
  }

  // Convert stored path to public URL
  pathToPublicUrl(path: string): string {
    // If it's already a full URL, return as is
    if (path.startsWith('http')) {
      return path
    }
    // Otherwise convert path to public URL
    return this.getPublicUrl(path)
  }

  // Delete a file
  async deleteFile(path: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName)
    const file = bucket.file(path)
    await file.delete()
  }

  // Check if file exists
  async fileExists(path: string): Promise<boolean> {
    const bucket = this.storage.bucket(this.bucketName)
    const file = bucket.file(path)
    const [exists] = await file.exists()
    return exists
  }

  // List files in directory
  async listFiles(prefix: string = 'banana-peel/'): Promise<GCSFile[]> {
    const bucket = this.storage.bucket(this.bucketName)
    const [files] = await bucket.getFiles({ prefix })
    
    return Promise.all(files.map(async file => {
      const [metadata] = await file.getMetadata()
      return {
        name: file.name,
        size: parseInt(metadata.size as string),
        updated: metadata.updated || new Date().toISOString()
      }
    }))
  }
}