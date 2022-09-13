import { Schema, model } from "mongoose";

interface IGroup {
  name: string;
  description: string;
  picture: string;
}

const groupSchema = new Schema<IGroup>({

});
