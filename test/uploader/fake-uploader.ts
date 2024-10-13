import { Uploader, UploaderParams } from '@/domain/logistics/application/uploader/uploder'
import { randomUUID } from 'crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload(params: UploaderParams): Promise<{ url: string }> {
    const upload: Upload = {
      fileName: params.fileName,
      url: randomUUID()
    }

    await this.uploads.push(upload)

    return { url: upload.url }
  }
}