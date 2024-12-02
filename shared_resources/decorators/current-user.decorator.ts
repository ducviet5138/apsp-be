import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ICurrentUser } from "shared_resources/interfaces";

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext): ICurrentUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
