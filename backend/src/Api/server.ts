import express from "express";
import "dotenv/config";
// Middlewares
import { jsonApiResponseMiddleware } from "../Api/middleware/jsonApiResponseMiddleware";
import { errorHandlerMiddleware } from "../Api/middleware/errorhHandlerMiddleware";
// Routes
import { eventRoutes, registerEventRoutes } from "../Api/routes/eventRoute";
// Controller
import { EventController } from "../Api/controller/eventController";
// Usecases
import { CreateEventUseCase } from "../application/usecases/createEventUsecase";
import { GetAllEventUseCase } from "../application/usecases/getAllEventUsecaset"
import { GetOneEventUseCase } from "../application/usecases/getOneEventUsecase";
import { UpdateEventUseCase } from "../application/usecases/updateEventUsecase";
import { DeleteEventUseCase } from "../application/usecases/deleteEventUsecase";
// Repository Prisma
import { EventRepositoryDatabase } from "../infrastrucrute/repository/eventRepositoryDatabase";
// Doc Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../doc/swaggerConfig";


const app = express();
const PORT = process.env.PORT || 8000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(jsonApiResponseMiddleware);

// Repository
const eventRepository = new EventRepositoryDatabase();

// UseCases
const createEventUseCase = new CreateEventUseCase(eventRepository);
const getAllEventUseCase = new GetAllEventUseCase(eventRepository);
const getOneEventUseCase = new GetOneEventUseCase(eventRepository);
const updateEventUseCase = new UpdateEventUseCase(eventRepository);
const deleteEventUseCase = new DeleteEventUseCase(eventRepository);

// Controller
const eventController = new EventController(
  createEventUseCase,
  getAllEventUseCase,
  getOneEventUseCase,
  updateEventUseCase,
  deleteEventUseCase
);

registerEventRoutes(eventController);

app.use("/api/events", eventRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
