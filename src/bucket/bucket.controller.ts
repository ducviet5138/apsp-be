import { BucketService } from "./bucket.service";
import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";

@Controller("files")
@UseGuards(FirebaseJwtAuthGuard)
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif|bmp|webp)$/ })],
      })
    )
    file: Express.Multer.File
  ) {
    return this.bucketService.upload(file);
  }

  @Get(":id")
  getFile(@Param("id") id: string, @Res() response: Response) {
    return this.bucketService.getFile(id, response);
  }
}
