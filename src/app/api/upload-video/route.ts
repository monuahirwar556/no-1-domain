import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const ALLOWED_VIDEO_EXTS = ['.mp4', '.webm', '.mov']
const ALLOWED_VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

const ALLOWED_THUMB_EXTS = ['.jpg', '.jpeg', '.png', '.webp']
const ALLOWED_THUMB_MIMES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_THUMB_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized. Please sign in to upload files.' }, { status: 401 })
    }

    const formData = await request.formData()
    const videoFile = formData.get('video') as File | null
    const thumbnailFile = formData.get('thumbnail') as File | null

    if (!videoFile) {
      return NextResponse.json({ message: 'No video file provided' }, { status: 400 })
    }

    // Validate video size and MIME type
    if (videoFile.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ message: 'Video file size exceeds maximum limit of 50MB' }, { status: 400 })
    }

    const rawVideoExt = path.extname(videoFile.name || '').toLowerCase()
    const cleanVideoExt = ALLOWED_VIDEO_EXTS.includes(rawVideoExt) ? rawVideoExt : null
    if (!cleanVideoExt || !ALLOWED_VIDEO_MIMES.includes(videoFile.type)) {
      return NextResponse.json({ message: 'Invalid video format. Allowed formats: MP4, WebM, MOV' }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Generate safe unique filename
    const timestamp = Date.now()
    const videoFileName = `vid_${timestamp}_${Math.random().toString(36).substring(2, 8)}${cleanVideoExt}`
    const videoFilePath = path.join(uploadsDir, videoFileName)

    // Write video buffer to disk
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer())
    fs.writeFileSync(videoFilePath, videoBuffer)

    let thumbnailUrl = ''
    if (thumbnailFile) {
      if (thumbnailFile.size > MAX_THUMB_SIZE) {
        return NextResponse.json({ message: 'Thumbnail file size exceeds limit of 5MB' }, { status: 400 })
      }
      const rawThumbExt = path.extname(thumbnailFile.name || '').toLowerCase()
      const cleanThumbExt = ALLOWED_THUMB_EXTS.includes(rawThumbExt) ? rawThumbExt : null
      if (!cleanThumbExt || !ALLOWED_THUMB_MIMES.includes(thumbnailFile.type)) {
        return NextResponse.json({ message: 'Invalid thumbnail format. Allowed formats: JPG, PNG, WebP' }, { status: 400 })
      }

      const thumbFileName = `thumb_${timestamp}_${Math.random().toString(36).substring(2, 8)}${cleanThumbExt}`
      const thumbFilePath = path.join(uploadsDir, thumbFileName)
      const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer())
      fs.writeFileSync(thumbFilePath, thumbBuffer)
      thumbnailUrl = `/uploads/videos/${thumbFileName}`
    }

    return NextResponse.json({
      success: true,
      videoUrl: `/uploads/videos/${videoFileName}`,
      thumbnailUrl: thumbnailUrl || undefined,
      filename: videoFile.name,
      size: videoFile.size,
    })
  } catch (error: any) {
    console.error('Video upload error:', error)
    return NextResponse.json({ message: error?.message || 'Video upload failed' }, { status: 500 })
  }
}
