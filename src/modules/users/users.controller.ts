import { Context, Hono, type TypedResponse } from "hono";
import { UsersRepository } from "./users.repository";
import type { ApplicationEnvironment, ApplicationResult } from "../application.types";
import type {UserType} from './users.types';
import { ApplicationValidator } from "../application.validator";
import {
  IDParamSchema,
  type IDParamType,
} from "../application.types"

export class UsersController {
  constructor(private readonly repository: UsersRepository) {}

  public routes(): Hono {
    return new Hono()
      .get('/', this.findAll.bind(this))
      .get(
        '/:id',
        ApplicationValidator.validate('param', IDParamSchema),
        this.findId.bind(this),
      );
  }

  public async findAll(
    c: Context,
  ): Promise<TypedResponse<ApplicationResult<UserType[]>>> {
    return c.json({
      success: true,
      data: this.repository.findAll(),
    })
  }

  public async findId(
    c: Context<ApplicationEnvironment, "/:id", { out: {param: IDParamType } }>,
  ): Promise<TypedResponse<ApplicationResult<UserType>>> {
    const {id} = c.req.valid("param");
    const user = this.repository.findById(id);

    if(!user){
      return c.json({success: false, error: "User not found"});
    
  }
  return c.json({success: true, data: user});
}
}

