import { IBucket } from "../interfaces";
import { BaseEntity, Entity } from "typeorm";

@Entity()
export class Bucket extends BaseEntity implements IBucket {}
