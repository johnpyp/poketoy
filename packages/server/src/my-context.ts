import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";

export interface MySessionData {
  userId?: string;
}
export interface MyContext {
  req: Request & { session: MySessionData };
  res: Response;
  em: EntityManager<IDatabaseDriver<Connection>>;
}
