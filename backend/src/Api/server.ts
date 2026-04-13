import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../doc/swaggerConfig";

// Middlewares
import { jsonApiResponseMiddleware } from "../Api/middleware/jsonApiResponseMiddleware";
import { errorHandlerMiddleware } from "../Api/middleware/errorhHandlerMiddleware";

// Routes
import { eventRoutes, registerEventRoutes } from "../Api/routes/eventRoute";
import { userRoutes, registerUserRoutes } from "../Api/routes/userRoute"; 
import analyticsRoutes from "../Api/routes/analyticsRoute";
import a2fRouter from "../Api/routes/a2fRoute";

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

const app = express();
const PORT = process.env.PORT || 8000;

// 1. CONNEXION MONGO
const mongoURI = process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017/analytics?authSource=admin';
async function connectMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Analytics connecté');
  } catch (err) {
    console.error('❌ Erreur de connexion Mongo :', err);
  }
}
connectMongo();

// 2. CONFIGURATION SÉCURITÉ & PARSERS (L'ordre est crucial ici)
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true
}));

app.use(cookieParser()); // Indispensable AVANT les routes pour lire req.cookies
app.use(express.json()); // Indispensable pour lire le body JSON
app.use(express.urlencoded({ extended: true }));

// 3. MIDDLEWARE DE RÉPONSE
app.use(jsonApiResponseMiddleware);

// 4. INSTANCIATION REPOS / USECASES / CONTROLLERS
const eventRepository = new EventRepositoryDatabase();
const userRepository = new UserRepositoryDatabase();

const createEventUseCase = new CreateEventUseCase(eventRepository);
const getAllEventUseCase = new GetAllEventUseCase(eventRepository);
const getOneEventUseCase = new GetOneEventUseCase(eventRepository);
const updateEventUseCase = new UpdateEventUseCase(eventRepository);
const deleteEventUseCase = new DeleteEventUseCase(eventRepository);

const createUserUseCase = new CreateUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

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

// 5. BRANCHEMENT DES ROUTES
// On enregistre les dépendances
registerEventRoutes(eventController);
registerUserRoutes(userController); 

// On déclare les endpoints
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/analytics", analyticsRoutes);
app.use("/api/a2f", a2fRouter); // Maintenant ton middleware auth dedans pourra lire le cookie

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. GESTION DES ERREURS (Toujours en dernier)
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});