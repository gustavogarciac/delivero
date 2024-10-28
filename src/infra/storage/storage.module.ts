import { Module } from '@nestjs/common'

import { EnvModule } from '../env/env.module'
import { Uploader } from '@/domain/logistics/application/uploader/uploder'
import { R2Storage } from './r2-storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}