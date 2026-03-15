export interface EventProps {
  id?: string;
  title: string;
  description: string;
  startDate: Date;
  location: string;
  capacity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Event {
  public readonly id?: string;
  public readonly title: string;
  public readonly description: string;
  public readonly startDate: Date;
  public readonly location: string;
  public readonly capacity: number;
  public readonly price: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: EventProps) {
    this.validate(props);

    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.startDate = props.startDate;
    this.location = props.location;
    this.capacity = props.capacity;
    this.price = props.price;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: EventProps): void {
  if (!props.title || props.title.trim().length === 0) {
    throw new Error("Event title is required");
  }

  if (!props.description || props.description.trim().length === 0) {
    throw new Error("Event description is required");
  }

//   if (props.startDate < new Date()) {
//     throw new Error("Event start date must be in the future");
// } 


  if (props.capacity <= 0) {
    throw new Error("Event capacity must be greater than 0");
  }

  if (props.price < 0) {
    throw new Error("Event price cannot be negative");
  }

  if (!props.location || props.location.trim().length === 0) {
    throw new Error("Event location is required");
  }
}
}