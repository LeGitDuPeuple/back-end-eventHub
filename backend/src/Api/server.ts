import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';

// MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017/analytics?authSource=admin';

async function connectMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log(' MongoDB Analytics connecté');
  } catch (err) {
    console.error(' Erreur de connexion Mongo :', err);
  }
}

connectMongo();
// Middlewares
import { jsonApiResponseMiddleware } from "../Api/middleware/jsonApiResponseMiddleware";
import { errorHandlerMiddleware } from "../Api/middleware/errorhHandlerMiddleware";

// Routes
import { eventRoutes, registerEventRoutes } from "../Api/routes/eventRoute";
import { userRoutes, registerUserRoutes } from "../Api/routes/userRoute"; 
import analyticsRoutes from "../Api/routes/analyticsRoute";
// Controller
import { EventController } from "../Api/controller/eventController";
import { UserController } from "../Api/controller/userController";
// Usecases
import { CreateEventUseCase } from "../application/usecases/createEventUsecase";
import { GetAllEventUseCase } from "../application/usecases/getAllEventUsecaset"
import { GetOneEventUseCase } from "../application/usecases/getOneEventUsecase";
import { UpdateEventUseCase } from "../application/usecases/updateEventUsecase";
import { DeleteEventUseCase } from "../application/usecases/deleteEventUsecase";
import { CreateUserUseCase } from "../application/usecases/user/createUserUsecase"; 
import { LoginUserUseCase } from "../application/usecases/user/loginUserUsecase"; 
// Repository Prisma
import { EventRepositoryDatabase } from "../infrastrucrute/repository/eventRepositoryDatabase";
import { UserRepositoryDatabase } from "../infrastrucrute/repository/userRepositoryDatabase";
// Doc Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../doc/swaggerConfig";
// Sécurity
import helmet from "helmet"
import cors from "cors"

const app = express();
// sécurité
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'], // Ajoute bien le 4173 ici
    credentials: true
}))
app.use(cookieParser());

// format de données
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//middleware response
app.use(jsonApiResponseMiddleware);
// port
const PORT = process.env.PORT || 8000;

// Repositories
const eventRepository = new EventRepositoryDatabase();
const userRepository = new UserRepositoryDatabase();

// UseCases Events
const createEventUseCase = new CreateEventUseCase(eventRepository);
const getAllEventUseCase = new GetAllEventUseCase(eventRepository);
const getOneEventUseCase = new GetOneEventUseCase(eventRepository);
const updateEventUseCase = new UpdateEventUseCase(eventRepository);
const deleteEventUseCase = new DeleteEventUseCase(eventRepository);


const createUserUseCase = new CreateUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

// Controller Event
const eventController = new EventController(
  createEventUseCase,
  getAllEventUseCase,
  getOneEventUseCase,
  updateEventUseCase,
  deleteEventUseCase
);

const userController = new UserController(
  createUserUseCase,
  loginUserUseCase
);

// Branchement des routes
registerEventRoutes(eventController);
registerUserRoutes(userController); 

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/analytics", analyticsRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});