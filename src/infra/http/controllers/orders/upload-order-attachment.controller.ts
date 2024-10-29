import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadOrderAttachmentUseCase } from "@/domain/logistics/application/use-cases/orders/upload-order-attachment";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

const uploadOrderAttachmentSchema = z.object({
  orderId: z.string().uuid(),
  delivererId: z.string().uuid()
})

type UploadOrderAttachmentSchemaType = z.infer<typeof uploadOrderAttachmentSchema>

@ApiBearerAuth()
@ApiTags('Orders')
@Controller()
export class UploadOrderAttachmentController {
  constructor(private uploadOrderAttachmentUseCase: UploadOrderAttachmentUseCase) {}

  @ApiOperation({ summary: 'Upload order attachment' })
  @ApiBody({ description: 'Order attachment', type: 'file', required: true })
  @ApiParam({ name: 'orderId', type: 'string', required: true })
  @ApiParam({ name: 'delivererId', type: 'string', required: true })
  @Post("/orders/:orderId/deliverers/:delivererId/attachments")
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })
        ]
      })
    )
    file: Express.Multer.File,
    @Param(new ZodValidationPipe(uploadOrderAttachmentSchema)) params: UploadOrderAttachmentSchemaType
  ) {
    const { delivererId, orderId } = params

    const result = await this.uploadOrderAttachmentUseCase.execute({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
      orderId,
      delivererId
    })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { orderAttachment } = result.value

    return {
      orderAttachmentId: orderAttachment.id.toString()
    }
  }
}