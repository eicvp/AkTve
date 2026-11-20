import { Context, Hono, type TypedResponse } from "hono";
import { UsersRepository } from "./users.repository";
import type { ApplicationResult } from "../application.types";
import type {UserType} from './users.types';

export class UsersController {
  constructor(private readonly repository: UsersRepository) {}

  public routes(): Hono {
    return new Hono()
      .get('/', this.findAll.bind(this));
  }

  public async findAll(
    c: Context<ApplicationEnvironment>
  ): Promise<TypedResponse<ApplicationResult<UserType[]>>> {
    return c.json({
      success: true,
      data: this.repository.findAll(),
    })
  }

  public async findById(
    c: Context<
    ApplicationEnviroment,
    "/:id",
    { out: { param: IDParamType } }
    >
  ): Promise<TypedResponse<ApplicationResult<UserType>>> {
    const { id } = c.req.valid("param");
    const user = this.repository.findById(id);

    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({
        success: true,
        data: user,
    })
  }
}