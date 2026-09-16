import { useRef, useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
}

const BUCKET = 'blog-images'

function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(197, 160, 89, 0.2)' }}>
          <img src={value} alt="Featured" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-3 right-3 p-2 rounded-full bg-obsidian/80 text-white hover:text-red-400 transition-colors"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-48 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
          style={{ borderColor: 'rgba(197, 160, 89, 0.25)' }}
        >
          {uploading ? <Loader2 size={28} className="animate-spin" /> : <ImagePlus size={28} />}
          <span className="text-sm">{uploading ? 'Uploading...' : 'Click to upload a featured image'}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  )
}

export default ImageUploader
