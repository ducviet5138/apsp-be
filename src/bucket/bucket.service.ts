import * as fs from "fs";
import * as mime from "mime-types";
import * as path from "path";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Response } from "express";
import { Bucket } from "shared_resources/entities";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class BucketService {
  private readonly logger = new Logger(this.constructor.name);
  private bucketPath: string;

  constructor() {
    this.bucketPath = path.join(process.cwd(), "files");
  }

  upload(file: Express.Multer.File) {
    try {
      const generatedUUID = uuidv4();
      const filePath = path.join(this.bucketPath, generatedUUID);

      if (!fs.existsSync(this.bucketPath)) {
        fs.mkdirSync(this.bucketPath, { recursive: true });
      }

      // Save the file locally with the new UUID name
      fs.writeFileSync(filePath, file.buffer);

      return Bucket.save({
        id: generatedUUID,
        name: file.originalname,
      });
    } catch (error) {
      this.logger.error(error);
      return new InternalServerErrorException(error);
    }
  }

  async getFile(id: string, response: Response) {
    try {
      const file = await Bucket.findOne({ where: { id } });
      if (!file) {
        throw new Error("File not found");
      }

      const filePath = path.join(this.bucketPath, file.id);
      // Stream the file
      const fileStream = fs.createReadStream(filePath);

      // Dynamically determine the MIME type
      const mimeType = mime.lookup(filePath) || "application/octet-stream";

      // Set appropriate headers
      response.setHeader("Content-Type", mimeType);
      response.setHeader("Content-Disposition", `inline; filename="${file.name}"`);

      fileStream.pipe(response);
    } catch (error) {
      this.logger.error(error);
      return new InternalServerErrorException(error);
    }
  }
}
