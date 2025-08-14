import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Try to send to n8n webhook first
    try {
      // Convert body to URL parameters for GET request
      const params = new URLSearchParams({
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        phone: body.phone || '',
        email: body.email || '',
        company: body.company || '',
        niche: body.niche || '',
        hasVisuals: body.hasVisuals || '',
        hasLogo: body.hasLogo || '',
        currentWebsite: body.currentWebsite || '',
        timeline: body.timeline || '',
        description: body.description || '',
        consent: String(body.consent || false),
        source: body.source || 'Kap Numérique',
        submittedAt: body.submittedAt || new Date().toISOString()
      })
      
      // Try webhook
      const response = await fetch(
        `https://n8n.digiqo.fr/webhook/5231cf96-cdfc-4514-a9d6-fbc3ec9081f5?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      )

      // If webhook works, return success
      if (response.ok) {
        const data = await response.json().catch(() => ({ message: 'Success' }))
        console.log('Form submitted to n8n webhook successfully')
        return NextResponse.json({ success: true, data, source: 'webhook' })
      }
    } catch (webhookError) {
      console.warn('Webhook failed, falling back to local storage:', webhookError)
    }

    // Fallback: Save to local file (for development)
    const submissionsDir = path.join(process.cwd(), 'submissions')
    
    // Create submissions directory if it doesn't exist
    try {
      await fs.access(submissionsDir)
    } catch {
      await fs.mkdir(submissionsDir, { recursive: true })
    }
    
    // Create unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `submission-${timestamp}.json`
    const filepath = path.join(submissionsDir, filename)
    
    // Add submission metadata
    const submission = {
      ...body,
      submittedAt: body.submittedAt || new Date().toISOString(),
      source: body.source || 'Kap Numérique',
      savedTo: 'local'
    }
    
    // Write submission to file
    await fs.writeFile(filepath, JSON.stringify(submission, null, 2))
    
    console.log(`Form submission saved locally to: ${filename}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      source: 'local',
      filename 
    })
    
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}