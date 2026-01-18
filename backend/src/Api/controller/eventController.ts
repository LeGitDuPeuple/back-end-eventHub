import { Request, Response, NextFunction } from "express";
import { CreateEventUseCase } from "../../application/usecases/createEventUsecase";
import { GetAllEventUseCase } from "../../application/usecases/getAllEventUsecaset";
import { GetOneEventUseCase } from "../../application/usecases/getOneEventUsecase";
import { UpdateEventUseCase } from "../../application/usecases/updateEventUsecase";
import { DeleteEventUseCase } from "../../application/usecases/deleteEventUsecase";

export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getAllEventUseCase: GetAllEventUseCase,
    private readonly getOneEventUseCase: GetOneEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase
  ) {}

  // POST /api/events
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.createEventUseCase.execute(req.body);
      res.jsonSuccess(event, 201);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/events
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await this.getAllEventUseCase.execute();
      res.jsonSuccess(events, 200);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/events/:id
 async getById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const event = await this.getOneEventUseCase.execute(id);
    res.jsonSuccess(event);
  } catch (error) {
    next(error);
  }
}

  // PUT /api/events/:id
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedEvent = await this.updateEventUseCase.execute({
        id,
        ...req.body,
      });
      res.jsonSuccess(updatedEvent);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/events/:id
 async delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;

    await this.deleteEventUseCase.execute(id);

    res.jsonSuccess({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
}
}