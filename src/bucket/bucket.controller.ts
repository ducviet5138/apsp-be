import { BucketService } from "./bucket.service";
import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";

@Controller("files")
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Post()
  @UseGuards(FirebaseJwtAuthGuard)
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

  @Delete(":id")
  @UseGuards(FirebaseJwtAuthGuard)
  deleteFile(@Param("id") id: string) {
    return this.bucketService.deleteFile(id);
  }

  @Put(":id")
  @UseGuards(FirebaseJwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  updateFile(
    @Param("id") id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif|bmp|webp)$/ })],
      })
    )
    file: Express.Multer.File
  ) {
    return this.bucketService.update(id, file);
  }
}
