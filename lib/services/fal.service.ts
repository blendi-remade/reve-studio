export interface FalWebhookPayload {
    request_id: string
    gateway_request_id: string
    status: 'OK' | 'ERROR'
    payload?: {
      images?: Array<{
        url: string
        content_type: string
        file_name: string
        file_size: number
      }>
      description?: string
    }
    error?: string
  }
  
  export class FalService {
    private apiKey: string
    private webhookUrl: string
  
    constructor() {
      this.apiKey = process.env.FAL_API_KEY!
      this.webhookUrl = process.env.NEXT_PUBLIC_APP_URL + '/api/fal/webhook'
    }
  
    static create() {
      return new FalService()
    }
  
    /**
     * Submit an image edit request to fal.ai Reve model
     * @see https://fal.ai/models/fal-ai/reve/edit/api
     */
    async submitImageEdit({
      prompt,
      imageUrls,
      requestId
    }: {
      prompt: string
      imageUrls: string[]
      requestId: string
    }): Promise<{ request_id: string }> {
      const response = await fetch(
        `https://queue.fal.run/fal-ai/reve/edit?fal_webhook=${encodeURIComponent(this.webhookUrl)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Key ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            image_url: imageUrls[0], // Reve uses image_url (singular) instead of image_urls
            num_images: 1,
            output_format: 'png'
          })
        }
      )
  
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`fal.ai API error: ${error}`)
      }
  
      const data = await response.json()
      return data
    }
  }